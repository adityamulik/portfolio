import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const SLUG = /^[a-z0-9-]{1,80}$/;
const MAX_COMMENTS = 200;
const MAX_BODY = 1200;
const MAX_NAME = 80;
const STORE_NAME = "article-feedback";
const DEV_FILE = path.join(process.cwd(), ".netlify", "article-feedback.json");

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function cleanText(value, max) {
  return String(value ?? "")
    .replaceAll("\u0000", "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function emptyState() {
  return { likes: 0, comments: [] };
}

function publicState(state, persistent) {
  const comments = Array.isArray(state.comments) ? state.comments : [];
  return {
    likes: Number(state.likes) || 0,
    comments: comments.map((comment) => ({
      id: comment.id,
      name: comment.name,
      body: comment.body,
      at: comment.at,
    })),
    persistent,
  };
}

function onLambda() {
  try {
    return process.cwd().startsWith("/var/task");
  } catch {
    return false;
  }
}

function blobStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function openBlobs() {
  try {
    return blobStore();
  } catch {
    return null;
  }
}

async function loadDevFile() {
  try {
    return JSON.parse(await readFile(DEV_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function saveDevFile(data) {
  await mkdir(path.dirname(DEV_FILE), { recursive: true });
  await writeFile(DEV_FILE, JSON.stringify(data, null, 2), "utf8");
}

async function loadState(slug) {
  const store = openBlobs();
  if (store) {
    const data = await store.get(slug, { type: "json", consistency: "strong" });
    return { state: data && typeof data === "object" ? data : emptyState(), persistent: true };
  }
  if (onLambda()) {
    throw new Error("Netlify Blobs is not available in this function.");
  }
  const all = await loadDevFile();
  return { state: all[slug] || emptyState(), persistent: false };
}

async function saveState(slug, state) {
  const store = openBlobs();
  if (store) {
    await store.setJSON(slug, state);
    return true;
  }
  if (onLambda()) {
    throw new Error("Netlify Blobs is not available in this function.");
  }
  const all = await loadDevFile();
  all[slug] = state;
  await saveDevFile(all);
  return false;
}

function rateKey(event, slug) {
  const headers = event.headers || {};
  const ip = headers["x-nf-client-connection-ip"] || headers["x-forwarded-for"] || "local";
  return createHash("sha256").update(`${ip}:${slug}`).digest("hex").slice(0, 16);
}

function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
}

export async function handler(event) {
  const method = event.httpMethod || "GET";
  if (method === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }

  const slug = cleanText(event.queryStringParameters?.slug || "", 80);

  try {
    if (method === "GET") {
      if (!SLUG.test(slug)) {
        return json(400, { error: "Unknown article." });
      }
      const loaded = await loadState(slug);
      return json(200, publicState(loaded.state, loaded.persistent));
    }

    if (method !== "POST") {
      return json(405, { error: "Method not allowed." });
    }

    let payload;
    try {
      payload = parseBody(event);
    } catch {
      return json(400, { error: "Invalid request." });
    }

    const postSlug = cleanText(payload.slug, 80);
    if (!SLUG.test(postSlug)) {
      return json(400, { error: "Unknown article." });
    }

    if (cleanText(payload.website, 80)) {
      const loaded = await loadState(postSlug);
      return json(200, publicState(loaded.state, loaded.persistent));
    }

    const loaded = await loadState(postSlug);
    const state = loaded.state;
    const action = String(payload.action || "");

    if (action === "like" || action === "unlike") {
      const nextLikes =
        action === "like" ? Number(state.likes || 0) + 1 : Math.max(0, Number(state.likes || 0) - 1);
      const next = { ...state, likes: nextLikes };
      const persistent = await saveState(postSlug, next);
      return json(200, publicState(next, persistent));
    }

    if (action !== "comment") {
      return json(400, { error: "Unknown action." });
    }

    const body = cleanText(payload.body, MAX_BODY);
    const name = cleanText(payload.name, MAX_NAME);
    if (body.length < 2) {
      return json(400, { error: "Write a short comment first." });
    }

    const comments = Array.isArray(state.comments) ? state.comments : [];
    if (comments.length >= MAX_COMMENTS) {
      return json(429, { error: "This article is not taking more comments right now." });
    }

    const stamp = comments[comments.length - 1]?.at;
    const key = rateKey(event, postSlug);
    if (stamp && Date.now() - Date.parse(stamp) < 8000 && comments[comments.length - 1]?.key === key) {
      return json(429, { error: "Please wait a moment before commenting again." });
    }

    const comment = {
      id: crypto.randomUUID(),
      name: name || "Anonymous",
      body,
      at: new Date().toISOString(),
      key,
    };
    const next = {
      likes: Number(state.likes) || 0,
      comments: [...comments, comment],
    };
    const persistent = await saveState(postSlug, next);
    return json(200, publicState(next, persistent));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Storage unavailable.";
    return json(503, { error: "Could not save that just now.", detail: message });
  }
}

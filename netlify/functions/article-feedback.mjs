import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SLUG = /^[a-z0-9-]{1,80}$/;
const MAX_COMMENTS = 200;
const MAX_BODY = 1200;
const MAX_NAME = 80;
const FILE_STORE = path.join("/tmp", "article-feedback.json");

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
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

function publicState(state) {
  const comments = Array.isArray(state.comments) ? state.comments : [];
  return {
    likes: Number(state.likes) || 0,
    comments: comments.map((comment) => ({
      id: comment.id,
      name: comment.name,
      body: comment.body,
      at: comment.at,
    })),
  };
}

async function loadAll() {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("article-feedback");
    const data = await store.get("all", { type: "json" });
    if (data && typeof data === "object") {
      return data;
    }
  } catch {
    // Fall through to the local file used in development.
  }
  try {
    return JSON.parse(await readFile(FILE_STORE, "utf8"));
  } catch {
    return {};
  }
}

async function saveAll(data) {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("article-feedback");
    await store.setJSON("all", data);
    return;
  } catch {
    // Fall through to the local file used in development.
  }
  await mkdir(path.dirname(FILE_STORE), { recursive: true });
  await writeFile(FILE_STORE, JSON.stringify(data), "utf8");
}

function rateKey(req, slug) {
  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "local";
  return createHash("sha256").update(`${ip}:${slug}`).digest("hex").slice(0, 16);
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const url = new URL(req.url);
  const slug = cleanText(url.searchParams.get("slug") || "", 80);

  if (req.method === "GET") {
    if (!SLUG.test(slug)) {
      return json(400, { error: "Unknown article." });
    }
    const all = await loadAll();
    return json(200, publicState(all[slug] || emptyState()));
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const postSlug = cleanText(payload.slug, 80);
  if (!SLUG.test(postSlug)) {
    return json(400, { error: "Unknown article." });
  }

  if (cleanText(payload.website, 80)) {
    const all = await loadAll();
    return json(200, publicState(all[postSlug] || emptyState()));
  }

  const all = await loadAll();
  const state = all[postSlug] || emptyState();
  const action = String(payload.action || "");

  if (action === "like" || action === "unlike") {
    const nextLikes =
      action === "like" ? Number(state.likes || 0) + 1 : Math.max(0, Number(state.likes || 0) - 1);
    all[postSlug] = { ...state, likes: nextLikes };
    await saveAll(all);
    return json(200, publicState(all[postSlug]));
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
  const key = rateKey(req, postSlug);
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
  const nextComments = [...comments, { id: comment.id, name: comment.name, body: comment.body, at: comment.at, key }];
  all[postSlug] = { likes: Number(state.likes) || 0, comments: nextComments };
  await saveAll(all);
  return json(200, publicState(all[postSlug]));
};

export const config = {
  path: "/api/feedback",
};

"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  FEEDBACK_ENDPOINT,
  isLocalPreview,
  localState,
  readLiked,
  readStoredName,
  storeLiked,
  storeName,
  writeLocalState,
  type FeedbackComment,
  type FeedbackState,
} from "@/lib/feedback";

function formatStamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function requestFeedback(slug: string, payload?: Record<string, string>) {
  const url = `${FEEDBACK_ENDPOINT}?slug=${encodeURIComponent(slug)}`;
  const response = await fetch(url, {
    method: payload ? "POST" : "GET",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify({ slug, ...payload }) : undefined,
  });
  if (!response.ok) {
    let message = "Could not save that just now.";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) {
        message = data.error;
      }
    } catch {
      // Keep the default message.
    }
    throw new Error(message);
  }
  return (await response.json()) as FeedbackState;
}

export function ArticleFeedback({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [liked, setLiked] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [usingLocal, setUsingLocal] = useState(false);
  const [persistent, setPersistent] = useState(false);
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setName(readStoredName());
    setLiked(readLiked(slug));

    requestFeedback(slug)
      .then((state) => {
        if (cancelled) {
          return;
        }
        setLikes(state.likes);
        setComments(state.comments);
        setPersistent(Boolean(state.persistent));
        setUsingLocal(false);
        setAvailable(true);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        if (!isLocalPreview()) {
          setError("Comments and likes could not be loaded from site storage.");
          setAvailable(false);
          setReady(true);
          return;
        }
        const state = localState(slug);
        setLikes(state.likes);
        setComments(state.comments);
        setPersistent(false);
        setUsingLocal(true);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const likeLabel = useMemo(() => {
    if (likes === 1) {
      return "1 like";
    }
    return `${likes} likes`;
  }, [likes]);

  function applyState(state: FeedbackState) {
    setLikes(state.likes);
    setComments(state.comments);
    if (usingLocal) {
      writeLocalState(slug, state);
    }
  }

  async function toggleLike() {
    const nextLiked = !liked;
    setBusy(true);
    setError("");
    try {
      if (usingLocal) {
        const next = {
          likes: Math.max(0, likes + (nextLiked ? 1 : -1)),
          comments,
        };
        applyState(next);
      } else {
        applyState(await requestFeedback(slug, { action: nextLiked ? "like" : "unlike" }));
      }
      setLiked(nextLiked);
      storeLiked(slug, nextLiked);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the like.");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    const trimmedBody = body.trim();
    const trimmedName = name.trim();
    if (trimmedBody.length < 2) {
      setError("Write a short comment first.");
      return;
    }
    setBusy(true);
    try {
      storeName(trimmedName);
      if (usingLocal) {
        const comment: FeedbackComment = {
          id: crypto.randomUUID(),
          name: trimmedName || "Anonymous",
          body: trimmedBody.slice(0, 1200),
          at: new Date().toISOString(),
        };
        applyState({ likes, comments: [...comments, comment] });
      } else {
        applyState(
          await requestFeedback(slug, {
            action: "comment",
            name: trimmedName,
            body: trimmedBody,
            website,
          }),
        );
      }
      setBody("");
      setStatus("Comment posted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post that comment.");
    } finally {
      setBusy(false);
    }
  }

  const visibleComments = [...comments].reverse();

  return (
    <section className="mt-16 max-w-3xl border-t border-ink/10 pt-10" aria-labelledby="article-feedback-title">
      <p className="eyebrow">Feedback</p>
      <h2 id="article-feedback-title" className="mt-3 font-display text-3xl text-ink">
        Likes and comments
      </h2>
      <p className="mt-3 text-ink-muted">
        Comments can be anonymous. Add a name if you want it shown. This browser remembers the name you use.
        {persistent
          ? " Likes and comments are saved on the site and stay after you leave."
          : usingLocal
            ? " This local preview saves feedback only in this browser. After deploy they are stored on the site."
            : ""}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={toggleLike}
          disabled={!ready || !available || busy}
          aria-pressed={liked}
          className={`rounded-md px-4 py-2 text-sm ${
            liked ? "bg-accent text-white" : "border border-ink/15 bg-surface text-ink hover:border-accent"
          }`}
        >
          {liked ? "Liked" : "Like this article"}
        </button>
        <p className="text-sm text-ink-muted" aria-live="polite">
          {ready ? likeLabel : "Loading likes…"}
        </p>
      </div>

      <form className="relative mt-8 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-ink">
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              autoComplete="nickname"
              placeholder="Anonymous"
              className="rounded-md border border-ink/15 bg-surface px-3 py-2 text-base text-ink outline-none focus:border-accent"
            />
          </label>
          <label className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
            Company
            <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="grid gap-2 text-sm text-ink">
          Comment
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            minLength={2}
            maxLength={1200}
            rows={5}
            placeholder="What did you think?"
            className="rounded-md border border-ink/15 bg-surface px-3 py-2 text-base text-ink outline-none focus:border-accent"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!ready || !available || busy}
            className="rounded-md bg-navy px-4 py-2 text-sm text-foam hover:brightness-110 disabled:opacity-60"
          >
            Post comment
          </button>
          {status ? (
            <p className="text-sm text-ink" role="status">
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-accent" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      <div className="mt-10">
        <h3 className="font-display text-2xl text-ink">
          {comments.length === 1 ? "1 comment" : `${comments.length} comments`}
        </h3>
        {visibleComments.length === 0 ? (
          <p className="mt-4 text-ink-muted">No comments yet. Be the first.</p>
        ) : (
          <ul className="mt-5 grid gap-4">
            {visibleComments.map((comment) => (
              <li key={comment.id} className="rounded-lg border border-ink/10 bg-surface p-5">
                <p className="text-sm text-ink-muted">
                  {comment.name}
                  {comment.at ? ` · ${formatStamp(comment.at)}` : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-ink">{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

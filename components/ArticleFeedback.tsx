"use client";

import { useEffect, useState, type FormEvent } from "react";
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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
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

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M12 20s-7-4.4-9.3-8.1C.8 8.8 2.2 5 6 5c2 0 3.4 1.1 4 2.2C10.6 6.1 12 5 14 5c3.8 0 5.2 3.8 3.3 6.9C19 15.6 12 20 12 20z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
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
        setUsingLocal(false);
        setAvailable(true);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        if (!isLocalPreview()) {
          setError("Could not load likes and comments.");
          setAvailable(false);
          setReady(true);
          return;
        }
        const state = localState(slug);
        setLikes(state.likes);
        setComments(state.comments);
        setUsingLocal(true);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

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
        applyState({
          likes: Math.max(0, likes + (nextLiked ? 1 : -1)),
          comments,
        });
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
      setStatus("Posted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post that comment.");
    } finally {
      setBusy(false);
    }
  }

  const visibleComments = [...comments].reverse();
  const disabled = !ready || !available || busy;

  return (
    <section className="mt-14 max-w-3xl border-t border-ink/10 pt-8" aria-labelledby="article-feedback-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="article-feedback-title" className="font-display text-2xl text-ink">
          Comments
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={toggleLike}
            disabled={disabled}
            aria-pressed={liked}
            aria-label={
              liked
                ? `Unlike. ${likes} ${likes === 1 ? "like" : "likes"}`
                : `Like. ${likes} ${likes === 1 ? "like" : "likes"}`
            }
            className={`inline-flex min-w-[3.25rem] items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 transition ${
              liked
                ? "border-accent bg-accent text-white"
                : "border-ink/15 bg-surface text-ink hover:border-accent hover:text-accent"
            } disabled:opacity-60`}
          >
            <Heart filled={liked} />
            <span aria-live="polite">{likes}</span>
          </button>
        </div>
      </div>

      {usingLocal ? (
        <p className="mt-3 text-sm text-ink-muted">Local preview. Saved in this browser only.</p>
      ) : null}

      <form className="relative mt-5" onSubmit={onSubmit}>
        <label className="sr-only" aria-hidden="true">
          Company
          <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
        <div className="rounded-lg border border-ink/15 bg-surface focus-within:border-accent">
          <label className="sr-only" htmlFor="article-comment">
            Comment
          </label>
          <textarea
            id="article-comment"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            minLength={2}
            maxLength={1200}
            rows={3}
            placeholder="Add a comment"
            className="w-full resize-y rounded-t-lg bg-transparent px-3 py-2.5 text-base text-ink outline-none"
          />
          <div className="flex flex-wrap items-center gap-2 border-t border-ink/10 px-2 py-2">
            <label className="sr-only" htmlFor="article-comment-name">
              Name (optional)
            </label>
            <input
              id="article-comment-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              autoComplete="nickname"
              placeholder="Name (optional)"
              className="min-w-0 flex-1 rounded-md bg-transparent px-1.5 py-1.5 text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="submit"
              disabled={disabled}
              className="rounded-md bg-navy px-3 py-1.5 text-sm text-foam hover:brightness-110 disabled:opacity-60"
            >
              Post
            </button>
          </div>
        </div>
        {status ? (
          <p className="mt-2 text-sm text-ink" role="status">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="mt-2 text-sm text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {visibleComments.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">No comments yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-ink/10 border-t border-ink/10">
          {visibleComments.map((comment) => (
            <li key={comment.id} className="py-4">
              <p className="text-sm text-ink-muted">
                <span className="font-medium text-ink">{comment.name}</span>
                {comment.at ? ` · ${formatStamp(comment.at)}` : ""}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

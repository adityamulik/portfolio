export type FeedbackComment = {
  id: string;
  name: string;
  body: string;
  at: string;
};

export type FeedbackState = {
  likes: number;
  comments: FeedbackComment[];
};

const NAME_KEY = "aditya-writing-name";
const LIKED_KEY = "aditya-writing-liked:";
const LOCAL_STORE = "aditya-writing-feedback";
export const FEEDBACK_ENDPOINT = "/api/feedback";

export function readStoredName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function storeName(name: string) {
  try {
    if (name) {
      localStorage.setItem(NAME_KEY, name);
    }
  } catch {
    // Private browsing can block storage.
  }
}

export function readLiked(slug: string) {
  try {
    return localStorage.getItem(`${LIKED_KEY}${slug}`) === "1";
  } catch {
    return false;
  }
}

export function storeLiked(slug: string, liked: boolean) {
  try {
    const key = `${LIKED_KEY}${slug}`;
    if (liked) {
      localStorage.setItem(key, "1");
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Private browsing can block storage.
  }
}

function readLocalStore(): Record<string, FeedbackState> {
  try {
    const raw = localStorage.getItem(LOCAL_STORE);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, FeedbackState>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalStore(data: Record<string, FeedbackState>) {
  try {
    localStorage.setItem(LOCAL_STORE, JSON.stringify(data));
  } catch {
    // Private browsing can block storage.
  }
}

export function localState(slug: string): FeedbackState {
  return readLocalStore()[slug] ?? { likes: 0, comments: [] };
}

export function writeLocalState(slug: string, state: FeedbackState) {
  const all = readLocalStore();
  all[slug] = state;
  writeLocalStore(all);
}

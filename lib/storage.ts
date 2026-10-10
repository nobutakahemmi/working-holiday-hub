import type { Interest, Profile } from "@/lib/types";

export const SESSION_KEY = "whh.session";
export const PROFILE_KEY = "whh.profile";
export const ADMIN_KEY = "whh.admin";
export const EXTRA_JOBS_KEY = "whh.extra-jobs";
export const WAITLIST_KEY = "whh.waitlist";

export const MOCK_ADMIN_SECRET = "local-dev-admin";

export type Session = {
  email: string;
  signedInAt: string;
};

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("whh-storage"));
}

export function emptyProfile(email = ""): Profile {
  return {
    email,
    passport: "",
    ageRange: "",
    availableFrom: "",
    availableTo: "",
    minCommitmentMonths: "",
    languages: "",
    japaneseLevel: "",
    experience: "",
    references: "",
    certificates: "",
    interests: [] as Interest[],
  };
}

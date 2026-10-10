"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readJson, writeJson } from "@/lib/storage";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("whh-storage", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("whh-storage", onStoreChange);
  };
}

export function useLocalJson<T>(key: string, fallback: T) {
  const getSnapshot = useCallback(
    () => readJson<T>(key, fallback),
    [key, fallback],
  );
  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback);
  const setValue = useCallback(
    (next: T) => {
      writeJson(key, next);
    },
    [key],
  );
  return [value, setValue] as const;
}

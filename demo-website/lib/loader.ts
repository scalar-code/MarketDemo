"use client";

import { useSyncExternalStore } from "react";

let loaded = false;
const listeners = new Set<() => void>();

export function markLoaded() {
  if (loaded) return;
  loaded = true;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** True once the preloader curtain has lifted. */
export function useLoaded() {
  return useSyncExternalStore(
    subscribe,
    () => loaded,
    () => false,
  );
}

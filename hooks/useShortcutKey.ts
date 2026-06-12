"use client";
import { useSyncExternalStore } from "react";

type ShortcutKeys = {
  mod: string; // "⌘" on Mac, "Ctrl" on Win/Linux
  alt: string; // "⌥" on Mac, "Alt" on Win/Linux
};

const subscribe = () => () => {};
const isMacSnapshot = () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
const isMacServerSnapshot = () => false;

export function useShortcutKey(): ShortcutKeys {
  const isMac = useSyncExternalStore(subscribe, isMacSnapshot, isMacServerSnapshot);
  return isMac ? { mod: "⌘", alt: "⌥" } : { mod: "Ctrl", alt: "Alt" };
}

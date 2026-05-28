"use client";

import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onCompare: () => void;
  onCopy: () => void;
  onClear: () => void;
}

export function useKeyboardShortcuts({
  onCompare,
  onCopy,
  onClear
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isCommand = event.metaKey || event.ctrlKey;
      if (!isCommand) return;

      if (event.key === "Enter") {
        event.preventDefault();
        onCompare();
      }

      if (event.shiftKey && event.key.toLowerCase() === "c") {
        event.preventDefault();
        onCopy();
      }

      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        onClear();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClear, onCompare, onCopy]);
}

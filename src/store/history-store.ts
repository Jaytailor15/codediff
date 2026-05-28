"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_HISTORY_ITEMS } from "@/lib/constants";
import type { ComparisonHistoryItem } from "@/types/diff";

interface HistoryState {
  items: ComparisonHistoryItem[];
  addItem: (item: ComparisonHistoryItem) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [
            item,
            ...state.items.filter((existing) => existing.id !== item.id)
          ].slice(0, MAX_HISTORY_ITEMS)
        })),
      clearHistory: () => set({ items: [] })
    }),
    { name: "codediff-history" }
  )
);

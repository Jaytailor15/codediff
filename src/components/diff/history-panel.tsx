"use client";

import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/store/history-store";
import type { ComparisonHistoryItem } from "@/types/diff";

interface HistoryPanelProps {
  onRestore: (item: ComparisonHistoryItem) => void;
}

export function HistoryPanel({ onRestore }: HistoryPanelProps) {
  const { items, clearHistory } = useHistoryStore();

  return (
    <aside className="bg-card/92 rounded-md border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">History</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear history"
          data-tooltip="Clear History Log"
          data-tooltip-position="bottom"
          onClick={clearHistory}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
          Recent comparisons appear here after you run a diff.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              className="w-full rounded-md border border-border bg-background/55 p-3 text-left transition hover:border-primary/60 hover:bg-primary/5"
              onClick={() => onRestore(item)}
            >
              <span className="block truncate text-sm font-medium">
                {item.title}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleString()} · +
                {item.stats.additions} -{item.stats.removals}
              </span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

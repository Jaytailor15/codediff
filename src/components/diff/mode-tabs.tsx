"use client";

import { FileSpreadsheet, FileText, Folder, Image, Type } from "lucide-react";
import { cn } from "@/lib/cn";
import type { WorkspaceMode } from "@/types/diff";

const modes: Array<{
  value: WorkspaceMode;
  label: string;
  icon: typeof Type;
  enabled: boolean;
}> = [
  { value: "text", label: "Text", icon: Type, enabled: true },
  { value: "images", label: "Images", icon: Image, enabled: false },
  { value: "documents", label: "Documents", icon: FileText, enabled: false },
  { value: "excel", label: "Excel", icon: FileSpreadsheet, enabled: false },
  { value: "folders", label: "Folders", icon: Folder, enabled: false }
];

interface ModeTabsProps {
  value: WorkspaceMode;
  onValueChange: (value: WorkspaceMode) => void;
}

export function ModeTabs({ value, onValueChange }: ModeTabsProps) {
  return (
    <div className="relative z-30 overflow-visible border-b border-border bg-background/70">
      <div className="container flex items-center justify-start gap-2 py-2.5 overflow-x-auto custom-scrollbar whitespace-nowrap scrollbar-none">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const active = value === mode.value;

          return (
            <button
              key={mode.value}
              type="button"
              disabled={!mode.enabled}
              aria-pressed={active}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md transition duration-150",
                active && "bg-primary/14 text-primary shadow-sm",
                !active &&
                  mode.enabled &&
                  "text-muted-foreground hover:bg-secondary hover:text-foreground",
                !mode.enabled && "cursor-not-allowed text-muted-foreground/35"
              )}
              onClick={() => mode.enabled && onValueChange(mode.value)}
              data-tooltip={
                mode.enabled
                  ? `${mode.label} Comparison`
                  : `${mode.label} (Coming Soon)`
              }
              data-tooltip-position="bottom"
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}


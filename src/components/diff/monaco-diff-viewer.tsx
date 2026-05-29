"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { DiffViewMode } from "@/types/diff";

import { registerCustomThemes } from "@/utils/monaco-themes";

const MonacoDiffEditor = dynamic(
  () => import("@monaco-editor/react").then((module) => module.DiffEditor),
  {
    ssr: false,
    loading: () => <DiffLoader />
  }
);

interface MonacoDiffViewerProps {
  original: string;
  modified: string;
  language: string;
  viewMode: DiffViewMode;
  minimap: boolean;
  hideUnchanged: boolean;
  lineWrap: boolean;
  precision: string;
  fontSize: number;
  theme: string;
  lineNumbers?: boolean;
  renderLineHighlight?: boolean;
  renderWhitespace?: "none" | "boundary" | "all";
  tabSize?: number;
}

export function MonacoDiffViewer({
  original,
  modified,
  language,
  viewMode,
  minimap,
  hideUnchanged,
  lineWrap,
  precision,
  fontSize,
  theme,
  lineNumbers = true,
  renderLineHighlight = true,
  renderWhitespace = "boundary",
  tabSize = 4
}: MonacoDiffViewerProps) {
  return (
    <section className="bg-card/90 overflow-hidden rounded-md border border-border shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Diff Viewer</h2>
          <p className="text-xs text-muted-foreground">
            {viewMode === "split"
              ? "Side-by-side comparison"
              : "Inline comparison"}{" "}
            · {precision} precision
          </p>
        </div>
      </div>
      <div className="editor-shell h-[560px]">
        <MonacoDiffEditor
          original={original}
          modified={modified}
          language={language}
          theme={theme}
          beforeMount={registerCustomThemes}
          options={{
            automaticLayout: true,
            diffCodeLens: true,
            diffAlgorithm: (precision === "smart" ? "smart" : "legacy") as any,
            enableSplitViewResizing: true,
            fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
            fontSize: fontSize,
            hideUnchangedRegions: { enabled: hideUnchanged },
            lineHeight: Math.round(fontSize * 1.6),
            minimap: { enabled: minimap },
            originalEditable: false,
            readOnly: true,
            renderSideBySide: viewMode === "split",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            wordWrap: lineWrap ? "on" : "off",
            lineNumbers: lineNumbers ? "on" : "off",
            renderLineHighlight: renderLineHighlight ? "all" : "none",
            renderWhitespace: renderWhitespace,
            tabSize: tabSize
          } as any}
        />
      </div>
    </section>
  );
}

function DiffLoader() {
  return (
    <div className="flex h-[560px] items-center justify-center bg-card">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

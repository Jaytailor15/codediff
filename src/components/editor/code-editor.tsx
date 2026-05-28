"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

import { registerCustomThemes } from "@/utils/monaco-themes";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((module) => module.default),
  {
    ssr: false,
    loading: () => <EditorLoader />
  }
);

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  minimap: boolean;
  lineWrap: boolean;
  ariaLabel: string;
  fontSize: number;
  theme: string;
  lineNumbers?: boolean;
  renderLineHighlight?: boolean;
  renderWhitespace?: "none" | "boundary" | "all";
  tabSize?: number;
}

export function CodeEditor({
  value,
  language,
  onChange,
  minimap,
  lineWrap,
  ariaLabel,
  fontSize,
  theme,
  lineNumbers = true,
  renderLineHighlight = true,
  renderWhitespace = "boundary",
  tabSize = 4
}: CodeEditorProps) {
  return (
    <div className="editor-shell h-[380px] overflow-hidden rounded-md border border-border md:h-[520px]">
      <MonacoEditor
        aria-label={ariaLabel}
        value={value}
        language={language}
        theme={theme}
        beforeMount={registerCustomThemes}
        onChange={(nextValue) => onChange(nextValue ?? "")}
        options={{
          automaticLayout: true,
          fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
          fontSize: fontSize,
          lineHeight: Math.round(fontSize * 1.6),
          lineNumbers: lineNumbers ? "on" : "off",
          minimap: { enabled: minimap },
          padding: { top: 14, bottom: 14 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          wordWrap: lineWrap ? "on" : "off",
          renderLineHighlight: renderLineHighlight ? "all" : "none",
          renderWhitespace: renderWhitespace,
          tabSize: tabSize
        }}
      />
    </div>
  );
}

function EditorLoader() {
  return (
    <div className="flex h-[380px] items-center justify-center rounded-md border border-border bg-card md:h-[520px]">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
    </div>
  );
}

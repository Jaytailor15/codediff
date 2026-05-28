"use client";

import { FileDropzone } from "@/components/editor/file-dropzone";
import { LanguageSelect } from "@/components/editor/language-select";
import { CodeEditor } from "@/components/editor/code-editor";
import type { DiffSide, EditorDocument } from "@/types/diff";

interface EditorPanelProps {
  title: string;
  side: DiffSide;
  document: EditorDocument;
  minimap: boolean;
  lineWrap: boolean;
  fontSize: number;
  theme: string;
  onDocumentChange: (document: EditorDocument) => void;
  onError: (message: string) => void;
  lineNumbers?: boolean;
  renderLineHighlight?: boolean;
  renderWhitespace?: "none" | "boundary" | "all";
  tabSize?: number;
}

export function EditorPanel({
  title,
  side,
  document,
  minimap,
  lineWrap,
  fontSize,
  theme,
  onDocumentChange,
  onError,
  lineNumbers,
  renderLineHighlight,
  renderWhitespace,
  tabSize
}: EditorPanelProps) {
  return (
    <section className="min-w-0 space-y-3">
      <div className="bg-card/92 flex flex-col gap-3 rounded-md border border-border p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {document.content.split(/\r?\n/).length} lines
            </p>
          </div>
          <LanguageSelect
            value={document.language}
            onValueChange={(language) =>
              onDocumentChange({ ...document, language })
            }
            label={`${title} language`}
          />
        </div>
        <FileDropzone
          side={side}
          fileName={document.fileName}
          onLoad={onDocumentChange}
          onError={onError}
        />
        <CodeEditor
          value={document.content}
          language={document.language}
          minimap={minimap}
          lineWrap={lineWrap}
          ariaLabel={`${title} code editor`}
          fontSize={fontSize}
          theme={theme}
          lineNumbers={lineNumbers}
          renderLineHighlight={renderLineHighlight}
          renderWhitespace={renderWhitespace}
          tabSize={tabSize}
          onChange={(content) => onDocumentChange({ ...document, content })}
        />
      </div>
    </section>
  );
}

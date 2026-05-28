"use client";

import { useCallback, useState } from "react";
import { FileCode2, UploadCloud } from "lucide-react";
import { ACCEPTED_FILE_EXTENSIONS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { readTextFile } from "@/services/file-service";
import type { DiffSide, EditorDocument } from "@/types/diff";

interface FileDropzoneProps {
  side: DiffSide;
  fileName: string;
  onLoad: (document: EditorDocument) => void;
  onError: (message: string) => void;
}

export function FileDropzone({
  side,
  fileName,
  onLoad,
  onError
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;

      try {
        onLoad(await readTextFile(file));
      } catch (error) {
        onError(
          error instanceof Error ? error.message : "Unable to read file."
        );
      }
    },
    [onError, onLoad]
  );

  return (
    <label
      className={cn(
        "group flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-border bg-background/55 px-3 py-2 text-xs transition hover:border-primary/60 hover:bg-primary/5",
        isDragging && "border-primary bg-primary/10"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <span className="flex min-w-0 items-center gap-2">
        <FileCode2 className="h-4 w-4 text-primary" />
        <span className="truncate text-muted-foreground">
          {fileName || `${side} file`}
        </span>
      </span>
      <span className="inline-flex items-center gap-1 font-medium text-primary">
        <UploadCloud className="h-4 w-4" />
        Upload
      </span>
      <input
        className="sr-only"
        type="file"
        accept={ACCEPTED_FILE_EXTENSIONS}
        onChange={(event) => void handleFiles(event.target.files)}
      />
    </label>
  );
}

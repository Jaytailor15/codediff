import type { StructuredPatch } from "diff";

export type DiffViewMode = "split" | "inline";
export type DiffSide = "original" | "modified";
export type DiffPrecision = "smart" | "word" | "char";
export type WorkspaceMode =
  | "text"
  | "images"
  | "documents"
  | "excel"
  | "folders";

export interface DiffOptions {
  realtime: boolean;
  hideUnchanged: boolean;
  lineWrap: boolean;
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  ignoreBlankLines: boolean;
  trimLines: boolean;
  sortLines: boolean;
  precision: DiffPrecision;
  lineNumbers?: boolean;
  renderLineHighlight?: boolean;
  renderWhitespace?: "none" | "boundary" | "all";
  tabSize?: number;
}

export interface EditorDocument {
  content: string;
  fileName: string;
  language: string;
}

export interface DiffStats {
  additions: number;
  removals: number;
  changes: number;
  originalLines: number;
  modifiedLines: number;
}

export interface DiffApiRequest {
  original: string;
  modified: string;
  originalFileName?: string;
  modifiedFileName?: string;
}

export interface DiffApiResponse {
  patch: StructuredPatch;
  changedLines: number;
}

export interface ComparisonHistoryItem {
  id: string;
  title: string;
  createdAt: string;
  original: EditorDocument;
  modified: EditorDocument;
  stats: DiffStats;
}

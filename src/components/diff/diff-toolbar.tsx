"use client";

import {
  ArrowLeftRight,
  Check,
  Clipboard,
  Download,
  Eraser,
  Expand,
  FileDown,
  GitCompareArrows,
  Link,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { DiffViewMode } from "@/types/diff";

interface DiffToolbarProps {
  viewMode: DiffViewMode;
  minimap: boolean;
  fullscreen: boolean;
  isCopied: boolean;
  onViewModeChange: (mode: DiffViewMode) => void;
  onCompare: () => void;
  onClear: () => void;
  onSwap: () => void;
  onCopy: () => void;
  onDownloadPatch: () => void;
  onDownloadHtml: () => void;
  onShare: () => void;
  onMinimapChange: (value: boolean) => void;
  onFullscreenChange: () => void;
}

export function DiffToolbar({
  viewMode,
  minimap,
  fullscreen,
  isCopied,
  onViewModeChange,
  onCompare,
  onClear,
  onSwap,
  onCopy,
  onDownloadPatch,
  onDownloadHtml,
  onShare,
  onMinimapChange,
  onFullscreenChange
}: DiffToolbarProps) {
  return (
    <div className="bg-card/75 border-b border-border py-2 px-4 backdrop-blur-md">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 w-full">
        {/* Left: Action Icon Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8 hover:opacity-90 shrink-0"
            onClick={onCompare}
            data-tooltip="Run comparison (Cmd/Ctrl + Enter)"
            data-tooltip-position="bottom"
            aria-label="Run code comparison"
          >
            <GitCompareArrows className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground shrink-0"
            onClick={onSwap}
            data-tooltip="Swap Original & Modified panels"
            data-tooltip-position="bottom"
            aria-label="Swap original & modified files"
          >
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground shrink-0"
            onClick={onClear}
            data-tooltip="Clear editor inputs (Cmd/Ctrl + D)"
            data-tooltip-position="bottom"
            aria-label="Clear workspace inputs"
          >
            <Eraser className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground shrink-0"
            onClick={onCopy}
            data-tooltip="Copy unified patch diff (Cmd/Ctrl + Shift + C)"
            data-tooltip-position="bottom"
            aria-label="Copy unified patch"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground shrink-0"
            onClick={onDownloadPatch}
            data-tooltip="Download patch as .diff file"
            data-tooltip-position="bottom"
            aria-label="Download patch as .diff file"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground shrink-0"
            onClick={onDownloadHtml}
            data-tooltip="Export interactive HTML Report"
            data-tooltip-position="bottom"
            aria-label="Download standalone HTML Report"
          >
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground shrink-0"
            onClick={onShare}
            data-tooltip="Generate shareable URL"
            data-tooltip-position="bottom"
            aria-label="Generate shareable URL"
          >
            <Link className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Right: Layout Config Toolbar */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Split / Inline toggles */}
          <div className="inline-flex rounded-md border border-border bg-background/55 p-0.5">
            <Button
              variant={viewMode === "split" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 transition-all duration-150"
              onClick={() => onViewModeChange("split")}
              data-tooltip="Split view (Side-by-side)"
              data-tooltip-position="bottom"
              aria-label="Split view"
            >
              <PanelLeftOpen className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === "inline" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7 transition-all duration-150"
              onClick={() => onViewModeChange("inline")}
              data-tooltip="Inline view (Unified column)"
              data-tooltip-position="bottom"
              aria-label="Unified view"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Minimap toggle switch */}
          <div 
            className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-background/55 px-2 text-[11px] font-semibold text-muted-foreground"
            data-tooltip="Toggle code editor Minimap"
            data-tooltip-position="bottom"
          >
            <Switch
              checked={minimap}
              onCheckedChange={(checked) => {
                if (checked !== minimap) onMinimapChange(checked);
              }}
              aria-label="Toggle editor minimap"
            />
            <span className="select-none text-[10px] uppercase tracking-wider hidden sm:inline">Minimap</span>
          </div>

          {/* Fullscreen focus toggle */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 transition hover:bg-secondary hover:text-foreground"
            onClick={onFullscreenChange}
            data-tooltip={fullscreen ? "Exit Fullscreen Focus" : "Enter Fullscreen Focus"}
            data-tooltip-position="bottom"
            aria-label="Toggle fullscreen focus mode"
          >
            {fullscreen ? (
              <Minimize className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Expand className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

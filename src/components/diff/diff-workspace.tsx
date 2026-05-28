"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle,
  Clipboard,
  Download,
  Eraser,
  FileDown,
  FileText,
  GitPullRequestArrow,
  History,
  Link,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Type
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { useToast } from "@/components/ui/toaster";
import { DiffToolbar } from "@/components/diff/diff-toolbar";
import { StatCard } from "@/components/diff/stat-card";
import { ToolsPanel } from "@/components/diff/tools-panel";
import { DESIGN_TOKENS } from "@/lib/style-config";
import { DEFAULT_MODIFIED, DEFAULT_ORIGINAL } from "@/lib/constants";
import {
  calculateDiffStats,
  createSharePayload,
  createUnifiedDiff,
  prepareDiffContent,
  parseSharePayload,
  analyzeCodeQuality,
  analyzeRichDiff
} from "@/services/diff-service";
import { useDebounce } from "@/hooks/use-debounce";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { cn } from "@/lib/cn";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useHistoryStore } from "@/store/history-store";
import { buildHtmlReport, downloadTextFile } from "@/utils/export";
import { createId } from "@/utils/id";
import type {
  ComparisonHistoryItem,
  DiffOptions,
  DiffStats,
  DiffViewMode,
  EditorDocument
} from "@/types/diff";

const EditorPanel = dynamic(
  () => import("@/components/editor/editor-panel").then((mod) => mod.EditorPanel),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[480px] items-center justify-center rounded-md border border-border bg-card shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }
);

const MonacoDiffViewer = dynamic(
  () => import("@/components/diff/monaco-diff-viewer").then((mod) => mod.MonacoDiffViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[560px] items-center justify-center rounded-md border border-border bg-card shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }
);

const defaultOriginalDocument: EditorDocument = {
  content: DEFAULT_ORIGINAL,
  fileName: "original.js",
  language: "javascript"
};

const defaultModifiedDocument: EditorDocument = {
  content: DEFAULT_MODIFIED,
  fileName: "modified.js",
  language: "javascript"
};

const defaultOptions: DiffOptions = {
  realtime: true,
  hideUnchanged: true,
  lineWrap: true,
  ignoreWhitespace: false,
  ignoreCase: false,
  ignoreBlankLines: false,
  trimLines: false,
  sortLines: false,
  precision: "smart",
  lineNumbers: true,
  renderLineHighlight: true,
  renderWhitespace: "boundary",
  tabSize: 4
};

export function DiffWorkspace() {
  const { toast } = useToast();
  const addHistoryItem = useHistoryStore((state) => state.addItem);
  const historyItems = useHistoryStore((state) => state.items);
  const [storedOriginal, setStoredOriginal, isOriginalLoaded] = useLocalStorage(
    "codediff-original",
    defaultOriginalDocument
  );
  const [storedModified, setStoredModified, isModifiedLoaded] = useLocalStorage(
    "codediff-modified",
    defaultModifiedDocument
  );
  const [original, setOriginal] = useState(defaultOriginalDocument);
  const [modified, setModified] = useState(defaultModifiedDocument);
  const [activePanel, setActivePanel] = useState<"tools" | "history">("tools");
  const [viewMode, setViewMode] = useState<DiffViewMode>("split");
  const [options, setOptions] = useState<DiffOptions>(defaultOptions);
  const [minimap, setMinimap] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [leftWidth, setLeftWidth] = useState<number>(DESIGN_TOKENS.sidebarPanel.initialWidth);
  const [rightWidth, setRightWidth] = useState<number>(DESIGN_TOKENS.sidebarPanel.initialWidth);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<"metrics" | "quality" | "rich">("metrics");
  const [editorFontSize, setEditorFontSize] = useLocalStorage<number>("codediff-font-size", 13);
  const [editorTheme, setEditorTheme] = useLocalStorage<string>("codediff-theme", "vs-dark");

  const { resolvedTheme, setTheme } = useTheme();

  // Handle bidirectional theme synchronization: editor to website theme
  const handleEditorThemeChange = useCallback((newTheme: string) => {
    setEditorTheme(newTheme);
    const isLight = newTheme === "vs" || newTheme === "one-light";
    setTheme(isLight ? "light" : "dark");
  }, [setEditorTheme, setTheme]);

  // Handle bidirectional theme synchronization: website to editor theme
  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    const isLight = editorTheme === "vs" || editorTheme === "one-light";
    if (resolvedTheme === "light" && !isLight) {
      setEditorTheme("one-light");
    } else if (resolvedTheme === "dark" && isLight) {
      setEditorTheme("one-dark");
    }
  }, [resolvedTheme, mounted, editorTheme, setEditorTheme]);

  const startLeftResize = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = leftWidth;
    const startX = mouseDownEvent.clientX;

    const doResize = (mouseMoveEvent: MouseEvent) => {
      const newWidth = Math.max(
        DESIGN_TOKENS.sidebarPanel.minWidth,
        Math.min(DESIGN_TOKENS.sidebarPanel.maxWidth, startWidth + (mouseMoveEvent.clientX - startX))
      );
      setLeftWidth(newWidth);
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
  }, [leftWidth]);

  const startRightResize = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = rightWidth;
    const startX = mouseDownEvent.clientX;

    const doResize = (mouseMoveEvent: MouseEvent) => {
      const newWidth = Math.max(
        DESIGN_TOKENS.sidebarPanel.minWidth,
        Math.min(DESIGN_TOKENS.sidebarPanel.maxWidth, startWidth - (mouseMoveEvent.clientX - startX))
      );
      setRightWidth(newWidth);
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
  }, [rightWidth]);

  const editorSectionRef = useRef<HTMLDivElement>(null);
  const diffSectionRef = useRef<HTMLDivElement>(null);
  const scrollToDiff = useCallback(() => {
    const element = diffSectionRef.current;
    if (element) {
      const yOffset = -140; // Height of sticky Navbar + Editor Toolbar + spacing
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);
  const hasHydratedWorkspace = useRef(false);
  const debouncedOriginal = useDebounce(original, options.realtime ? 220 : 700);
  const debouncedModified = useDebounce(modified, options.realtime ? 220 : 700);

  useEffect(() => {
    setMounted(true);
    // Auto-collapse sidebars symmetrically on smaller screens (below 1024px)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsLeftCollapsed(true);
      setIsRightCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (!isOriginalLoaded || !isModifiedLoaded || hasHydratedWorkspace.current)
      return;

    const shared = parseSharePayload(
      new URLSearchParams(window.location.search).get("share")
    );
    if (shared) {
      setOriginal({
        content: shared.original,
        fileName: "shared-original",
        language: shared.language
      });
      setModified({
        content: shared.modified,
        fileName: "shared-modified",
        language: shared.language
      });
      hasHydratedWorkspace.current = true;
      return;
    }

    setOriginal(storedOriginal);
    setModified(storedModified);
    hasHydratedWorkspace.current = true;
  }, [isModifiedLoaded, isOriginalLoaded, storedModified, storedOriginal]);

  useEffect(() => {
    if (!hasHydratedWorkspace.current) return;
    setStoredOriginal(original);
    setStoredModified(modified);
  }, [modified, original, setStoredModified, setStoredOriginal]);

  const preparedOriginal = useMemo(
    () => prepareDiffContent(debouncedOriginal.content, options),
    [debouncedOriginal.content, options]
  );

  const preparedModified = useMemo(
    () => prepareDiffContent(debouncedModified.content, options),
    [debouncedModified.content, options]
  );

  const stats = useMemo<DiffStats>(
    () => calculateDiffStats(preparedOriginal, preparedModified),
    [preparedModified, preparedOriginal]
  );

  const originalInsights = useMemo(() => analyzeCodeQuality(debouncedOriginal.content), [debouncedOriginal.content]);
  const modifiedInsights = useMemo(() => analyzeCodeQuality(debouncedModified.content), [debouncedModified.content]);

  const richDiff = useMemo(
    () => analyzeRichDiff(preparedOriginal, preparedModified),
    [preparedOriginal, preparedModified]
  );

  const unifiedDiff = useMemo(
    () =>
      createUnifiedDiff(
        prepareDiffContent(original.content, options),
        prepareDiffContent(modified.content, options),
        original.fileName,
        modified.fileName
      ),
    [
      modified.content,
      modified.fileName,
      options,
      original.content,
      original.fileName
    ]
  );

  const handleCompare = useCallback(() => {
    const title = `${original.fileName || "original"} vs ${modified.fileName || "modified"}`;
    addHistoryItem({
      id: createId("comparison"),
      title,
      createdAt: new Date().toISOString(),
      original,
      modified,
      stats
    });
    toast({
      title: "Comparison updated",
      description: `${stats.changes} changed lines detected.`
    });
    // Smoothly scroll down to the Diff Viewer so the user doesn't need to manually scroll!
    setTimeout(scrollToDiff, 100);
  }, [addHistoryItem, modified, original, stats, toast, scrollToDiff]);

  const handleClear = useCallback(() => {
    setOriginal({
      content: "",
      fileName: "original.txt",
      language: "plaintext"
    });
    setModified({
      content: "",
      fileName: "modified.txt",
      language: "plaintext"
    });
    toast({ title: "Workspace cleared" });
  }, [toast]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(unifiedDiff);
      setIsCopied(true);
      toast({
        title: "Diff copied",
        description: "Unified patch copied to clipboard."
      });
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access."
      });
    }
  }, [toast, unifiedDiff]);

  const handleSwap = useCallback(() => {
    setOriginal(modified);
    setModified(original);
    toast({ title: "Inputs swapped" });
  }, [modified, original, toast]);

  const handleMergeOriginal = useCallback(() => {
    setModified((curr) => ({ ...curr, content: original.content }));
    toast({
      title: "Workspace Merged",
      description: "Accepted all changes from Original panel into Modified panel."
    });
  }, [original.content, setModified, toast]);

  const handleMergeModified = useCallback(() => {
    setOriginal((curr) => ({ ...curr, content: modified.content }));
    toast({
      title: "Workspace Merged",
      description: "Accepted all changes from Modified panel into Original panel."
    });
  }, [modified.content, setOriginal, toast]);

  const handleResolveMoves = useCallback(() => {
    if (richDiff.moves.length === 0) return;
    const origLines = original.content.split(/\r?\n/);
    const modLines = modified.content.split(/\r?\n/);
    
    richDiff.moves.forEach((mv) => {
      const fromIdx = parseInt(mv.from.replace("L", "")) - 1;
      const toIdx = parseInt(mv.to.replace("L", "")) - 1;
      if (modLines[toIdx] !== undefined && origLines[fromIdx] !== undefined) {
        modLines[fromIdx] = origLines[fromIdx];
      }
    });
    
    setModified((curr) => ({ ...curr, content: modLines.join("\n") }));
    toast({
      title: "Code Moves Aligned",
      description: `Aligned ${richDiff.movesCount} moved blocks back to matching lines.`
    });
  }, [original.content, modified.content, richDiff.moves, richDiff.movesCount, toast, setModified]);

  const handleApplyReplacements = useCallback(() => {
    if (richDiff.findReplaces.length === 0) return;
    let nextContent = modified.content;
    richDiff.findReplaces.forEach((fr) => {
      const regex = new RegExp(`\\b${fr.from}\\b`, "g");
      nextContent = nextContent.replace(regex, fr.to);
    });
    setModified((curr) => ({ ...curr, content: nextContent }));
    toast({
      title: "Bulk Replacements Applied",
      description: `Successfully refactored ${richDiff.findReplacesCount} word patterns in modified code.`
    });
  }, [modified.content, richDiff.findReplaces, richDiff.findReplacesCount, toast, setModified]);

  const handleDeDuplicate = useCallback(() => {
    if (richDiff.copies.length === 0) return;
    const modLines = modified.content.split(/\r?\n/);
    const linesToRemove = new Set<number>();
    
    richDiff.copies.forEach((cp) => {
      cp.locations.slice(1).forEach((loc) => {
        linesToRemove.add(loc - 1);
      });
    });
    
    const filteredLines = modLines.filter((_, idx) => !linesToRemove.has(idx));
    setModified((curr) => ({ ...curr, content: filteredLines.join("\n") }));
    toast({
      title: "Duplicate Pastes Resolved",
      description: `Successfully cleaned up duplicate code blocks.`
    });
  }, [modified.content, richDiff.copies, toast, setModified]);

  const handleShare = useCallback(async () => {
    const payload = createSharePayload(
      original.content,
      modified.content,
      original.language
    );
    const url = `${window.location.origin}${window.location.pathname}?share=${encodeURIComponent(payload)}`;
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", url);
      toast({
        title: "Share URL copied",
        description: "The comparison is encoded in the current URL."
      });
    } catch {
      window.history.replaceState(null, "", url);
      toast({
        title: "Share URL created",
        description:
          "Clipboard access was blocked, but the current URL was updated."
      });
    }
  }, [modified.content, original.content, original.language, toast]);

  const handleDownloadPatch = useCallback(() => {
    downloadTextFile("comparison.diff", unifiedDiff);
  }, [unifiedDiff]);

  const handleDownloadHtml = useCallback(() => {
    const report = buildHtmlReport({
      title: "CodeDiff Pro Report",
      originalName: original.fileName,
      modifiedName: modified.fileName,
      unifiedDiff,
      stats
    });
    downloadTextFile(
      "comparison-report.html",
      report,
      "text/html;charset=utf-8"
    );
  }, [modified.fileName, original.fileName, stats, unifiedDiff]);

  const handleRestore = useCallback(
    (item: ComparisonHistoryItem) => {
      setOriginal(item.original);
      setModified(item.modified);
      toast({ title: "Comparison restored", description: item.title });
      // Smoothly scroll down to focus the restored diff viewer
      setTimeout(scrollToDiff, 150);
    },
    [toast, scrollToDiff]
  );

  const handleLanguageChange = useCallback((language: string) => {
    setOriginal((current) => ({ ...current, language }));
    setModified((current) => ({ ...current, language }));
  }, []);

  const handleGoToFirstChange = useCallback(() => {
    scrollToDiff();
    toast({
      title: "First change focused",
      description: "The diff viewer is ready for review."
    });
  }, [toast, scrollToDiff]);

  const handleEditInput = useCallback(() => {
    editorSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, []);

  useKeyboardShortcuts({
    onCompare: handleCompare,
    onCopy: handleCopy,
    onClear: handleClear
  });

  const sharedLanguage =
    modified.language === original.language
      ? original.language
      : modified.language;

  return (
    <div
      className={cn(
        "min-h-screen bg-background/55 text-foreground selection:bg-primary/20 overflow-x-hidden w-full max-w-full",
        fullscreen ? "fixed inset-0 z-50 overflow-auto bg-background" : ""
      )}
    >
      <section className="w-full px-4 sm:px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-4 items-start select-none">
          
          {/* 1. Left Docked Sidebar Container */}
          {!isLeftCollapsed && mounted && (
            <div 
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
              onClick={() => setIsLeftCollapsed(true)}
            />
          )}
          <div 
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:sticky lg:top-[4.5rem] lg:z-40 lg:rounded-lg lg:bg-secondary/15 lg:shadow-sm lg:border lg:overflow-hidden shrink-0 select-none",
              isLeftCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
            )}
          >
            {/* Slim vertical Activity Bar */}
            <div className="flex flex-col items-center justify-between py-3.5 w-12 bg-card/60 border-r border-border shrink-0 min-h-[580px]">
              {/* Top Views Group */}
              <div className="flex flex-col gap-4 items-center w-full">
                {/* Top Collapse Button */}
                <TooltipWrapper content={isLeftCollapsed ? "Expand Sidebar Panel" : "Collapse Sidebar Panel"} position="right">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      DESIGN_TOKENS.activityBar.bottomDivider
                    )}
                    onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                  >
                    {isLeftCollapsed ? <PanelLeftOpen className={DESIGN_TOKENS.activityBar.iconSize} /> : <PanelLeftClose className={DESIGN_TOKENS.activityBar.iconSize} />}
                  </button>
                </TooltipWrapper>

                {/* Settings Toggle */}
                <TooltipWrapper content="Workspace Settings" position="right">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md transition duration-150 relative mt-1",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      !isLeftCollapsed && activePanel === "tools"
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                    onClick={() => {
                      if (isLeftCollapsed) {
                        setIsLeftCollapsed(false);
                        setActivePanel("tools");
                      } else if (activePanel === "tools") {
                        setIsLeftCollapsed(true);
                      } else {
                        setActivePanel("tools");
                      }
                    }}
                  >
                    <SlidersHorizontal className={DESIGN_TOKENS.activityBar.iconSize} />
                  </button>
                </TooltipWrapper>

                {/* History Toggle */}
                <TooltipWrapper content="Comparison History" position="right">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      !isLeftCollapsed && activePanel === "history"
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                    onClick={() => {
                      if (isLeftCollapsed) {
                        setIsLeftCollapsed(false);
                        setActivePanel("history");
                      } else if (activePanel === "history") {
                        setIsLeftCollapsed(true);
                      } else {
                        setActivePanel("history");
                      }
                    }}
                  >
                    <History className={DESIGN_TOKENS.activityBar.iconSize} />
                  </button>
                </TooltipWrapper>

                {/* Documentation Link */}
                <TooltipWrapper content="Developer Documentation" position="right">
                  <a
                    href="/docs"
                    className={cn(
                      "flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize
                    )}
                  >
                    <FileText className={DESIGN_TOKENS.activityBar.iconSize} />
                  </a>
                </TooltipWrapper>
              </div>

              {/* Bottom Controls Group */}
              <div className="flex flex-col gap-4 items-center w-full">
                {/* Toggle Sidebar Collapse Button */}
                <TooltipWrapper content={isLeftCollapsed ? "Expand Sidebar Panel" : "Collapse Sidebar Panel"} position="right">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      DESIGN_TOKENS.activityBar.topDivider
                    )}
                    onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                  >
                    {isLeftCollapsed ? <PanelLeftOpen className={DESIGN_TOKENS.activityBar.iconSize} /> : <PanelLeftClose className={DESIGN_TOKENS.activityBar.iconSize} />}
                  </button>
                </TooltipWrapper>
              </div>
            </div>

            {/* Collapsible Panel Column */}
            <div
              style={{ width: isLeftCollapsed ? 0 : `${leftWidth}px` }}
              className={cn(
                "transition-all duration-200 overflow-hidden shrink-0",
                isLeftCollapsed ? "w-0" : "bg-secondary/5"
              )}
            >
              <div style={{ width: `${leftWidth}px` }} className={cn("h-full overflow-hidden", DESIGN_TOKENS.sidebarPanel.padding)}>
                <ToolsPanel
                  options={options}
                  viewMode={viewMode}
                  language={sharedLanguage}
                  historyItems={mounted ? historyItems : []}
                  activePanel={activePanel}
                  editorFontSize={editorFontSize}
                  onEditorFontSizeChange={setEditorFontSize}
                  editorTheme={editorTheme}
                  onEditorThemeChange={handleEditorThemeChange}
                  onActivePanelChange={setActivePanel}
                  onOptionsChange={setOptions}
                  onViewModeChange={setViewMode}
                  onLanguageChange={handleLanguageChange}
                  onRestore={handleRestore}
                  onGoToFirstChange={handleGoToFirstChange}
                  onEditInput={handleEditInput}
                />
              </div>
            </div>
          </div>

          {/* Left Panel Resizer Handle */}
          {!isLeftCollapsed && (
            <div
              className="hidden lg:flex items-center justify-center w-[5px] self-stretch shrink-0 cursor-ew-resize relative z-40 group my-1"
              onMouseDown={startLeftResize}
              data-tooltip="Drag to resize Left Sidebar"
              data-tooltip-position="right"
            >
              {/* Track line */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border/50 group-hover:bg-primary/70 group-hover:shadow-[0_0_6px_1px_hsl(var(--primary)/0.35)] transition-all duration-150" />
              {/* Center grip dot */}
              <div className="relative z-10 h-8 w-[3px] rounded-full bg-border/60 group-hover:bg-primary/80 group-hover:shadow-[0_0_8px_2px_hsl(var(--primary)/0.4)] transition-all duration-150" />
            </div>
          )}

          {/* 2. Middle Panel (Main Editor Canvas - flex-1) */}
          <div className="flex-1 min-w-0 space-y-4 w-full select-text">
            {/* Sleek integrated Workspace Control Header */}
            <div className="flex items-center justify-between bg-card/65 border border-border rounded-md px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-150"
                  onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                  data-tooltip={isLeftCollapsed ? "Expand Left Sidebar" : "Collapse Left Sidebar"}
                  data-tooltip-position="bottom"
                >
                  {isLeftCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
                <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-extrabold">
                  Workspace Config
                </span>
              </div>
              <div className="text-muted-foreground/60 font-semibold text-[10px] tracking-wide uppercase hidden md:block">
                IDE Code Canvas
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-extrabold">
                  Inspector Panels
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground transition-colors duration-150"
                  onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                  data-tooltip={isRightCollapsed ? "Expand Right Inspector" : "Collapse Right Inspector"}
                  data-tooltip-position="bottom"
                >
                  {isRightCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4 scale-x-[-1]" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4 scale-x-[-1]" />
                  )}
                </Button>
              </div>
            </div>

            {/* Sleek integrated editor toolbar */}
            <div className="sticky top-[4rem] z-20 rounded-md border border-border bg-card/95 shadow-sm backdrop-blur-md">
              <DiffToolbar
                viewMode={viewMode}
                minimap={minimap}
                fullscreen={fullscreen}
                isCopied={isCopied}
                onViewModeChange={setViewMode}
                onCompare={handleCompare}
                onClear={handleClear}
                onSwap={handleSwap}
                onCopy={handleCopy}
                onDownloadPatch={handleDownloadPatch}
                onDownloadHtml={handleDownloadHtml}
                onShare={handleShare}
                onMinimapChange={setMinimap}
                onFullscreenChange={() => setFullscreen((value) => !value)}
              />
            </div>

            <div ref={editorSectionRef} className="grid gap-4 lg:grid-cols-2">
              <EditorPanel
                title="Original"
                side="original"
                document={original}
                minimap={minimap}
                lineWrap={options.lineWrap}
                fontSize={editorFontSize}
                theme={editorTheme}
                lineNumbers={options.lineNumbers}
                renderLineHighlight={options.renderLineHighlight}
                renderWhitespace={options.renderWhitespace}
                tabSize={options.tabSize}
                onDocumentChange={setOriginal}
                onError={(message) =>
                  toast({ title: "Upload failed", description: message })
                }
              />
              <EditorPanel
                title="Modified"
                side="modified"
                document={modified}
                minimap={minimap}
                lineWrap={options.lineWrap}
                fontSize={editorFontSize}
                theme={editorTheme}
                lineNumbers={options.lineNumbers}
                renderLineHighlight={options.renderLineHighlight}
                renderWhitespace={options.renderWhitespace}
                tabSize={options.tabSize}
                onDocumentChange={setModified}
                onError={(message) =>
                  toast({ title: "Upload failed", description: message })
                }
              />
            </div>

            {original.content || modified.content ? (
              <div ref={diffSectionRef}>
                <MonacoDiffViewer
                  original={preparedOriginal}
                  modified={preparedModified}
                  language={sharedLanguage}
                  viewMode={viewMode}
                  minimap={minimap}
                  hideUnchanged={options.hideUnchanged}
                  lineWrap={options.lineWrap}
                  precision={options.precision}
                  fontSize={editorFontSize}
                  theme={editorTheme}
                  lineNumbers={options.lineNumbers}
                  renderLineHighlight={options.renderLineHighlight}
                  renderWhitespace={options.renderWhitespace}
                  tabSize={options.tabSize}
                />
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-md border border-dashed border-border bg-card/80 p-8 text-center">
                <GitPullRequestArrow className="mb-4 h-10 w-10 text-primary animate-pulse" />
                <h2 className="text-base font-semibold">No comparison yet</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Paste code or upload two files to generate a Monaco-powered
                  diff with copy, export, and history support.
                </p>
              </div>
            )}
          </div>

          {/* Right Panel Resizer Handle */}
          {!isRightCollapsed && (
            <div
              className="hidden lg:flex items-center justify-center w-[5px] self-stretch shrink-0 cursor-ew-resize relative z-40 group my-1"
              onMouseDown={startRightResize}
              data-tooltip="Drag to resize Right Inspector"
              data-tooltip-position="left"
            >
              {/* Track line */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border/50 group-hover:bg-primary/70 group-hover:shadow-[0_0_6px_1px_hsl(var(--primary)/0.35)] transition-all duration-150" />
              {/* Center grip dot */}
              <div className="relative z-10 h-8 w-[3px] rounded-full bg-border/60 group-hover:bg-primary/80 group-hover:shadow-[0_0_8px_2px_hsl(var(--primary)/0.4)] transition-all duration-150" />
            </div>
          )}

          {/* 3. Right Docked Sidebar Container */}
          {!isRightCollapsed && mounted && (
            <div 
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
              onClick={() => setIsRightCollapsed(true)}
            />
          )}
          <div 
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:h-auto lg:sticky lg:top-[4.5rem] lg:z-40 lg:rounded-lg lg:bg-secondary/15 lg:shadow-sm lg:border lg:overflow-hidden shrink-0 select-none",
              isRightCollapsed ? "translate-x-full lg:translate-x-0" : "translate-x-0"
            )}
          >
            <div
              style={{ width: isRightCollapsed ? 0 : `${rightWidth}px` }}
              className={cn(
                "transition-all duration-200 overflow-hidden shrink-0",
                isRightCollapsed ? "w-0" : "bg-secondary/5"
              )}
            >
              <div style={{ width: `${rightWidth}px` }} className={cn("h-full overflow-hidden", DESIGN_TOKENS.sidebarPanel.padding)}>
                <div className="space-y-3">
                  
                  {/* Symmetrical Tab selector inside Right Panel itself */}
                  <div className="grid rounded-md border border-border/80 bg-background/65 p-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                    <button
                      type="button"
                      className={cn(
                        "h-8 rounded-sm flex items-center justify-center transition",
                        rightPanelTab === "metrics" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                      onClick={() => setRightPanelTab("metrics")}
                      data-tooltip="Live Metrics Summary"
                      data-tooltip-position="bottom"
                    >
                      <Activity className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "h-8 rounded-sm flex items-center justify-center transition",
                        rightPanelTab === "quality" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                      onClick={() => setRightPanelTab("quality")}
                      data-tooltip="Diagnostics & Quality"
                      data-tooltip-position="bottom"
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "h-8 rounded-sm flex items-center justify-center transition",
                        rightPanelTab === "rich" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                      onClick={() => setRightPanelTab("rich")}
                      data-tooltip="GitClear Rich Diff Checker"
                      data-tooltip-position="bottom"
                    >
                      <GitPullRequestArrow className="h-4 w-4" />
                    </button>
                  </div>

                  {rightPanelTab === "metrics" ? (
                    /* Live Inspector Stats section - white card */
                    <div className={cn("bg-card rounded-md border border-border/80 shadow-sm", DESIGN_TOKENS.sidebarPanel.cardPadding, DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
                      <div className="border-b border-border/60 pb-2.5 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <div>
                          <p className={DESIGN_TOKENS.typography.headerPrimary}>
                            LIVE INSPECTOR
                          </p>
                          <p className={cn("mt-1", DESIGN_TOKENS.typography.subtitle)}>
                            Comparison Metrics
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <StatCard
                          label="Changed lines"
                          value={stats.changes}
                          icon={Activity}
                          tone="amber"
                        />
                        <StatCard
                          label="Additions"
                          value={stats.additions}
                          icon={Plus}
                          tone="green"
                        />
                        <StatCard
                          label="Removals"
                          value={stats.removals}
                          icon={RotateCcw}
                          tone="red"
                        />
                        <StatCard
                          label="Output lines"
                          value={stats.modifiedLines}
                          icon={FileText}
                        />
                      </div>
                    </div>
                  ) : rightPanelTab === "quality" ? (
                    /* Code Quality Diagnostics section */
                    <div className="space-y-3">
                      {/* Original File Quality Card */}
                      <div className="bg-card rounded-md border border-border/80 p-3 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between border-b border-border/60 pb-2">
                          <span className="inline-block relative overflow-visible" data-tooltip={original.fileName || "original.txt"}>
                            <span className={cn("truncate max-w-[125px] block mr-2 leading-none", DESIGN_TOKENS.typography.labelFont)}>
                              {original.fileName || "original"}
                            </span>
                          </span>
                          <span className={DESIGN_TOKENS.typography.headerPrimary}>
                            DIAGNOSTICS
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div className="rounded bg-secondary/20 p-1.5 border border-border/30 text-center">
                            <span className="block text-[8px] text-muted-foreground uppercase tracking-wide font-bold">Chars</span>
                            <span className="font-extrabold text-foreground text-xs">{originalInsights.characters}</span>
                          </div>
                          <div className="rounded bg-secondary/20 p-1.5 border border-border/30 text-center">
                            <span className="block text-[8px] text-muted-foreground uppercase tracking-wide font-bold">Words</span>
                            <span className="font-extrabold text-foreground text-xs">{originalInsights.words}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {/* Indentation Alert */}
                          {originalInsights.mixedIndentation ? (
                            <div className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded p-1.5 text-amber-600 dark:text-amber-500">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">Mixed Indentation</p>
                                <p className="text-[9px] opacity-90 leading-tight">Avoid mixing Tabs and Spaces.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded p-1.5 text-emerald-600 dark:text-emerald-500">
                              <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">Clean Indentation</p>
                                <p className="text-[9px] opacity-90 leading-tight">Indentation spaces are consistent.</p>
                              </div>
                            </div>
                          )}

                          {/* Trailing Spaces Alert */}
                          {originalInsights.trailingWhitespace > 0 ? (
                            <div className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded p-1.5 text-amber-600 dark:text-amber-500">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">Trailing Spaces</p>
                                <p className="text-[9px] opacity-90 leading-tight">{originalInsights.trailingWhitespace} trailing lines found.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded p-1.5 text-emerald-600 dark:text-emerald-500">
                              <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">No Trailing Spaces</p>
                                <p className="text-[9px] opacity-90 leading-tight">Clean of trailing spaces.</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-[9px] text-muted-foreground flex justify-between px-1 pt-1.5 border-t border-border/40 font-semibold leading-none">
                            <span>Blank: {originalInsights.emptyLines}</span>
                            <span>Max: {originalInsights.longestLine}ch</span>
                          </div>
                        </div>
                      </div>

                      {/* Modified File Quality Card */}
                      <div className="bg-card rounded-md border border-border/80 p-3 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between border-b border-border/60 pb-2">
                          <span className="inline-block relative overflow-visible" data-tooltip={modified.fileName || "modified.txt"}>
                            <span className="text-[10px] font-bold text-foreground truncate max-w-[125px] block leading-none">
                              {modified.fileName || "modified"}
                            </span>
                          </span>
                          <span className="text-[9px] text-primary uppercase font-extrabold tracking-widest leading-none">
                            DIAGNOSTICS
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div className="rounded bg-secondary/20 p-1.5 border border-border/30 text-center">
                            <span className="block text-[8px] text-muted-foreground uppercase tracking-wide font-bold">Chars</span>
                            <span className="font-extrabold text-foreground text-xs">{modifiedInsights.characters}</span>
                          </div>
                          <div className="rounded bg-secondary/20 p-1.5 border border-border/30 text-center">
                            <span className="block text-[8px] text-muted-foreground uppercase tracking-wide font-bold">Words</span>
                            <span className="font-extrabold text-foreground text-xs">{modifiedInsights.words}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {/* Indentation Alert */}
                          {modifiedInsights.mixedIndentation ? (
                            <div className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded p-1.5 text-amber-600 dark:text-amber-500">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">Mixed Indentation</p>
                                <p className="text-[9px] opacity-90 leading-tight">Avoid mixing Tabs and Spaces.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded p-1.5 text-emerald-600 dark:text-emerald-500">
                              <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">Clean Indentation</p>
                                <p className="text-[9px] opacity-90 leading-tight">Spacing styles are clean.</p>
                              </div>
                            </div>
                          )}

                          {/* Trailing Spaces Alert */}
                          {modifiedInsights.trailingWhitespace > 0 ? (
                            <div className="flex items-start gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded p-1.5 text-amber-600 dark:text-amber-500">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">Trailing Spaces</p>
                                <p className="text-[9px] opacity-90 leading-tight">{modifiedInsights.trailingWhitespace} trailing lines found.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded p-1.5 text-emerald-600 dark:text-emerald-500">
                              <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-[10px] leading-tight">No Trailing Spaces</p>
                                <p className="text-[9px] opacity-90 leading-tight">Clean of trailing spaces.</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-[9px] text-muted-foreground flex justify-between px-1 pt-1.5 border-t border-border/40 font-semibold leading-none">
                            <span>Blank: {modifiedInsights.emptyLines}</span>
                            <span>Max: {modifiedInsights.longestLine}ch</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* GitClear Rich Diff Analyzer panel */
                    <div className="bg-card rounded-md border border-border/80 p-3 shadow-sm space-y-3">
                      <div className="border-b border-border/60 pb-2.5 flex items-center gap-2">
                        <GitPullRequestArrow className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
                            RICH DIFF CHECKER
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground font-semibold leading-none">
                            Advanced Git Analysis
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {/* Additions */}
                        <div className="flex items-center justify-between p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 font-bold text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                            <span>Additions</span>
                          </div>
                          <span>{richDiff.additionsCount} lines</span>
                        </div>

                        {/* Deletions */}
                        <div className="flex items-center justify-between p-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-500 font-bold text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                            <span>Deletions</span>
                          </div>
                          <span>{richDiff.deletionsCount} lines</span>
                        </div>

                        {/* Updates */}
                        <div className="flex items-center justify-between p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-500 font-bold text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                            <span>Updates</span>
                          </div>
                          <span>{richDiff.updatesCount} lines</span>
                        </div>

                        {/* Moves */}
                        <div className="flex items-center justify-between p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 font-bold text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 block" />
                            <span>Moves</span>
                          </div>
                          <span>{richDiff.movesCount} blocks</span>
                        </div>

                        {/* Copies */}
                        <div className="flex items-center justify-between p-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-500 font-bold text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-500 block" />
                            <span>Copy/Pastes</span>
                          </div>
                          <span>{richDiff.copiesCount} blocks</span>
                        </div>

                        {/* Find/Replaces */}
                        <div className="flex items-center justify-between p-1.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-500 font-bold text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 block" />
                            <span>Bulk Replaces</span>
                          </div>
                          <span>{richDiff.findReplacesCount} patterns</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/40">
                        {/* Moves Section */}
                        {richDiff.moves.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground block">Moved Code Blocks</span>
                            <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar pr-1">
                              {richDiff.moves.map((mv, idx) => (
                                <div key={idx} className="p-1.5 rounded bg-background/55 border border-border/40 text-[9px] leading-snug">
                                  <div className="flex items-center justify-between font-bold text-muted-foreground text-[7.5px] mb-0.5">
                                    <span>{mv.from} → {mv.to}</span>
                                    <span className="bg-amber-500/10 text-amber-500 px-1 rounded text-[6.5px]">MOVED</span>
                                  </div>
                                  <code className="text-foreground block truncate font-mono">{mv.text}</code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Duplicates Section */}
                        {richDiff.copies.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground block">Duplicated Paste Blocks</span>
                            <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar pr-1">
                              {richDiff.copies.map((cp, idx) => (
                                <div key={idx} className="p-1.5 rounded bg-background/55 border border-border/40 text-[9px] leading-snug space-y-0.5">
                                  <div className="flex items-center justify-between font-bold text-muted-foreground text-[7.5px]">
                                    <span>Duplicate copies: {cp.locations.length}</span>
                                    <span className="bg-purple-500/10 text-purple-500 px-1 rounded text-[6.5px]">COPY</span>
                                  </div>
                                  <code className="text-foreground block truncate font-mono">{cp.text}</code>
                                  <div className="text-[7px] text-muted-foreground/80 font-bold">Found at lines: {cp.locations.join(", ")}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Find & Replace Section */}
                        {richDiff.findReplaces.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground block">Bulk replacements</span>
                            <div className="space-y-1 max-h-[80px] overflow-y-auto custom-scrollbar pr-1">
                              {richDiff.findReplaces.map((fr, idx) => (
                                <div key={idx} className="p-1.5 rounded bg-indigo-500/5 border border-indigo-500/20 text-[9px] flex items-center justify-between leading-snug">
                                  <div className="min-w-0 flex-1 pr-1 truncate">
                                    <span className="text-[9px] font-bold text-foreground truncate block">
                                      {fr.from} → {fr.to}
                                    </span>
                                    <span className="text-[7.5px] text-muted-foreground block">Detected {fr.occurrences} times</span>
                                  </div>
                                  <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 px-1 py-0.5 rounded text-[6.5px] font-extrabold uppercase shrink-0">REPLACE</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {richDiff.moves.length === 0 && richDiff.copies.length === 0 && richDiff.findReplaces.length === 0 && (
                          <div className="p-2 rounded border border-dashed border-border/60 text-center text-[9px] text-muted-foreground leading-normal">
                            No advanced Moves, Copies, or Bulk replacements detected.
                          </div>
                        )}
                      </div>

                      {/* Refactor & Interactive Merge Actions */}
                      <div className="space-y-2 pt-2 border-t border-border/40">
                        <span className="text-[8px] uppercase tracking-wider font-extrabold text-muted-foreground block mb-0.5">Interactive Merge & Refactor</span>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 justify-start text-[8px] text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 transition shrink-0"
                            onClick={handleMergeOriginal}
                            data-tooltip="Accept Original panel"
                            data-tooltip-position="left"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Original
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 justify-start text-[8px] text-blue-600 dark:text-blue-500 hover:bg-blue-500/10 transition shrink-0"
                            onClick={handleMergeModified}
                            data-tooltip="Accept Modified panel"
                            data-tooltip-position="left"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Modified
                          </Button>
                        </div>

                        <div className="flex flex-col gap-1.5 pt-0.5">
                          {/* Resolve Moves */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={richDiff.movesCount === 0}
                            className="h-8 w-full justify-start text-[8px] border border-border/60 hover:border-amber-500/30 text-foreground font-bold"
                            onClick={handleResolveMoves}
                            data-tooltip="Align moved code blocks"
                            data-tooltip-position="left"
                          >
                            <ArrowLeftRight className="h-3 w-3 text-amber-500 mr-1.5 shrink-0" />
                            <span className="truncate">Align {richDiff.movesCount} Moved Blocks</span>
                          </Button>

                          {/* Bulk Replacements */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={richDiff.findReplacesCount === 0}
                            className="h-8 w-full justify-start text-[8px] border border-border/60 hover:border-indigo-500/30 text-foreground font-bold"
                            onClick={handleApplyReplacements}
                            data-tooltip="Apply detected replaces"
                            data-tooltip-position="left"
                          >
                            <Type className="h-3 w-3 text-indigo-500 mr-1.5 shrink-0" />
                            <span className="truncate">Apply {richDiff.findReplacesCount} Replacements</span>
                          </Button>

                          {/* De-duplicate copies */}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={richDiff.copiesCount === 0}
                            className="h-8 w-full justify-start text-[8px] border border-border/60 hover:border-purple-500/30 text-foreground font-bold"
                            onClick={handleDeDuplicate}
                            data-tooltip="De-duplicate copy blocks"
                            data-tooltip-position="left"
                          >
                            <Trash2 className="h-3 w-3 text-purple-500 mr-1.5 shrink-0" />
                            <span className="truncate">Clean {richDiff.copiesCount} Copy Duplicates</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions Control section - white card */}
                  <div className={cn("bg-card rounded-md border border-border/80 shadow-sm", DESIGN_TOKENS.sidebarPanel.cardPadding, DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
                    <div className="border-b border-border/60 pb-2.5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <p className={DESIGN_TOKENS.typography.headerPrimary}>
                          QUICK ACTIONS
                        </p>
                        <p className={cn("mt-1", DESIGN_TOKENS.typography.subtitle)}>
                          Workspace Operations
                        </p>
                      </div>
                    </div>
                    <div className={cn("grid grid-cols-3", DESIGN_TOKENS.quickActions.gridGap)}>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-full bg-card hover:bg-secondary/40 border border-border/80 shadow-sm transition", DESIGN_TOKENS.quickActions.buttonHeight)}
                        onClick={handleSwap}
                        data-tooltip="Swap Original & Modified"
                        data-tooltip-position="bottom"
                        aria-label="Swap original & modified inputs"
                      >
                        <ArrowLeftRight className={cn("text-muted-foreground", DESIGN_TOKENS.quickActions.iconSize)} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-full bg-card hover:bg-secondary/40 border border-border/80 shadow-sm transition", DESIGN_TOKENS.quickActions.buttonHeight)}
                        onClick={handleClear}
                        data-tooltip="Clear editor workspace"
                        data-tooltip-position="bottom"
                        aria-label="Clear Workspace"
                      >
                        <Eraser className={cn("text-muted-foreground", DESIGN_TOKENS.quickActions.iconSize)} />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-full bg-card hover:bg-secondary/40 border border-border/80 shadow-sm transition", DESIGN_TOKENS.quickActions.buttonHeight)}
                        onClick={handleCopy}
                        data-tooltip="Copy unified diff patch"
                        data-tooltip-position="bottom"
                        aria-label="Copy unified diff patch"
                      >
                        {isCopied ? (
                          <Check className={cn("text-green-500", DESIGN_TOKENS.quickActions.iconSize)} />
                        ) : (
                          <Clipboard className={cn("text-muted-foreground", DESIGN_TOKENS.quickActions.iconSize)} />
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-full bg-card hover:bg-secondary/40 border border-border/80 shadow-sm transition", DESIGN_TOKENS.quickActions.buttonHeight)}
                        onClick={handleDownloadPatch}
                        data-tooltip="Download patch as .diff file"
                        data-tooltip-position="bottom"
                        aria-label="Export comparison as .diff Patch"
                      >
                        <Download className={cn("text-muted-foreground", DESIGN_TOKENS.quickActions.iconSize)} />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-full bg-card hover:bg-secondary/40 border border-border/80 shadow-sm transition", DESIGN_TOKENS.quickActions.buttonHeight)}
                        onClick={handleDownloadHtml}
                        data-tooltip="Export interactive HTML report"
                        data-tooltip-position="bottom"
                        aria-label="Export standalone HTML Report"
                      >
                        <FileDown className={cn("text-muted-foreground", DESIGN_TOKENS.quickActions.iconSize)} />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className={cn("w-full bg-card hover:bg-secondary/40 border border-border/80 shadow-sm transition", DESIGN_TOKENS.quickActions.buttonHeight)}
                        onClick={handleShare}
                        data-tooltip="Generate shareable URL link"
                        data-tooltip-position="bottom"
                        aria-label="Share comparison URL"
                      >
                        <Link className={cn("text-muted-foreground", DESIGN_TOKENS.quickActions.iconSize)} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slim vertical Activity Bar */}
            <div className="flex flex-col items-center justify-between py-3.5 w-12 bg-card/60 border-l border-border shrink-0 min-h-[580px]">
              {/* Top Views Group */}
              <div className="flex flex-col gap-4 items-center w-full">
                {/* Top Collapse Button */}
                <TooltipWrapper content={isRightCollapsed ? "Expand Inspector Panel" : "Collapse Inspector Panel"} position="left">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      DESIGN_TOKENS.activityBar.bottomDivider
                    )}
                    onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                  >
                    {isRightCollapsed ? (
                      <PanelLeftOpen className={cn("scale-x-[-1]", DESIGN_TOKENS.activityBar.iconSize)} />
                    ) : (
                      <PanelLeftClose className={cn("scale-x-[-1]", DESIGN_TOKENS.activityBar.iconSize)} />
                    )}
                  </button>
                </TooltipWrapper>

                {/* Metrics Tab Toggle */}
                <TooltipWrapper content="Live Metrics Summary" position="left">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md transition duration-150 relative mt-1",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      !isRightCollapsed && rightPanelTab === "metrics"
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                    onClick={() => {
                      if (isRightCollapsed) {
                        setIsRightCollapsed(false);
                        setRightPanelTab("metrics");
                      } else if (rightPanelTab === "metrics") {
                        setIsRightCollapsed(true);
                      } else {
                        setRightPanelTab("metrics");
                      }
                    }}
                  >
                    <Activity className={DESIGN_TOKENS.activityBar.iconSize} />
                  </button>
                </TooltipWrapper>

                {/* Diagnostics Tab Toggle */}
                <TooltipWrapper content="Diagnostics & Quality" position="left">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      !isRightCollapsed && rightPanelTab === "quality"
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                    onClick={() => {
                      if (isRightCollapsed) {
                        setIsRightCollapsed(false);
                        setRightPanelTab("quality");
                      } else if (rightPanelTab === "quality") {
                        setIsRightCollapsed(true);
                      } else {
                        setRightPanelTab("quality");
                      }
                    }}
                  >
                    <AlertTriangle className={DESIGN_TOKENS.activityBar.iconSize} />
                  </button>
                </TooltipWrapper>

                {/* Rich Diff Tab Toggle */}
                <TooltipWrapper content="GitClear Rich Diff Checker" position="left">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      !isRightCollapsed && rightPanelTab === "rich"
                        ? "bg-primary/15 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    )}
                    onClick={() => {
                      if (isRightCollapsed) {
                        setIsRightCollapsed(false);
                        setRightPanelTab("rich");
                      } else if (rightPanelTab === "rich") {
                        setIsRightCollapsed(true);
                      } else {
                        setRightPanelTab("rich");
                      }
                    }}
                  >
                    <GitPullRequestArrow className={DESIGN_TOKENS.activityBar.iconSize} />
                  </button>
                </TooltipWrapper>
              </div>

              {/* Bottom Controls Group */}
              <div className="flex flex-col gap-4 items-center w-full">
                {/* Toggle Sidebar Collapse Button */}
                <TooltipWrapper content={isRightCollapsed ? "Expand Inspector Panel" : "Collapse Inspector Panel"} position="left">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-center rounded-md text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition duration-150 relative",
                      DESIGN_TOKENS.activityBar.buttonSize,
                      DESIGN_TOKENS.activityBar.topDivider
                    )}
                    onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                  >
                    {isRightCollapsed ? (
                      <PanelLeftOpen className={cn("scale-x-[-1]", DESIGN_TOKENS.activityBar.iconSize)} />
                    ) : (
                      <PanelLeftClose className={cn("scale-x-[-1]", DESIGN_TOKENS.activityBar.iconSize)} />
                    )}
                  </button>
                </TooltipWrapper>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

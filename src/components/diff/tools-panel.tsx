"use client";

import type { ReactNode } from "react";
import {
  ArrowRightCircle,
  ChevronRight,
  Pencil,
  SlidersHorizontal,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelect } from "@/components/editor/language-select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";
import { DESIGN_TOKENS } from "@/lib/style-config";
import { useHistoryStore } from "@/store/history-store";
import { CUSTOM_THEMES } from "@/utils/monaco-themes";
import { APP_VERSION } from "@/lib/constants";
import type {
  ComparisonHistoryItem,
  DiffOptions,
  DiffPrecision,
  DiffViewMode
} from "@/types/diff";

interface ToolsPanelProps {
  options: DiffOptions;
  viewMode: DiffViewMode;
  language: string;
  historyItems: ComparisonHistoryItem[];
  activePanel: "tools" | "history";
  editorFontSize: number;
  onEditorFontSizeChange: (size: number) => void;
  editorTheme: string;
  onEditorThemeChange: (theme: string) => void;
  onActivePanelChange: (panel: "tools" | "history") => void;
  onOptionsChange: (options: DiffOptions) => void;
  onViewModeChange: (mode: DiffViewMode) => void;
  onLanguageChange: (language: string) => void;
  onRestore: (item: ComparisonHistoryItem) => void;
  onGoToFirstChange: () => void;
  onEditInput: () => void;
}

const precisionOptions: Array<{ label: string; value: DiffPrecision }> = [
  { label: "Smart", value: "smart" },
  { label: "Word", value: "word" },
  { label: "Char", value: "char" }
];

export function ToolsPanel({
  options,
  viewMode,
  language,
  historyItems,
  activePanel,
  editorFontSize,
  onEditorFontSizeChange,
  editorTheme,
  onEditorThemeChange,
  onActivePanelChange,
  onOptionsChange,
  onViewModeChange,
  onLanguageChange,
  onRestore,
  onGoToFirstChange,
  onEditInput
}: ToolsPanelProps) {
  const setOption = <Key extends keyof DiffOptions>(
    key: Key,
    value: DiffOptions[Key]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const clearHistory = useHistoryStore((state) => state.clearHistory);

  return (
    <aside className="space-y-3 select-none pr-1">
      {activePanel === "tools" ? (
        <div className="space-y-3">
          {/* Main Switches grouped inside a beautiful white card with premium custom header */}
          <div className={cn("bg-card rounded-md border border-border/80 shadow-sm", DESIGN_TOKENS.sidebarPanel.cardPadding, DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
            <div className="border-b border-border/60 pb-2.5 flex items-center justify-between">
              <div>
                <p className={DESIGN_TOKENS.typography.headerPrimary}>
                  CONFIGURATION
                </p>
                <p className={cn("mt-1", DESIGN_TOKENS.typography.subtitle)}>
                  Workspace Settings
                </p>
              </div>
              <span className="text-[9px] font-extrabold text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded border border-border/30 select-none">
                v{APP_VERSION}
              </span>
            </div>
            
            <div className="space-y-3 pt-0.5">
              <OptionSwitch
                label="Real-time editor"
                checked={options.realtime}
                onCheckedChange={(checked) => setOption("realtime", checked)}
              />
              <OptionSwitch
                label="Hide unchanged"
                checked={options.hideUnchanged}
                onCheckedChange={(checked) => setOption("hideUnchanged", checked)}
              />
              <OptionSwitch
                label="Wrap long lines"
                checked={options.lineWrap}
                onCheckedChange={(checked) => setOption("lineWrap", checked)}
              />
              <OptionSwitch
                label="Show line numbers"
                checked={options.lineNumbers ?? true}
                onCheckedChange={(checked) => setOption("lineNumbers", checked)}
              />
              <OptionSwitch
                label="Highlight current"
                checked={options.renderLineHighlight ?? true}
                onCheckedChange={(checked) => setOption("renderLineHighlight", checked)}
              />
            </div>
          </div>

          {/* Layout Mode Card */}
          <div className={cn("bg-card rounded-md border border-border/80 shadow-sm", DESIGN_TOKENS.sidebarPanel.cardPadding, DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
            <p className={DESIGN_TOKENS.typography.headerMuted}>
              Layout Mode
            </p>
            <SegmentedControl
              value={viewMode}
              options={[
                { label: "Split", value: "split" },
                { label: "Unified", value: "inline" }
              ]}
              onValueChange={(value) => onViewModeChange(value as DiffViewMode)}
            />
          </div>

          {/* Precision Level Card */}
          <div className={cn("bg-card rounded-md border border-border/80 shadow-sm", DESIGN_TOKENS.sidebarPanel.cardPadding, DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
            <p className={DESIGN_TOKENS.typography.headerMuted}>
              Precision Level
            </p>
            <SegmentedControl
              value={options.precision}
              options={precisionOptions}
              onValueChange={(value) =>
                setOption("precision", value as DiffPrecision)
              }
            />
          </div>

          {/* Syntax Language Card */}
          <div className={cn("bg-card rounded-md border border-border/80 shadow-sm", DESIGN_TOKENS.sidebarPanel.cardPadding, DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
            <p className={DESIGN_TOKENS.typography.headerMuted}>
              Syntax Language
            </p>
            <LanguageSelect
              value={language}
              onValueChange={onLanguageChange}
              label="Choose syntax"
            />
          </div>

          {/* Transform & Filters Card */}
          <div className="bg-card rounded-md border border-border/80 shadow-sm overflow-hidden">
            <DisclosureCard title="Transform / Filter">
              <div className="space-y-3 pt-0.5 pb-1 px-1">
                <OptionSwitch
                  label="Trim whitespace"
                  checked={options.trimLines}
                  onCheckedChange={(checked) => setOption("trimLines", checked)}
                />
                <OptionSwitch
                  label="Sort code lines"
                  checked={options.sortLines}
                  onCheckedChange={(checked) => setOption("sortLines", checked)}
                />
              </div>
            </DisclosureCard>
          </div>

          {/* Ignore Rules Card */}
          <div className="bg-card rounded-md border border-border/80 shadow-sm overflow-hidden">
            <DisclosureCard title="Ignore Rules">
              <div className="space-y-3 pt-0.5 pb-1 px-1">
                <OptionSwitch
                  label="Ignore whitespace"
                  checked={options.ignoreWhitespace}
                  onCheckedChange={(checked) =>
                    setOption("ignoreWhitespace", checked)
                  }
                />
                <OptionSwitch
                  label="Ignore casing"
                  checked={options.ignoreCase}
                  onCheckedChange={(checked) => setOption("ignoreCase", checked)}
                />
                <OptionSwitch
                  label="Ignore blank lines"
                  checked={options.ignoreBlankLines}
                  onCheckedChange={(checked) =>
                    setOption("ignoreBlankLines", checked)
                  }
                />
              </div>
            </DisclosureCard>
          </div>

          {/* Editor Styling & Sizing Card */}
          <div className="bg-card rounded-md border border-border/80 shadow-sm overflow-hidden">
            <DisclosureCard title="Editor styling">
              <div className="space-y-4 pt-0.5 pb-1 px-1">
                {/* Advanced Font Sizing Controls */}
                <OptionGroup label="Font Size">
                  <div className="flex flex-col gap-2.5 min-w-0 w-full">
                    <select
                      value={[12, 13, 14, 16].includes(editorFontSize) ? String(editorFontSize) : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          onEditorFontSizeChange(Number(e.target.value));
                        }
                      }}
                      className="w-full h-9 rounded-md border border-border bg-background/60 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition cursor-pointer"
                    >
                      <option value="12">12px (Ultra Compact)</option>
                      <option value="13">13px (Default Sizing)</option>
                      <option value="14">14px (Medium Sizing)</option>
                      <option value="16">16px (Large Sizing)</option>
                      <option value="custom">Custom Font Size...</option>
                    </select>
                    
                    {/* Clamped range slider and input [10px, 24px] */}
                    <div className="flex items-center gap-2 bg-secondary/30 p-1.5 rounded border border-border/40 min-w-0 w-full">
                      <input
                        type="range"
                        min={10}
                        max={24}
                        value={editorFontSize}
                        onChange={(e) => onEditorFontSizeChange(Number(e.target.value))}
                        className="flex-1 w-full min-w-0 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                      />
                      <div className="flex items-center gap-1 shrink-0 min-w-0">
                        <input
                          type="number"
                          min={10}
                          max={24}
                          value={editorFontSize}
                          onChange={(e) => {
                            const val = Math.max(10, Math.min(24, Number(e.target.value)));
                            onEditorFontSizeChange(val);
                          }}
                          className="w-[42px] h-7 rounded border border-border bg-background px-1 text-center text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground min-w-0"
                        />
                        <span className="text-[10px] text-muted-foreground font-bold select-none">px</span>
                      </div>
                    </div>
                  </div>
                </OptionGroup>

                {/* Professional Themes Dropdown Select */}
                <OptionGroup label="Theme colors">
                  <select
                    value={editorTheme}
                    onChange={(e) => onEditorThemeChange(e.target.value)}
                    className="w-full h-9 rounded-md border border-border bg-background/60 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition cursor-pointer"
                  >
                    <option value="vs-dark">Studio Dark</option>
                    <option value="vs">Studio Light</option>
                    <option value="hc-black">High Contrast</option>
                    {Object.entries(CUSTOM_THEMES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </OptionGroup>

                {/* Render Whitespace Selector */}
                <OptionGroup label="Render Whitespace">
                  <select
                    value={options.renderWhitespace ?? "boundary"}
                    onChange={(e) => setOption("renderWhitespace", e.target.value as any)}
                    className="w-full h-9 rounded-md border border-border bg-background/60 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition cursor-pointer"
                  >
                    <option value="none">None</option>
                    <option value="boundary">Boundary symbols</option>
                    <option value="all">All symbols</option>
                  </select>
                </OptionGroup>

                {/* Tab Size Spacing */}
                <OptionGroup label="Tab Spacing">
                  <select
                    value={String(options.tabSize ?? 4)}
                    onChange={(e) => setOption("tabSize", Number(e.target.value))}
                    className="w-full h-9 rounded-md border border-border bg-background/60 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition cursor-pointer"
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="8">8 spaces</option>
                  </select>
                </OptionGroup>
              </div>
            </DisclosureCard>
          </div>

          {/* Quick Actions Footer inside ToolsPanel */}
          <div className={cn("flex items-center w-full pt-1", DESIGN_TOKENS.quickActions.gridGap)}>
            <Button
              variant="outline"
              size="icon"
              className={cn("flex-1 transition hover:bg-secondary hover:text-foreground shrink-0 relative", DESIGN_TOKENS.quickActions.buttonHeight)}
              onClick={onGoToFirstChange}
              data-tooltip="Go to first change"
              aria-label="Go to first change"
            >
              <ArrowRightCircle className={DESIGN_TOKENS.quickActions.iconSize} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn("flex-1 transition hover:bg-secondary hover:text-foreground shrink-0 relative", DESIGN_TOKENS.quickActions.buttonHeight)}
              onClick={onEditInput}
              data-tooltip="Edit comparison input canvas"
              aria-label="Edit input focus"
            >
              <Pencil className={DESIGN_TOKENS.quickActions.iconSize} />
            </Button>
          </div>
        </div>
      ) : (
        /* History logs card */
        <div className={cn("bg-card rounded-md border border-border/80 shadow-sm p-3", DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div>
              <p className={DESIGN_TOKENS.typography.headerPrimary}>
                HISTORY LOGS
              </p>
              <p className={cn("mt-1", DESIGN_TOKENS.typography.subtitle)}>
                Recent Comparisons
              </p>
            </div>
            {historyItems.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition duration-150"
                onClick={clearHistory}
                data-tooltip="Clear recent comparison logs"
                data-tooltip-position="right"
                aria-label="Clear history log"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {historyItems.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
                Recent comparisons appear here after you run a diff.
              </div>
            ) : (
              historyItems.map((item) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

function OptionSwitch({
  label,
  checked,
  onCheckedChange
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 min-w-0">
      <span className="inline-block relative overflow-visible min-w-0 flex-1" data-tooltip={label}>
        <span className={cn("truncate whitespace-nowrap block mr-2", DESIGN_TOKENS.typography.labelFont)}>
          {label}
        </span>
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  );
}

function OptionGroup({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2 min-w-0 w-full">
      <p className={DESIGN_TOKENS.typography.headerMuted}>
        {label}
      </p>
      {children}
    </div>
  );
}

function SegmentedControl({
  value,
  options,
  onValueChange
}: {
  value: string;
  options: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
}) {
  return (
    <div
      className="grid rounded-md border border-border/80 bg-background/65 p-1"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-tooltip={option.label}
          data-tooltip-position="bottom"
          className={cn(
            "h-8 rounded-sm text-xs font-bold text-muted-foreground transition px-1 whitespace-nowrap overflow-visible",
            value === option.value && "bg-card text-foreground shadow-sm"
          )}
          onClick={() => onValueChange(option.value)}
        >
          <span className="block truncate max-w-full">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function DisclosureCard({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details
      className="group"
      open
    >
      <summary className={cn("flex cursor-pointer list-none items-center justify-between px-3 py-2.5 bg-card hover:bg-secondary/20 transition", DESIGN_TOKENS.typography.headerMuted)}>
        {title}
        <ChevronRight className="h-4 w-4 transition group-open:rotate-90 text-muted-foreground" />
      </summary>
      <div className={cn("px-3 pb-3 pt-1 bg-card border-t border-border/40", DESIGN_TOKENS.sidebarPanel.cardSpacingY)}>{children}</div>
    </details>
  );
}

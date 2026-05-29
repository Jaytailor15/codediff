"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  BookOpen,
  CheckCircle,
  Clipboard,
  Code2,
  Download,
  Eraser,
  FileDown,
  FileText,
  GitPullRequestArrow,
  HelpCircle,
  Home,
  Keyboard,
  Link,
  SlidersHorizontal,
  Trash2,
  Type,
  Github,
  Sun,
  Moon,
  Layers,
  Eye,
  Maximize2,
  ChevronRight,
  Settings2,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  AlignLeft,
  ChevronsUpDown,
  BookOpenCheck,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Minimize2,
  Bookmark,
  ChevronDown,
  Zap,
  EyeOff,
  Hash,
  Highlighter,
  Target,
  Compass,
  Palette,
  Dot,
  ChevronsRight,
  Scissors,
  ArrowUpDown,
  Code,
  CaseSensitive,
  GitCompareArrows,
  Check,
  Expand,
  Minimize,
  ToggleLeft,
  Settings,
  ShieldAlert,
  ArrowRight,
  Binary,
  Hammer,
  Shield,
  Scale,
  Lock,
  Globe,
  Award,
  FileSpreadsheet,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { env } from "@/lib/env";
import { DESIGN_TOKENS } from "@/lib/style-config";
import { cn } from "@/lib/cn";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { LanguageSelector } from "@/components/layout/language-selector";

interface DocSection {
  id: string;
  title: string;
  category: "guide" | "tools" | "systems" | "reference" | "legal";
  icon: any;
  badge?: string;
}

const docSections: DocSection[] = [
  { id: "getting-started", title: "Getting Started", category: "guide", icon: HelpCircle },
  { id: "workspace-layout", title: "Workspace & Resizers", category: "guide", icon: Layers, badge: "Premium" },
  { id: "toolbar-icons", title: "Workspace Toolbar Icons", category: "tools", icon: Settings2, badge: "All Icons" },
  { id: "config-switches", title: "Workspace Switches", category: "tools", icon: Sliders },
  { id: "transform-rules", title: "Transforms & Ignores", category: "tools", icon: AlignLeft },
  { id: "editor-styling", title: "Editor & Font Customizer", category: "tools", icon: Type },
  { id: "gitclear-rich", title: "GitClear Operations", category: "systems", icon: GitPullRequestArrow, badge: "AI Logic" },
  { id: "theme-engine", title: "Universal Theme Engine", category: "systems", icon: Sparkles, badge: "Cohesive" },
  { id: "open-source", title: "Open Source & Env", category: "systems", icon: Github },
  { id: "keyboard-shortcuts", title: "Keyboard Shortcuts", category: "reference", icon: Keyboard },
  { id: "privacy-policy", title: "Privacy Policy", category: "legal", icon: Shield },
  { id: "license", title: "License Agreement", category: "legal", icon: Scale }
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<string>("getting-started");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  // Symmetrical Resizable Sidebar states mirroring the main Workspace
  const [leftWidth, setLeftWidth] = useState<number>(245);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const leftSidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Parse query params to set active section dynamically
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sectionParam = params.get("section");
      if (sectionParam) {
        setActiveSection(sectionParam);
      }
    }
  }, []);

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

  const groupSections = (category: DocSection["category"]) => {
    return docSections.filter((s) => s.category === category);
  };

  const getActiveSectionDetails = () => {
    return docSections.find((s) => s.id === activeSection) || docSections[0];
  };

  const activeSectionInfo = getActiveSectionDetails();
  const ActiveIcon = activeSectionInfo.icon;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_40rem),radial-gradient(circle_at_bottom_right,hsl(var(--primary)/0.05),transparent_48rem),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))] text-foreground selection:bg-primary/20 antialiased transition-colors duration-200">
      
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
        <div className="container flex h-16 items-center justify-between gap-4 max-w-none px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <a href="/" className="flex items-center gap-3 min-w-0 hover:opacity-90 transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0b0f19] border border-border/40 shadow-glow shrink-0">
                <svg className="h-6 w-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 20V44L46 12" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 48L50 20V36" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="32" cy="32" r="8" stroke="#e2e8f0" strokeWidth="4.5" fill="none"/>
                </svg>
              </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="truncate text-sm font-bold tracking-tight">CodeDiff Pro</p>
                    <span className="shrink-0 bg-primary/10 text-primary border border-primary/20 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold select-none">
                      v{env.appVersion}
                    </span>
                    <span className={cn(
                      "hidden sm:inline-flex shrink-0 border text-[9px] px-1.5 py-0.5 rounded-none font-extrabold select-none uppercase tracking-wider transition-colors duration-200",
                      mounted && isDark
                        ? "bg-white text-black border-white"
                        : "bg-black text-white border-black"
                    )}>
                      OPEN SOURCE
                    </span>
                  </div>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Interactive Developer Documentation
                  </p>
                </div>
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {mounted && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex text-xs text-muted-foreground hover:text-foreground font-semibold h-8"
                >
                  <a href="/docs?section=privacy-policy">
                    Privacy
                  </a>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex text-xs text-muted-foreground hover:text-foreground font-semibold h-8"
                >
                  <a href="/docs?section=license">
                    License
                  </a>
                </Button>

                <LanguageSelector />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle color theme"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="h-8 w-8 rounded-md"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </>
            )}

            <Button asChild variant="outline" size="sm" className="gap-1.5 h-8 text-xs font-semibold hover:bg-secondary/85">
              <a href="/">
                <Home className="h-3.5 w-3.5" />
                Workspace
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Full-Width Immersive Documentation Container */}
      <div className="w-full px-4 lg:px-6 pb-5 pt-[84px]">
        <div className="flex flex-col lg:flex-row gap-0 items-stretch border border-border bg-card/25 rounded-xl shadow-md overflow-hidden backdrop-blur-md w-full">
          
          {/* Symmetrical Left Resizable Sidebar (Desktop Only) */}
          <div className="hidden lg:flex shrink-0 self-stretch border-r border-border/60">
            
            {/* Slim Left Activity Bar Icon Strip mirroring Workspace */}
            <div className="w-[50px] shrink-0 bg-card/75 border-r border-border/40 py-4 flex flex-col items-center gap-4 justify-between self-stretch">
              <div className="flex flex-col items-center gap-3.5">
                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm" title="CodeDiff Documentation">
                  <BookOpenCheck className="h-4.5 w-4.5" />
                </div>
                
                <button 
                  onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
                  className="h-8 w-8 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground flex items-center justify-center transition"
                  title={isLeftCollapsed ? "Open Guide Index" : "Collapse Guide Index"}
                >
                  {isLeftCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <a 
                  href={env.repoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="h-8 w-8 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground flex items-center justify-center transition"
                  title="Source Repository"
                >
                  <Github className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

            {/* Expandable and Dynamically Resizable Menu Container */}
            <div 
              ref={leftSidebarRef}
              style={{ width: isLeftCollapsed ? 0 : leftWidth }}
              className={cn(
                "bg-card/30 overflow-hidden flex flex-col self-stretch transition-all duration-150 ease-out select-none",
                isLeftCollapsed ? "border-r-0" : ""
              )}
            >
              <div className="w-[245px] p-4 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar">
                <div>
                  <p className={DESIGN_TOKENS.typography.headerPrimary}>GUIDE INDEX</p>
                  <p className={cn("mt-1", DESIGN_TOKENS.typography.subtitle)}>Select a category</p>
                </div>

                <div className="space-y-4">
                  {/* Category: System Overview */}
                  <div className="space-y-1.5">
                    <p className={DESIGN_TOKENS.typography.headerMuted}>GETTING STARTED</p>
                    <div className="flex flex-col gap-1">
                      {groupSections("guide").map((sec) => (
                        <SidebarButton key={sec.id} sec={sec} active={activeSection === sec.id} onClick={setActiveSection} />
                      ))}
                    </div>
                  </div>

                  {/* Category: Tools & Options */}
                  <div className="space-y-1.5">
                    <p className={DESIGN_TOKENS.typography.headerMuted}>TOOLS & OPTIONS</p>
                    <div className="flex flex-col gap-1">
                      {groupSections("tools").map((sec) => (
                        <SidebarButton key={sec.id} sec={sec} active={activeSection === sec.id} onClick={setActiveSection} />
                      ))}
                    </div>
                  </div>

                  {/* Category: Core Architecture Systems */}
                  <div className="space-y-1.5">
                    <p className={DESIGN_TOKENS.typography.headerMuted}>CORE ARCHITECTURE</p>
                    <div className="flex flex-col gap-1">
                      {groupSections("systems").map((sec) => (
                        <SidebarButton key={sec.id} sec={sec} active={activeSection === sec.id} onClick={setActiveSection} />
                      ))}
                    </div>
                  </div>

                  {/* Category: Shortcuts and References */}
                  <div className="space-y-1.5">
                    <p className={DESIGN_TOKENS.typography.headerMuted}>SHORTCUTS & REFERENCES</p>
                    <div className="flex flex-col gap-1">
                      {groupSections("reference").map((sec) => (
                        <SidebarButton key={sec.id} sec={sec} active={activeSection === sec.id} onClick={setActiveSection} />
                      ))}
                    </div>
                  </div>

                  {/* Category: Legal & Agreements */}
                  <div className="space-y-1.5">
                    <p className={DESIGN_TOKENS.typography.headerMuted}>LEGAL & AGREEMENTS</p>
                    <div className="flex flex-col gap-1">
                      {groupSections("legal").map((sec) => (
                        <SidebarButton key={sec.id} sec={sec} active={activeSection === sec.id} onClick={setActiveSection} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Symmetrical 1px Dynamic Resizer Handle */}
            {!isLeftCollapsed && (
              <div
                onMouseDown={startLeftResize}
                className="w-[1px] relative cursor-col-resize bg-border hover:bg-primary hover:shadow-glow transition-all duration-150 select-none group self-stretch shrink-0"
              >
                <div className="absolute top-0 bottom-0 -left-2 -right-2 bg-transparent z-10 w-[5px] mx-auto group-hover:bg-primary/20" />
              </div>
            )}
          </div>

          {/* Premium Mobile Menu Selector (Mobile Only, shown below lg viewport) */}
          <div className="lg:hidden w-full border-b border-border bg-card/65 p-4 flex flex-col gap-2.5 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 h-9 text-xs font-semibold bg-background/50 border border-border hover:bg-secondary/60 text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <ActiveIcon className="h-3.5 w-3.5 text-primary" />
                <span>{activeSectionInfo.title}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition", isMobileMenuOpen ? "rotate-180" : "")} />
              </Button>
            </div>

            {/* Mobile Dropdown Expanded List */}
            {isMobileMenuOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-border/40 max-h-60 overflow-y-auto custom-scrollbar">
                {docSections.map((sec) => {
                  const SIcon = sec.icon;
                  const active = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setActiveSection(sec.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition border text-left w-full",
                        active 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "text-muted-foreground border-transparent hover:bg-secondary/40 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <SIcon className="h-3.5 w-3.5" />
                        <span>{sec.title}</span>
                      </div>
                      {sec.badge && (
                        <span className="text-[7px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary shrink-0">
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Doc Contents Area taking full remaining layout height */}
          <main className="flex-1 min-w-0 bg-card/10 p-4 sm:p-5 md:p-8 overflow-y-auto h-[calc(100vh-11rem)] lg:h-[calc(100vh-9.5rem)] custom-scrollbar">
            
            {activeSection === "getting-started" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Premium Workspace</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome to CodeDiff Pro</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    CodeDiff Pro is an interactive, browser-driven code and text comparison suite. By combining state-of-the-art WebAssembly-based Monaco editors, smart diffing parsers, and a premium visual environment, CodeDiff Pro gives developers deep clarity on additions, deletions, updates, structural code moves, and recurring global refactoring actions.
                  </p>
                </div>

                <div className="border-t border-border pt-5 space-y-4">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    Standard Compare Workflow
                  </h2>
                  <div className="grid gap-3.5 text-xs sm:grid-cols-2 xl:grid-cols-4">
                    <div className="flex flex-col gap-2.5 p-4 rounded-lg border border-border/60 bg-background/40">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">1</div>
                      <div>
                        <p className="font-bold text-foreground">Paste Base File</p>
                        <p className="text-muted-foreground mt-1 leading-relaxed">Insert your original source snippet inside the <strong>Original Panel</strong>, or drag-and-drop a code file directly into the file dropzone.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 p-4 rounded-lg border border-border/60 bg-background/40">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">2</div>
                      <div>
                        <p className="font-bold text-foreground">Paste Target File</p>
                        <p className="text-muted-foreground mt-1 leading-relaxed">Insert your modified source snippet inside the <strong>Modified Panel</strong>. The workspace immediately begins tracking changes.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 p-4 rounded-lg border border-border/60 bg-background/40">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">3</div>
                      <div>
                        <p className="font-bold text-foreground">Analyze & Compare</p>
                        <p className="text-muted-foreground mt-1 leading-relaxed">If <strong>Realtime Sync</strong> is active, comparison highlights render in under 220ms. Or disable it to manually trigger when ready.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 p-4 rounded-lg border border-border/60 bg-background/40">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">4</div>
                      <div>
                        <p className="font-bold text-foreground">Export or Copy Patch</p>
                        <p className="text-muted-foreground mt-1 leading-relaxed">Export a unified `.diff` file, copy a standard visual patch directly to your clipboard, or review structural statistics inside the live analyzer.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg border border-primary/15 p-4.5 text-xs space-y-2">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Secure Local Sandbox Philosophy
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    CodeDiff Pro values your privacy. Unlike legacy checkers that transmit files to external web servers, our static comparison algorithm compiles, parses, and formats diff indicators directly within your local browser sandbox. Your proprietary source code never leaves your computer.
                  </p>
                </div>

                {/* Symmetrical App Versioning & Project Identity */}
                <div className="border border-border/60 rounded-lg overflow-hidden bg-background/30 text-xs shadow-sm">
                  <div className="bg-secondary/40 border-b border-border/50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Versioning & Release Details</span>
                    </div>
                    <span className="bg-primary/15 text-primary border border-primary/20 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold select-none">
                      Active: v{env.appVersion}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-3 leading-relaxed text-muted-foreground">
                    <p>
                      CodeDiff Pro follows strict <strong>Semantic Versioning (SemVer)</strong> rules. This guarantees stable visual integrations, structured ignorable transforms, and localized Monaco settings:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-1 border-t border-border/40">
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-normal">Active Environment Version</span>
                        <span className="text-foreground font-mono">v{env.appVersion}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-normal">Release Channel</span>
                        <span className="text-foreground">Official Open Source Release</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "workspace-layout" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Layers className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Workspace Ergonomics</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Layout & Symmetrical Resizers</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Designed for visual comfort and flexible multitasking, CodeDiff Pro features a highly responsive layout equipped with thin, dynamic resizer tracks.
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Dynamic 1px Resizer Handles
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All sidebar columns utilize a custom-engineered <strong>1px visual resizer track</strong> to maintain a clean workspace layout. To guarantee high comfort:
                    </p>
                    <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground">
                      <li>The interactive drag-handle extends to a hidden <strong>5px grab zone</strong>, meaning you don't need pixel-perfect mouse placement to begin dragging.</li>
                      <li>While resizing, the track lights up with a gorgeous <strong>primary color glow</strong>, providing distinct visual feedback.</li>
                      <li>Both sidebars are constraint-bounded dynamically using global style tokens (<code className="text-primary font-bold font-mono">170px</code> minimum width, <code className="text-primary font-bold font-mono">320px</code> maximum width).</li>
                    </ul>
                  </div>

                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Intelligent Auto-Collapsing & Mobile Adaptation
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      On screen viewports below <strong>1024px</strong> (tablet and mobile viewports), the system automatically collapses sidebars to avoid narrow text fields or horizontal layout overflow. Inside the documentation, the side menu dynamically converts into a space-efficient sticky select dropdown.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "toolbar-icons" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Settings2 className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Visual Toolbar Reference</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Toolbar Buttons & Icons</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    The toolbar situated directly above the Monaco editor workspace is your control deck. Every action, import option, export tool, and display toggle is listed here alongside its exact visual icon and hotkey representation:
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 text-xs">
                  {/* GitCompareArrows */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                        <GitCompareArrows className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span>Compare Code</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Primary Sync Execution</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Launches the main static diff computation engine. Essential when <strong>Realtime Editor Sync</strong> is turned off to manage massive files with zero input delay.
                    </p>
                    <div className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Shortcut: Cmd/Ctrl + Enter
                    </div>
                  </div>

                  {/* ArrowLeftRight */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <ArrowLeftRight className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Swap Panels</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Chronological Inversion</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Instantly swaps the contents of the **Original** (Base) and **Modified** (Target) editor canvases. Extremely helpful when auditing refactored parameters in reverse direction.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Action: Swap Workspaces
                    </div>
                  </div>

                  {/* Eraser */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <Eraser className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Clear Canvas</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Workspace Reset</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Resets editor panels, wipes character sequences, resets visual file names back to template configurations, and prepares the layout for fresh paste files.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Shortcut: Cmd/Ctrl + D
                    </div>
                  </div>

                  {/* Clipboard / Check */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <Clipboard className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Copy Unified Patch</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Diff Clipboard Exporter</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Generates standard unified Git patch text files and copies them to the system clipboard. You can paste the patch in any local shell terminal using `git apply`.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Shortcut: Cmd/Ctrl + Shift + C
                    </div>
                  </div>

                  {/* Download */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <Download className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Download .diff File</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">File System Storage</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Saves computed comparison results straight to your disk as a standard, fully compatible unified comparison `.diff` file for Git tracking.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Output format: unified.diff
                    </div>
                  </div>

                  {/* FileDown */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <FileDown className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Interactive HTML Report</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Self-Contained Visual Export</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Generates a self-contained, fully styled standalone `.html` report that embeds comparison layout styles and code lines. Perfect for sharing via email or drives.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Format: interactive.html
                    </div>
                  </div>

                  {/* Link */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <Link className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Generate Share Link</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Base64 Encoded Payloads</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Compiles editor content, formats visual preferences, encodes them into a single Base64 string, and generates a sharing link for colleagues to view the layout instantly.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Action: Copy share URL
                    </div>
                  </div>

                  {/* PanelLeftOpen / PanelLeftClose */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <PanelLeftOpen className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Split & Inline Toggles</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Layout Quick Switchers</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Provides quick-toggles inside the right section of the toolbar to instantly shift visual layouts between Split view and inline Unified view.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Visual: Side-by-side / Inline
                    </div>
                  </div>

                  {/* ToggleLeft / ToggleRight */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <ToggleLeft className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Minimap Switch Toggle</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Outline Map Toggle</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Renders the compact visual layout minimap on the right-hand edge of the editor containers, enabling quick jumps across long code files.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Status: On / Off
                    </div>
                  </div>

                  {/* Expand / Minimize */}
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-8.5 w-8.5 rounded bg-secondary/80 text-foreground flex items-center justify-center border border-border/40">
                        <Expand className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <span>Fullscreen Focus Mode</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Full Screen Canvas Max</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Collapses both the left control panel and right quality stats sidebar to maximize the comparison canvas area, creating a highly focused editing space.
                    </p>
                    <div className="text-[9px] bg-secondary border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded font-mono font-bold w-fit">
                      Shortcut: Escape to exit
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "config-switches" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Sliders className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Configuration Suite</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace Configuration Switches</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    CodeDiff Pro incorporates standard visual switches on the Left Sidebar inside the **CONFIGURATION** card to fine-tune visual rendering, comparison engines, and editor properties:
                  </p>
                </div>

                {/* Configuration switch detailed list with before/after blocks */}
                <div className="space-y-6">
                  {/* Real-time editor */}
                  <div className="border border-border bg-background/55 rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Zap className="h-4.5 w-4.5 text-primary" />
                        <span>Real-time editor</span>
                      </div>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded font-bold">Standard Delay: 220ms</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Maintains a highly responsive comparison track by debouncing diff parsing down to 220ms as you type. If you are handling large source code bundles, disable this option to completely eliminate writing latency, and click the main toolbar **Compare** button manually when ready.
                    </p>
                    <div className="bg-secondary/40 border border-border/55 p-3 rounded-lg text-xs space-y-1.5 text-muted-foreground">
                      <p className="font-bold text-foreground">Real-World Use Case:</p>
                      <p>Disable Realtime Sync when copying large data logs (e.g. 5,000+ line JSON streams) to avoid browser thread lockup while formatting elements.</p>
                    </div>
                  </div>

                  {/* Hide unchanged */}
                  <div className="border border-border bg-background/55 rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <EyeOff className="h-4.5 w-4.5 text-primary" />
                        <span>Hide unchanged</span>
                      </div>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded font-bold">Matching Row Collapse</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sifts through both source files and collapses long stretches of identical, unmodified lines. It substitutes them with an expandable banner indicating the volume of matching code lines bypassed.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 text-[11px] font-mono">
                      <div className="p-3 bg-secondary/20 rounded border border-border/40">
                        <p className="font-bold text-foreground mb-1">Before Toggle [False]</p>
                        <p className="text-muted-foreground/60 leading-normal">
                          1: const a = 10;<br />
                          2: const b = 20;<br />
                          3: const c = 30;<br />
                          4: const d = 40;<br />
                          <span className="text-emerald-500 font-bold">5: const e = 99; // EDIT</span><br />
                          6: const f = 60;
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/20 rounded border border-border/40">
                        <p className="font-bold text-foreground mb-1">After Toggle [True]</p>
                        <p className="text-muted-foreground/60 leading-normal">
                          <span className="text-primary bg-primary/5 border border-primary/25 px-1.5 py-0.5 rounded text-[10px] block my-1">4 identical lines collapsed</span>
                          <span className="text-emerald-500 font-bold">5: const e = 99; // EDIT</span><br />
                          6: const f = 60;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wrap long lines */}
                  <div className="border border-border bg-background/55 rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <AlignLeft className="h-4.5 w-4.5 text-primary" />
                        <span>Wrap long lines</span>
                      </div>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded font-bold">Horizontal Limiter</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Prevents editors from spilling over into horizontal scrollbars by breaking long code lines and wrapping them down to the gutter margin dynamically. 
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 text-[11px] font-mono">
                      <div className="p-3 bg-secondary/20 rounded border border-border/40">
                        <p className="font-bold text-foreground mb-1">Before [False]</p>
                        <div className="overflow-x-auto whitespace-nowrap text-muted-foreground/60 leading-normal">
                          1: const payload = &#123; name: "CodeDiff", version: "1.4.3", repo: "https://github.com/jaytailor15/codediff", secure: true, sandbox: true &#125;;
                        </div>
                      </div>
                      <div className="p-3 bg-secondary/20 rounded border border-border/40">
                        <p className="font-bold text-foreground mb-1">After [True]</p>
                        <p className="text-muted-foreground/60 leading-normal">
                          1: const payload = &#123;<br />
                          &nbsp;&nbsp;&nbsp;name: "CodeDiff",<br />
                          &nbsp;&nbsp;&nbsp;version: "1.4.3",<br />
                          &nbsp;&nbsp;&nbsp;...<br />
                          &#125;;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Show line numbers */}
                  <div className="border border-border bg-background/55 rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Hash className="h-4.5 w-4.5 text-primary" />
                        <span>Show line numbers</span>
                      </div>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded font-bold">Monaco Gutter Sync</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Toggles the line numbers gutter on the left side of editor panels. Invaluable for team synchronization during peer-reviews or mapping bug areas.
                    </p>
                  </div>

                  {/* Highlight current */}
                  <div className="border border-border bg-background/55 rounded-lg p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Highlighter className="h-4.5 w-4.5 text-primary" />
                        <span>Highlight current</span>
                      </div>
                      <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-2 py-0.5 rounded font-bold">Cursor Pointer Track</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Renders a high-visibility, professional visual shadow overlay along the line containing your cursor, guaranteeing absolute focus when reviewing file areas.
                    </p>
                  </div>
                </div>

                {/* Symmetrical Layout Mode detailed explanation */}
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ArrowLeftRight className="h-4.5 w-4.5 text-primary" />
                    Layout Mode Selection
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    CodeDiff Pro allows you to choose your visual comparative layout dynamically using a segmented control inside the Left Sidebar:
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <p className="font-bold text-foreground">1. Split Layout (Side-by-Side)</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Renders the original base file on the left and the modified target file on the right in two symmetrical editor boxes.
                      </p>
                      <div className="bg-secondary/40 p-2.5 rounded text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Use Case:</strong> Perfect for standard developer screens to audit code structures side by side or check design properties symmetrically.
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <p className="font-bold text-foreground">2. Unified Layout (Inline Column)</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Compiles original and modified code lines inside a single unified scroll container. Deletions show up with a red background and additions with a green background sequentially.
                      </p>
                      <div className="bg-secondary/40 p-2.5 rounded text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Use Case:</strong> Highly optimized for tablet and mobile devices to prevent horizontal viewport overflow, or to inspect raw patch outputs quickly.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Symmetrical Precision Level detailed explanation */}
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Target className="h-4.5 w-4.5 text-primary" />
                    Precision Level Normalization
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The precision level segmented control adjusts the sensitivity of the static parser algorithms when highlighting updates inside code blocks:
                  </p>

                  <div className="grid gap-4 xl:grid-cols-3 text-xs">
                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <p className="font-bold text-foreground">Smart Precision</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Balances block changes and character changes. Highlights modified code lines cleanly, while isolating variable updates within the line.
                      </p>
                      <div className="bg-secondary/40 p-2.5 rounded text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Best for:</strong> Standard programming files containing a mixture of code edits, variable shifts, and formatting adjustments.
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <p className="font-bold text-foreground">Word Precision</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Examines strings on a word-by-word basis, ignoring simple space breaks. Shows which visual words inside a string were altered.
                      </p>
                      <div className="bg-secondary/40 p-2.5 rounded text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Best for:</strong> Reviewing documentation strings, Markdown files, or editing extensive plain text files.
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <p className="font-bold text-foreground">Char Precision</p>
                      <p className="text-muted-foreground leading-relaxed">
                        Analyzes code at the individual letter level. Displays precise visual feedback on single character differences.
                      </p>
                      <div className="bg-secondary/40 p-2.5 rounded text-[10px] text-muted-foreground">
                        <strong className="text-foreground">Best for:</strong> Finding subtle code typos, missing semicolons, incorrect variables (e.g. `prev` vs `prevs`), or extra braces.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Symmetrical Syntax Language selector explanation */}
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Code className="h-4.5 w-4.5 text-primary" />
                    Syntax Language Normalizer
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    CodeDiff Pro includes support for over 20+ programming languages. When you drag-and-drop a file onto the workspace, the system automatically checks the extension header and activates language highlighting. If you want to override this, use the **SYNTAX LANGUAGE** dropdown selector:
                  </p>
                  <div className="bg-secondary/20 border border-border rounded-lg p-4 text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">How it Works:</strong> Selecting a language tells Monaco to switch highlighting engines (e.g. JavaScript, CSS, HTML, Python, Rust, Go, SQL). Selecting <strong className="text-foreground">Auto</strong> restores the automatic extension-matching engine.
                  </div>
                </div>
              </div>
            )}

            {activeSection === "transform-rules" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <AlignLeft className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Advanced Modifiers</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Transforms & Ignore Rules</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    CodeDiff Pro provides premium static pre-processors that dynamically normalize your source snippets before passing them to the comparison engine. Here is each modifier explained in depth:
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2.5">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-primary" />
                      Transform: Trim Whitespace
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Removes leading and trailing white space from every line inside both files before launching the comparison engine. This helps clean up sloppy formatting or indent adjustments and targets the core logic.
                    </p>
                  </div>

                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2.5">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-primary" />
                      Transform: Sort Code Lines
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Sorts every line alphabetically inside both editors. Ideal for reviewing alphabetically organized configuration files, CSS declaration blocks, lists, or large dictionaries.
                    </p>
                  </div>

                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2.5">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-primary" />
                      Ignore Rule: Ignore Whitespace
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Tells the comparison engine to overlook changes that only contain tabs or spacing adjustments. This prevents formatting mismatches from flagging lines as updated.
                    </p>
                  </div>

                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2.5">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-primary" />
                      Ignore Rule: Ignore Casing
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Performs a case-insensitive evaluation of lines. If a variable changes casing (e.g. <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">myVar</code> to <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">MYVAR</code>), this ignore rule filters it from diff calculations.
                    </p>
                  </div>

                  <div className="border border-border bg-background/55 rounded-lg p-4 space-y-2.5">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <div className="h-2 w-2 rounded bg-primary" />
                      Ignore Rule: Ignore Blank Lines
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Ignores additions, updates, or removals of empty carriage returns or spacing breaks. It filters out spacing preferences, giving you a clean visual overview.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "editor-styling" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Type className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Customizer Panel</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Editor Styling & Sizing Controls</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Configure your comparative space to match your preferences. Visual parameters are stored locally inside the browser's `localStorage` sandbox:
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span>Font Size & Line-Height Sync</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Clamped Size Slider [10px - 24px]</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Scale code text size using the slider or precise number field. The editor instantly updates the line height (<code className="text-primary font-bold font-mono">1.6 * editorFontSize</code>) to guarantee legibility.
                    </p>
                    <div className="flex items-center justify-between text-[10px] bg-secondary/30 p-2 rounded border border-border/40 font-semibold text-muted-foreground">
                      <span>Persistent Storage</span>
                      <span className="text-primary font-mono text-[9px]">codediff-font-size</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center">
                        <Dot className="h-4 w-4" />
                      </div>
                      <div>
                        <span>Render Whitespace Symbols</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Tab & Space Symbols</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Toggles space and tab indicators (dots and arrows) inside Monaco. Choose between **None** (clean view), **Boundary** (edge spacing), and **All** (globally visible indicators).
                    </p>
                    <div className="flex items-center justify-between text-[10px] bg-secondary/30 p-2 rounded border border-border/40 font-semibold text-muted-foreground">
                      <span>Render Mode</span>
                      <span className="text-primary font-mono text-[9px]">Boundary / All / None</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center">
                        <ChevronsRight className="h-4 w-4" />
                      </div>
                      <div>
                        <span>Tab Spacing</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Indentation Columns</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Configure indent sizes dynamically between **2 spaces**, **4 spaces**, and **8 spaces** to align layouts correctly across different languages.
                    </p>
                    <div className="flex items-center justify-between text-[10px] bg-secondary/30 p-2 rounded border border-border/40 font-semibold text-muted-foreground">
                      <span>Default Spacing</span>
                      <span className="text-primary font-mono text-[9px]">4 spaces</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border bg-background/55 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center">
                        <Palette className="h-4 w-4" />
                      </div>
                      <div>
                        <span>Editor Theme Selector</span>
                        <span className="block text-[9px] text-muted-foreground mt-0.5">Studio Color Sync</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Switch between professional studio visual themes including **Studio Dark** (vs-dark), **Studio Light** (vs), **High Contrast** (hc-black), and premium custom themes.
                    </p>
                    <div className="flex items-center justify-between text-[10px] bg-secondary/30 p-2 rounded border border-border/40 font-semibold text-muted-foreground">
                      <span>Universal Sync</span>
                      <span className="text-primary font-mono text-[9px]">Next-Themes Linked</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "gitclear-rich" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <GitPullRequestArrow className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Advanced Diagnostics</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">GitClear-style Rich Diff</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Rather than limiting visual output to plain insertions and deletions, CodeDiff Pro features an advanced static code structure analyzer. This tool isolates refactoring metrics and segments modifications into precise categories:
                  </p>
                </div>

                <div className="w-full overflow-x-auto custom-scrollbar">
                  <div className="border border-border rounded-lg overflow-hidden bg-background/55 text-xs shadow-sm min-w-[650px] lg:min-w-0">
                    <div className="grid grid-cols-3 bg-secondary/80 border-b border-border p-3 font-bold text-foreground uppercase tracking-wider text-[9px]">
                      <div>Operation Class</div>
                      <div>Description</div>
                      <div>Visual Theme Highlight</div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center leading-relaxed">
                      <div className="font-bold text-emerald-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-glow shadow-emerald-500/30" />
                        Addition
                      </div>
                      <div className="text-muted-foreground">New variables, features, or lines added to the document.</div>
                      <div><span className="text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold text-[10px]">Green Line Marker</span></div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center leading-relaxed">
                      <div className="font-bold text-rose-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-glow shadow-rose-500/30" />
                        Deletion
                      </div>
                      <div className="text-muted-foreground">Code block segments that have been excised or deleted.</div>
                      <div><span className="text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-extrabold text-[10px]">Red Line Marker</span></div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center leading-relaxed">
                      <div className="font-bold text-blue-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 shadow-glow shadow-blue-500/30" />
                        Update
                      </div>
                      <div className="text-muted-foreground">Inline variable adjustments, typos fixed, or simple parameter changes.</div>
                      <div><span className="text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-extrabold text-[10px]">Inline Character highlight</span></div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center leading-relaxed">
                      <div className="font-bold text-amber-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-glow shadow-amber-500/30" />
                        Move
                      </div>
                      <div className="text-muted-foreground">A section cut and pasted elsewhere. Eliminates noisy add/delete alerts.</div>
                      <div><span className="text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-extrabold text-[10px]">Mapped Moves List</span></div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center leading-relaxed">
                      <div className="font-bold text-purple-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500/80 shadow-glow shadow-purple-500/30" />
                        Duplicate Copy
                      </div>
                      <div className="text-muted-foreground">Repetitive boilerplate code segments duplicated across the codebase.</div>
                      <div><span className="text-purple-500 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded font-extrabold text-[10px]">Boilerplate Alert</span></div>
                    </div>

                    <div className="grid grid-cols-3 p-3.5 items-center leading-relaxed">
                      <div className="font-bold text-indigo-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 shadow-glow shadow-indigo-500/30" />
                        Find / Replace
                      </div>
                      <div className="text-muted-foreground">Identical token substitutions repeating sequentially across three or more lines.</div>
                      <div><span className="text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded font-extrabold text-[10px]">Mass Token Mapping</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "theme-engine" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Style Core</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Universal Theme Engine</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Enjoy a cohesive aesthetic environment. CodeDiff Pro is built around a unified, bidirectional theme coordination system.
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <h3 className="text-sm font-bold text-foreground">How Theme Synchronization Works</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Unlike standard web utilities where you have to manually choose web page themes and editor themes separately, CodeDiff Pro links them seamlessly:
                  </p>

                  <div className="grid gap-3.5 text-xs sm:grid-cols-2">
                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span>Light Mode Harmony</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Setting the editor theme to <strong className="text-foreground">vs (Studio Light)</strong> or <strong className="text-foreground">one-light</strong> automatically transitions the entire website layout, toolbars, and background into standard clean light mode.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-background/55 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Moon className="h-4 w-4 text-indigo-400" />
                        <span>Dark Mode Elegance</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Transitioning the editor to <strong className="text-foreground">vs-dark (Studio Dark)</strong>, <strong className="text-foreground">one-dark</strong>, or <strong className="text-foreground">hc-black (High Contrast)</strong> instantly synchronizes Next-Themes to transition the page into a gorgeous dark aesthetic with subtle borders and shadows.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-xs">
                    <p className="font-bold text-foreground mb-1">State Persistence</p>
                    <p className="text-muted-foreground leading-relaxed">
                      Your chosen theme configuration is stored inside the browser's local storage sandbox. The next time you launch the application, your workspace initializes instantly in your preferred visual style, without flashing or layout shifting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "open-source" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Github className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Source Integrity</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Open Source & Env Config</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    CodeDiff Pro is built around standard open-source developer workflow guidelines. All environment constants, brand badges, and repository URLs are configured via centralized environment variables.
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Settings2 className="h-4 w-4 text-primary" />
                    Environment Variables Setup
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can quickly customize the open source repository connection and workspace branding details. Make a copy of <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">.env.example</code>, rename it to <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">.env</code>, and define these parameters:
                  </p>

                  <div className="border border-border rounded-lg overflow-hidden bg-background/55 font-mono text-[11px] p-4 text-muted-foreground space-y-1.5 shadow-inner">
                    <p><span className="text-primary font-bold">NEXT_PUBLIC_APP_NAME</span>="CodeDiff Pro" <span className="text-muted-foreground/60"># Customized workspace title</span></p>
                    <p><span className="text-primary font-bold">NEXT_PUBLIC_APP_VERSION</span>="1.4.3" <span className="text-muted-foreground/60"># Symmetrical version tags</span></p>
                    <p><span className="text-primary font-bold">NEXT_PUBLIC_REPO_URL</span>="https://github.com/jaytailor15/codediff" <span className="text-muted-foreground/60"># Repository redirection link</span></p>
                    <p><span className="text-primary font-bold">REDIS_URL</span>="redis://default:password@host:port" <span className="text-muted-foreground/60"># Global share database credentials</span></p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 text-xs space-y-2">
                      <p className="font-bold text-emerald-500 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        Visual Open Source Badge
                      </p>
                      <p className="text-muted-foreground leading-relaxed font-sans">
                        An <strong className="text-foreground">OPEN SOURCE</strong> visual badge is placed in the top Navbar header next to the version indicator. Tapping the Github Repository button in the Navbar redirects users directly to the repository link defined in your `.env` settings (controlled under <code className="text-primary font-bold font-mono text-[10px]">jaytailor15</code>'s space).
                      </p>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/15 rounded-lg p-4 text-xs space-y-2">
                      <p className="font-bold text-red-500 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        Secure Redis Cloud Sharing
                      </p>
                      <p className="text-muted-foreground leading-relaxed font-sans">
                        Connecting your database via the <code className="text-primary font-bold font-mono text-[10px]">REDIS_URL</code> variable enables global, secure 16-character link sharing across different machines. Slugs are securely randomized on the server and records expire automatically after 30 days to prevent bloat.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-xs space-y-2">
                    <p className="font-bold text-foreground flex items-center gap-1.5">
                      Vercel Serverless Edge Integration
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      CodeDiff Pro is pre-configured for instant zero-configuration deployment to the Vercel hosting platform. Next.js 15 routing handles GET and POST requests on serverless edge runtimes, ensuring database payloads are retrieved securely and rendered in less than 150ms globally.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "keyboard-shortcuts" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Keyboard className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">IDE Keyboard Shortcuts</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Operate the comparative workspace at speed using unified, professional-grade visual shortcuts:
                  </p>
                </div>

                {/* Section A: Custom Workspace Control Hotkeys */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />
                    Workspace Control Hotkeys
                  </h3>
                  <div className="w-full overflow-x-auto custom-scrollbar">
                    <div className="border border-border rounded-lg overflow-hidden bg-background/55 text-xs shadow-sm min-w-[650px] lg:min-w-0">
                      <div className="grid grid-cols-3 bg-secondary/80 border-b border-border p-3 font-bold text-foreground uppercase tracking-wider text-[9px]">
                        <div>Workspace Hotkey</div>
                        <div>Key Trigger Combination</div>
                        <div>Workspace Action</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <GitCompareArrows className="h-4.5 w-4.5 text-primary" />
                          <span>Compare Code</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Enter</kbd>
                        </div>
                        <div className="text-muted-foreground">Force-trigger code comparison manually.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <Eraser className="h-4.5 w-4.5 text-primary" />
                          <span>Clear Canvas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">D</kbd>
                        </div>
                        <div className="text-muted-foreground">Clear current editor inputs and reset variables.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <Clipboard className="h-4.5 w-4.5 text-primary" />
                          <span>Copy Unified Patch</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Shift</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">C</kbd>
                        </div>
                        <div className="text-muted-foreground">Generate and copy unified `.diff` patch immediately.</div>
                      </div>

                      <div className="grid grid-cols-3 p-3.5 items-center">
                        <div className="font-bold text-foreground flex items-center gap-1.5">
                          <Minimize2 className="h-4.5 w-4.5 text-primary" />
                          <span>Exit Fullscreen</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Esc</kbd>
                        </div>
                        <div className="text-muted-foreground">Reset fullscreen focus view and restore sidebars.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Monaco Power-Editor Keybindings */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Monaco Power-Editor Built-in Hotkeys
                  </h3>
                  <div className="w-full overflow-x-auto custom-scrollbar">
                    <div className="border border-border rounded-lg overflow-hidden bg-background/55 text-xs shadow-sm min-w-[650px] lg:min-w-0">
                      <div className="grid grid-cols-3 bg-secondary/80 border-b border-border p-3 font-bold text-foreground uppercase tracking-wider text-[9px]">
                        <div>Monaco Action</div>
                        <div>Key Trigger Combination</div>
                        <div>Workspace Utility</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Command Palette</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">F1</kbd>
                          <span className="text-muted-foreground">or</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Alt</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">F1</kbd>
                        </div>
                        <div className="text-muted-foreground">Access all editor commands, configurations, and actions.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Find Text</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">F</kbd>
                        </div>
                        <div className="text-muted-foreground">Open the search bar to locate specific tokens or phrases.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Replace Text</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">H</kbd>
                        </div>
                        <div className="text-muted-foreground">Search and replace matching substrings in the active canvas.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Toggle Comment</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">/</kbd>
                        </div>
                        <div className="text-muted-foreground">Comment or uncomment the currently active code line.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Multi-Cursor Placement</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Alt/Option</kbd>
                          <span className="text-muted-foreground">+</span>
                          <span className="text-muted-foreground font-semibold text-[10px]">Click</span>
                        </div>
                        <div className="text-muted-foreground">Spawn secondary insertion points for concurrent editing.</div>
                      </div>

                      <div className="grid grid-cols-3 border-b border-border/40 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Format Document</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Shift</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Alt</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">F</kbd>
                        </div>
                        <div className="text-muted-foreground">Prettify and format the selected code structure dynamically.</div>
                      </div>

                      <div className="grid grid-cols-3 p-3.5 items-center">
                        <div className="font-bold text-foreground">
                          <span>Autocomplete Suggestions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Cmd/Ctrl</kbd>
                          <span className="text-muted-foreground">+</span>
                          <kbd className="bg-background border border-border px-1.5 py-0.5 rounded shadow-sm font-semibold text-[10px]">Space</kbd>
                        </div>
                        <div className="text-muted-foreground">Trigger intelligent autocompletion and type suggestions.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "privacy-policy" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Shield className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protocol</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    CodeDiff Pro is architected with a strict privacy-first framework. All code processing and difference analysis occur entirely locally within your browser sandbox.
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-6">
                  {/* Local Processing */}
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3.5">
                    <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-foreground">Local Execution Sandbox</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Your source code never leaves your computer. Symmetrical file comparison, ignore transforms, font customizers, and clipboard export integrations are evaluated completely client-side. We do not transmit raw snippets or analytics payloads to external endpoints.
                      </p>
                    </div>
                  </div>

                  {/* Cookies and Storage */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-primary" />
                      Client-Side Storage
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      We utilize standard local Web Storage APIs (Local Storage) strictly to preserve user interface state toggles (such as resolution view, tab configuration, and custom ignore lists) across workspace refreshes. No tracking cookies or analytical scripts are integrated into this application.
                    </p>
                  </div>

                  {/* Authorship */}
                  <div className="bg-secondary/20 border border-border/60 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <span className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">Project Identity</span>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">Verified</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-normal">Author, Founder & Owner</span>
                        <span className="text-foreground">Jay Tailor</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-normal">GitHub Profile</span>
                        <span className="text-primary hover:underline">@jaytailor15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "license" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Scale className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Agreement</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">License Agreement</h1>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    By accessing, downloading, or deploying the CodeDiff Pro repository, you agree to comply with these exclusive licensing structures.
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-6">
                  {/* Strict Restriction Warning */}
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4 flex gap-3.5">
                    <div className="h-7 w-7 rounded bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-foreground text-amber-600 dark:text-amber-500 font-bold">Strict Cloning and Distribution Restriction</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Cloning or copying this codebase is permitted strictly for contributing back to the official open-source repository via Pull Requests. <strong>Under no circumstances may any contributor, user, or third-party clone, download, or distribute this repository to host it as a private repository or proprietary product.</strong>
                      </p>
                    </div>
                  </div>

                  {/* Core License Terms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-border/80 rounded-lg p-4 bg-background/40 space-y-1.5 shadow-sm">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-primary" />
                        Exclusive Owner Rights
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Founder Jay Tailor (@jaytailor15) maintains absolute administrative access, deployment authorization, and intellectual governance over the codebase.
                      </p>
                    </div>

                    <div className="border border-border/80 rounded-lg p-4 bg-background/40 space-y-1.5 shadow-sm">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
                        Open-Source PRs
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Contributors possess complete authorization to clone for active repository additions, feature merges, bug resolutions, and security PRs.
                      </p>
                    </div>

                    <div className="border border-border/80 rounded-lg p-4 bg-background/40 space-y-1.5 shadow-sm">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Gift className="h-3.5 w-3.5 text-primary" />
                        100% Free Ecosystem
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        No platform payments or paywalls. Every tool is provided freely for collaborative developer comparisons.
                      </p>
                    </div>

                    <div className="border border-border/80 rounded-lg p-4 bg-background/40 space-y-1.5 shadow-sm">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Github className="h-3.5 w-3.5 text-primary" />
                        Sponsorship Invites
                      </h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Sponsorship is welcome and invited from companies and individuals looking to support server hosting and development longevity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

interface SidebarButtonProps {
  sec: DocSection;
  active: boolean;
  onClick: (id: string) => void;
}

function SidebarButton({ sec, active, onClick }: SidebarButtonProps) {
  const Icon = sec.icon;
  return (
    <button
      onClick={() => onClick(sec.id)}
      className={cn(
        "flex items-center justify-between w-full gap-2.5 px-3 py-2 rounded-md text-[11px] font-semibold transition-all duration-150 border",
        active
          ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
          : "text-muted-foreground border-transparent hover:bg-secondary/40 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{sec.title}</span>
      </div>
      {sec.badge && (
        <span className={cn(
          "text-[7px] font-extrabold uppercase px-1 rounded tracking-wide shrink-0",
          active ? "bg-primary/25 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {sec.badge}
        </span>
      )}
    </button>
  );
}

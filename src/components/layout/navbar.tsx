"use client";

import { useEffect, useState } from "react";
import { Github, Home, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { APP_VERSION } from "@/lib/constants";
import { env } from "@/lib/env";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { cn } from "@/lib/cn";
import { LanguageSelector } from "./language-selector";

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isDark = resolvedTheme === "dark";
  const isDocs = pathname === "/docs";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-background/80 fixed top-0 left-0 right-0 z-50 border-b border-border backdrop-blur-md w-full">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" className="flex items-center gap-3 min-w-0 hover:opacity-90 transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0b0f19] border border-border/40 shadow-glow shrink-0">
                <svg className="h-6 w-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 20V44L46 12" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 48L50 20V36" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="32" cy="32" r="8" stroke="#e2e8f0" strokeWidth="4.5" fill="none" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="truncate text-sm font-semibold">CodeDiff Pro</p>
                  <span className="shrink-0 bg-primary/10 text-primary border border-primary/20 text-[9px] px-1.5 py-0.5 rounded-full font-extrabold select-none">
                    v{APP_VERSION}
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
                  Developer-grade code and file comparison
                </p>
              </div>
            </a>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {mounted && (
            <>
              {isDocs ? (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="inline-flex gap-1.5 text-xs font-semibold h-8"
                >
                  <a href="/">
                    <Home className="h-3.5 w-3.5" />
                    Workspace
                  </a>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold h-8"
                >
                  <a href="/docs">
                    Docs
                  </a>
                </Button>
              )}

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
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle color theme"
            data-tooltip="Toggle color theme"
            data-tooltip-position="bottom"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="h-8 w-8"
          >
            {mounted && isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-8 text-xs font-semibold"
          >
            <a href={env.repoUrl} target="_blank" rel="noreferrer">
              <Github className="h-3.5 w-3.5" />
              Repository
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

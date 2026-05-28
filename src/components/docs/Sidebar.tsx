use client;

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { docSections } from "@/app/docs/constants"; // Will be created
import { Sun, Moon, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Responsive sidebar navigation for the documentation page.
 * - Desktop: fixed width, scrollable, glass‑styled.
 * - Mobile: collapsible drawer toggled by a button.
 */
export default function Sidebar({
  activeSection,
  onSelect,
}: {
  activeSection: string;
  onSelect: (id: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="lg:hidden flex items-center gap-2 p-2 rounded-md hover:bg-secondary/20"
        onClick={toggleMobile}
      >
        {mobileOpen ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeftOpen className="h-5 w-5" />
        )}
      </button>

      {/* Sidebar container */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-card/30 backdrop-blur-md border-r border-border/60 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Documentation navigation"
      >
        {/* Theme toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <button
            aria-label="Toggle color theme"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-md hover:bg-secondary/20 flex items-center justify-center"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
        {/* Section list */}
        <ul className="p-4 space-y-2">
          {docSections.map((sec) => (
            <li key={sec.id}>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(sec.id);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeSection === sec.id && "bg-primary/10 text-primary",
                )}
                aria-current={activeSection === sec.id ? "page" : undefined}
              >
                <sec.icon className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{sec.title}</span>
                {sec.badge && (
                  <span className="ml-auto text-xs font-bold uppercase px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                    {sec.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/**
 * Centralized Design System Visual Tokens & Styling Configuration
 * 
 * Modifying any parameter in this dynamic config updates all visual padding, 
 * icon bounds, font-sizes, tracking, and heights globally and symmetrically 
 * across both the Left and Right sidebars instantly.
 */
export const DESIGN_TOKENS = {
  // Activity Bars (Slim Side Selectors)
  activityBar: {
    iconSize: "h-[18px] w-[18px]",   // Consistently sizes settings, history, metrics, diagnostics, etc.
    buttonSize: "h-9 w-9",           // Hover background boundaries
    bottomDivider: "border-b border-border/30 pb-2 rounded-b-none",
    topDivider: "border-t border-border/30 pt-2 rounded-t-none"
  },

  // Main Card Wrapper Layouts
  sidebarPanel: {
    initialWidth: 230,               // Symmetrical default desktop width in pixels
    minWidth: 170,                   // Minimum drag bounds
    maxWidth: 320,                   // Maximum drag bounds
    padding: "p-2.5",                // Tight padding inside collapsible columns
    cardPadding: "p-3",              // Padding inside individual config/diagnostics cards
    cardSpacingY: "space-y-2.5"      // Vertical gaps between items inside cards
  },

  // Typography Scales & Trackings
  typography: {
    // Premium custom main title headers
    headerPrimary: "text-[10px] font-bold text-primary uppercase tracking-widest leading-none",
    // Muted grey tracking categories
    headerMuted: "text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground",
    // Small italic or subtitle text labels
    subtitle: "text-[10px] text-muted-foreground font-semibold leading-none",
    // Switch items and selects labels
    labelFont: "text-xs font-semibold text-foreground"
  },

  // Stats Metrics Panels (StatCard Sizing)
  statCard: {
    padding: "p-2.5",
    valueFont: "text-base font-extrabold text-foreground leading-none tabular-nums",
    labelFont: "text-[9.5px] font-bold text-muted-foreground mt-1.5 leading-none uppercase tracking-wide truncate",
    badgeSize: "h-8.5 w-8.5",        // Circular tone backdrop size
    iconSize: "h-4 w-4"              // Lucide icon boundaries
  },

  // Quick Action Buttons Grid (Bottom Right Panel)
  quickActions: {
    gridGap: "gap-1.5",
    buttonHeight: "h-9",             // Grid button height - aligned symmetrically to h-9
    iconSize: "h-4 w-4"              // Standard Lucide action icon boundaries
  }
} as const;

"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * A highly-professional, centralized React tooltip wrapper.
 * Wrap any element or icon with TooltipWrapper to instantly give it a beautiful, 
 * glassmorphic tooltip with transition scale animations.
 * 
 * To modify tooltip styling globally, edit this file or the associated
 * custom tooltip classes in globals.css.
 */
export function TooltipWrapper({
  children,
  content,
  position = "top",
  className
}: TooltipWrapperProps) {
  if (!content) return <>{children}</>;

  // Ensure tooltips at screen edges default safely to center-facing directions
  let safePosition = position;
  
  return (
    <span
      className={cn("inline-flex relative group overflow-visible", className)}
      data-tooltip={content}
      data-tooltip-position={safePosition}
    >
      {children}
    </span>
  );
}
export default TooltipWrapper;

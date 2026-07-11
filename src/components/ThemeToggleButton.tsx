"use client";

import { useTheme } from "@/lib/theme";
import { Sun, Moon } from "lucide-react";

/**
 * Global, premium theme toggle — a compact 40x40 circular icon button.
 * Shows a single icon at a time: a gold Moon in dark mode, a dark Sun in
 * light mode. On toggle the icons cross-fade with a 180° rotate + scale.
 *
 * Reuses the existing ThemeProvider (`useTheme`) — no second theme system.
 * `className` lets callers tweak spacing/placement per navbar.
 */
export default function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  const iconTransition =
    "absolute w-[18px] h-[18px] will-change-transform transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-transparent cursor-pointer transition-colors duration-200 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {/* Moon — visible in dark mode (gold) */}
      <Moon
        aria-hidden={!isDark}
        className={`${iconTransition} text-primary`}
        style={{
          opacity: isDark ? 1 : 0,
          transform: `rotate(${isDark ? 0 : 180}deg) scale(${isDark ? 1 : 0.9})`,
        }}
      />
      {/* Sun — visible in light mode (near-black) */}
      <Sun
        aria-hidden={isDark}
        className={`${iconTransition} text-foreground`}
        style={{
          opacity: isDark ? 0 : 1,
          transform: `rotate(${isDark ? -180 : 0}deg) scale(${isDark ? 0.9 : 1})`,
        }}
      />
    </button>
  );
}

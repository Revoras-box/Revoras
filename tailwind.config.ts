import type { Config } from "tailwindcss";

/**
 * NOTE: This project uses Tailwind CSS v4, which is configured CSS-first in
 * `src/app/globals.css` via `@theme inline` + runtime CSS variables. That is
 * the single source of truth for theme tokens and light/dark switching.
 *
 * This file is kept only for tooling/back-compat. Every color references the
 * same runtime CSS variable as globals.css, so it can never reintroduce stale
 * fixed values even if a future `@config` directive loads it.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        card: "var(--card)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container": "var(--surface-container)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-variant": "var(--surface-variant)",
        "surface-dim": "var(--surface-dim)",
        "surface-bright": "var(--surface-bright)",

        foreground: "var(--foreground)",
        "on-surface": "var(--on-surface)",
        "on-background": "var(--on-background)",
        "on-surface-variant": "var(--on-surface-variant)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",

        border: "var(--border)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",

        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-foreground": "var(--primary-foreground)",
        "primary-container": "var(--primary-container)",
        "on-primary": "var(--on-primary)",
        "on-primary-container": "var(--on-primary-container)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",

        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-foreground": "var(--accent-foreground)",
        "on-accent": "var(--on-accent)",
        "accent-container": "var(--accent-container)",
        "on-accent-container": "var(--on-accent-container)",

        secondary: "var(--secondary)",
        "on-secondary": "var(--on-secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary-container": "var(--on-secondary-container)",
        "secondary-fixed": "var(--secondary-fixed)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",

        tertiary: "var(--tertiary)",
        "tertiary-container": "var(--tertiary-container)",

        error: "var(--error)",
        "on-error": "var(--on-error)",
        "error-container": "var(--error-container)",
        "on-error-container": "var(--on-error-container)",

        warning: "var(--warning)",
        "on-warning": "var(--on-warning)",
        "warning-container": "var(--warning-container)",
        "on-warning-container": "var(--on-warning-container)",

        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
      },
      fontFamily: {
        headline: ["Hanken Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1.5rem",
        btn: "1rem",
        input: "1rem",
        dialog: "1.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;

import type { Config } from "tailwindcss";

/**
 * Design tokens from the Stitch "Neo-Minimalist Engineering" system.
 * Near-black canvas, tonal layering (no shadows), hairline outlines,
 * electric blue as the sole action color. Green/red are status-only
 * signals (running / failing) — never decoration.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121316",
        surface: "#131417",
        "surface-dim": "#0d0e11",
        "surface-container-low": "#1b1b1f",
        "surface-container": "#1f1f23",
        "surface-container-high": "#292a2d",
        "surface-container-highest": "#343538",
        "on-surface": "#e3e2e6",
        "on-surface-variant": "#c3c6d7",
        outline: "#8d90a0",
        "outline-variant": "#202227",
        "outline-dim": "#565c64",
        primary: "#2563eb",
        "on-primary": "#ffffff",
        "primary-container": "#2563eb",
        "on-primary-container": "#eeefff",
        "primary-dim": "#b4c5ff",
        "signal-ok": "#3ddc97",
        "signal-alert": "#ff5a5f",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "72px",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
        "display-lg": [
          "56px",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "500" },
        ],
        "headline-lg": [
          "48px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "400" },
        ],
        "headline-md": [
          "32px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "body-md": [
          "16px",
          { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" },
        ],
        "label-sm": [
          "12px",
          { lineHeight: "1", letterSpacing: "0.12em", fontWeight: "600" },
        ],
      },
      spacing: {
        gutter: "32px",
        "margin-mobile": "24px",
        "stack-sm": "8px",
        "stack-md": "24px",
        "stack-lg": "64px",
        "section-desktop": "160px",
        "section-mobile": "96px",
      },
      maxWidth: {
        container: "1280px",
        measure: "68ch",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      transitionTimingFunction: {
        mechanical: "cubic-bezier(0.2, 0, 0, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;

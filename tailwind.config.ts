import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0C0407",
        charcoal: "#1A0E12",
        panel: "#200F14",
        burgundy: "#4A0E1C",
        "burgundy-deep": "#2B0810",
        crimson: "#8C1327",
        royal: "#131B3D",
        gold: "#C9A227",
        "gold-dim": "#8A741E",
        bone: "#F3EFE6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        impact: ["var(--font-anton)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      backgroundImage: {
        "seal-radial":
          "radial-gradient(circle at center, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0) 70%)",
        "burgundy-wash":
          "linear-gradient(180deg, rgba(74,14,28,0.35) 0%, rgba(12,4,7,0) 100%)",
        "burgundy-vignette":
          "radial-gradient(120% 80% at 50% 0%, rgba(74,14,28,0.55) 0%, rgba(12,4,7,0) 60%)",
      },
    },
  },
  plugins: [],
};

export default config;

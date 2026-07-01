import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0C",
        charcoal: "#151316",
        panel: "#1B181C",
        burgundy: "#3D0C14",
        crimson: "#6B1220",
        royal: "#131B3D",
        gold: "#C9A227",
        "gold-dim": "#8A741E",
        bone: "#F3EFE6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      backgroundImage: {
        "seal-radial":
          "radial-gradient(circle at center, rgba(201,162,39,0.14) 0%, rgba(201,162,39,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;

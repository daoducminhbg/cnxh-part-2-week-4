import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        granite: {
          950: "#05070c",
          900: "#0B0F19",
          800: "#111827",
          700: "#1F2937",
          600: "#374151",
        },
        socialist: {
          crimson: "#991B1B",
          darkred: "#7F1D1D",
          deep: "#450A0A",
          bright: "#DC2626",
        },
        emblem: {
          gold: "#F59E0B",
          light: "#FBBF24",
          amber: "#D97706",
          dark: "#B45309",
          pale: "#FEF3C7",
        },
        republic: {
          emerald: "#10B981",
          emeraldDark: "#047857",
          blue: "#1E3A8A",
        }
      },
      backgroundImage: {
        "radial-emblem": "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.15) 0%, rgba(127, 29, 29, 0.08) 50%, rgba(11, 15, 25, 0) 100%)",
        "radial-victory": "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.25) 0%, rgba(11, 15, 25, 0) 70%)",
        "radial-crimson": "radial-gradient(ellipse at top, rgba(153, 27, 27, 0.3) 0%, rgba(11, 15, 25, 0) 80%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -3px rgba(245, 158, 11, 0.4), 0 0 10px -2px rgba(245, 158, 11, 0.3)",
        "gold-glow-lg": "0 0 45px -2px rgba(245, 158, 11, 0.6), 0 0 20px 2px rgba(217, 119, 6, 0.4)",
        "crimson-glow": "0 0 30px -3px rgba(185, 28, 28, 0.5)",
        "emerald-glow": "0 0 35px -2px rgba(16, 185, 129, 0.55), 0 0 15px 0 rgba(16, 185, 129, 0.35)",
        "glass-inner": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(245, 158, 11, 0.4)" },
          "50%": { borderColor: "rgba(245, 158, 11, 0.9)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;

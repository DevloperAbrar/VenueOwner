/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          400: "#64748b",
          600: "#334155",
          700: "#1e293b",
          900: "#0f172a"
        },
        // PRIMARY = brand purple (from logo)
        primary: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95"
        },
        // ACCENT = warm orange/amber (complement to purple, used for CTAs)
        accent: {
          50:  "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c"
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706"
        }
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"]
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease-out forwards",
        "fade-in":    "fadeIn 0.4s ease-out forwards",
        "slide-in-left":  "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "bounce-slow":"bounce 2s infinite"
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        fadeIn: {
          "0%":   { opacity: 0 },
          "100%": { opacity: 1 }
        },
        slideInLeft: {
          "0%":   { opacity: 0, transform: "translateX(-30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        slideInRight: {
          "0%":   { opacity: 0, transform: "translateX(30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        }
      }
    }
  },
  plugins: []
};
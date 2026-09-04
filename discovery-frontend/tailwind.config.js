/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f8fafc",
          100: "#f1f5f9",
          400: "#64748b",
          600: "#334155",
          700: "#1e293b",
          900: "#0f172a"
        },
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#dc2626",
          600: "#c81e1e",
          700: "#a81c1c"
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
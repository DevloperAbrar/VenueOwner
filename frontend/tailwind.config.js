/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6"
        },
        navy: {
          50:  "#f2f3f6",
          100: "#e3e5ec",
          200: "#c3c7d6",
          300: "#9aa0b8",
          400: "#6d7591",
          500: "#454d6c",
          600: "#2a3151",
          700: "#1a2035",
          800: "#12172a",
          900: "#0b0e1c"
        },
        accent: {
          50:  "#fdecec",
          100: "#fbd0d2",
          200: "#f5a3a8",
          300: "#ee747c",
          400: "#e8454e",
          500: "#e8192c",
          600: "#c81322",
          700: "#9e0f1b"
        },
        gold: {
          400: "#f8c976",
          500: "#f5a623",
          600: "#d38a10"
        },
        paper: "#faf9fc"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"]
      },
      keyframes: {
        slotIn: {
          "0%": { opacity: "0", transform: "translateY(18px) rotate(var(--slot-rot, 0deg))" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(var(--slot-rot, 0deg))" }
        }
      },
      animation: {
        "slot-in": "slotIn 0.55s cubic-bezier(0.22,1,0.36,1) both"
      }
    }
  },
  plugins: []
};
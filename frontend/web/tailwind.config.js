/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0a0e16",
          900: "#0d1220",
          850: "#111827",
          800: "#161d2e",
          700: "#1e2740",
          600: "#2a3654",
          500: "#3d4a6b",
          400: "#64749a",
          300: "#93a1c2",
          200: "#c2cbe0",
          100: "#e7eaf5",
        },
        accent: {
          700: "#2952d8",
          600: "#3763ec",
          500: "#4f7bff",
          400: "#7398ff",
          300: "#a3bcff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};

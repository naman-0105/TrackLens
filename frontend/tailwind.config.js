/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#5B4CF0",
        "brand-dark": "#4C3FE0",
        "brand-light": "#EEF0FF",

        teal: "#00B8A9",
        "teal-light": "#E6FAF8",

        heat: "#EF4444",

        canvas: "#F8FAFC",
        surface: "#FFFFFF",

        ink: "#111827",
        "ink-muted": "#6B7280",
        "ink-faint": "#9CA3AF",

        border: "#E5E7EB",

        sidebar: "#0F172A",
        "sidebar-hover": "#1E293B",
        "sidebar-border": "#334155",
        "sidebar-text": "#94A3B8",
        "sidebar-textActive": "#FFFFFF",
      },

      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        xl2: "1rem",
      },

      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
}


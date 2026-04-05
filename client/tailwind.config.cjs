/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          600: "#475569",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15,23,42,0.06)",
        glass: "0 12px 48px rgba(15,23,42,0.08)",
        nav: "0 1px 0 rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.04)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(900px 380px at 85% 10%, rgba(59,130,246,0.14), transparent 55%), radial-gradient(700px 280px at 0% 100%, rgba(99,102,241,0.12), transparent 60%)",
        "hero-mesh":
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 50%, rgba(239,246,255,0.95) 100%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-down": "slide-down 0.25s ease-out",
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
        glass: "0 10px 40px rgba(2,6,23,0.10)"
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(1000px 400px at top right, rgba(59,130,246,0.12), transparent 70%), radial-gradient(800px 300px at bottom left, rgba(99,102,241,0.12), transparent 70%)',
      }
    },
  },
  plugins: [],
}

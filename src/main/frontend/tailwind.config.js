/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "main": "#1A485C",
        "clinical-border": "#e2e8f0",
        "accent-red": "#dc2626",
        "accent-amber": "#d97706",
      },
    },
  },
  plugins: [],
}

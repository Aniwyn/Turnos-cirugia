const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Roboto Mono"', 'monospace'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}
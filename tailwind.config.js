/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        score: {
          poor: "#DC2626",
          fair: "#F59E0B",
          good: "#84CC16",
          great: "#22C55E",
          excellent: "#15803D",
        },
        forest: "#14532D",
        mist: "#F0FDF4",
      },
    },
  },
  plugins: [],
};

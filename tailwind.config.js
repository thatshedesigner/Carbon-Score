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
      boxShadow: {
        soft: "0 16px 40px -28px rgba(20, 83, 45, 0.45)",
      },
      keyframes: {
        screenFade: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "screen-fade": "screenFade 200ms ease-out",
      },
    },
  },
  plugins: [],
};

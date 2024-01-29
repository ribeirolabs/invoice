/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx,css}", "./tailwind.config.js"],
  theme: {
    extend: {
      fontFamily: {
        serif: "'Noto Serif', serif",
        sans: "'Rubik', sans-serif",
      },
    },
  },
  daisyui: {
    darkTheme: "business",
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["business"],
          primary: "#48b16d",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};

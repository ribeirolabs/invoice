import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        serif: "'Noto Serif', serif",
        sans: "'Rubik', sans-serif",
      },
    },

    daisyui: {
      themes: ["business"],
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;

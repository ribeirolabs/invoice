const themes = require("daisyui/src/theming/themes");
const { themeVariants } = require("tailwindcss-theme-variants");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx,css}", "./tailwind.config.js"],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        serif: "'Noto Serif', serif",
        sans: "'Rubik', sans-serif",
      },
      width: {
        18: "4.5rem",
      },
      borderRadius: {
        DEFAULT: ".5rem",
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...themes.business,
          "color-scheme": "light",
          "base-100": "oklch(100% 0 0)",
          "base-content": "#181a2a",
          primary: "#48b16d",
          "primary-content": "#122117",
          secondary: "#316f8d",
          "secondary-content": "#fff",
          accent: "#316f8d",
        },
        dark: {
          ...themes.business,
          primary: "#48b16d",
          "primary-content": "#122117",
          secondary: "#6fa0b8",
          "secondary-content": "#fff",
          accent: "#6fa0b8",
          error: "#c65e53",
          "error-content": "#fff",
        },
      },
    ],
  },
  plugins: [
    themeVariants({
      themes: {
        light: {
          selector: '[data-theme="light"]',
          mediaQuery: "",
        },
      },
      baseSelector: "",
    }),
    require("daisyui"),
  ],
};

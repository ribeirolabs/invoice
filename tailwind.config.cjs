/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      'light',
      {
        dark: {
          ...require('daisyui/src/colors/themes')["[data-theme=business]"],
          primary: '#48b16d'
        }
      }
    ]
  }
};

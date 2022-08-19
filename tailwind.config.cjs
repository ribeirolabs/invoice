/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        business: {
          ...require('daisyui/src/colors/themes')["[data-theme=business]"],
          primary: '#48b16d'
        }
      }
    ]
  }
};

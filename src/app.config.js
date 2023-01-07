/** @type {AppConfig} */
module.exports = {
  appName: "invoice",
  defaultSettings: {
    sensitiveInformation: true,
  },
  theme: {
    colors: {
      primary: "#48b16d",
      secondary: "#555",
      neutral: "#111",
      "info-content": "#031422",
    },
  },
  translations: {},
  auth: {
    scopes: ["https://www.googleapis.com/auth/gmail.compose"],
  },
};

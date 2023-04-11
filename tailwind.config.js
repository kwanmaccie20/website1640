const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "30em",
        sm: "48em",
        md: "64em",
        lg: "74em",
        xl: "90em",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans],
      },
    },
    animation: {
      pop: "ping 1s ease",
    },
    keyframes: {
      ping: {
        "75%, 100%": {
          transform: "scale(2)",
          opacity: 0,
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

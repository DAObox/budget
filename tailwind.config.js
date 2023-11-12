/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: "#101010",
      },
      fontFamily: {
        poppins: "Poppins",
      },
    },
    fontSize: {
      sm: "0.78rem",
    },
  },
  corePlugins: {
    preflight: false,
  },
};

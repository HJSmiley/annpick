/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      colors: {
        "custom-orange": "#FF9900",
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      colors: {
        'custom-orange': '#FF9900', // 원하는 주황색 코드로 변경하세요
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      // 여기에 다른 테마 확장 설정을 추가할 수 있습니다.
      // 예: spacing, fontSize 등
    },
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/forms'), // 이 줄을 추가합니다
  ]
}
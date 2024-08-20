/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 내의 모든 JS/TS 파일 스캔
    "./public/index.html", // public 폴더의 index.html 파일도 포함
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        // 필요한 경우 다른 폰트 스타일도 여기에 추가할 수 있습니다.
        // 예: 'serif': ['다른 폰트', 'serif'],
      },
      // 여기에 다른 테마 확장 설정을 추가할 수 있습니다.
      // 예: colors, spacing, fontSize 등
    },
  },
  plugins: [
    // 필요한 Tailwind 플러그인을 여기에 추가할 수 있습니다.
  ],
}
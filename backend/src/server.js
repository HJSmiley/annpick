const app = require("./app"); // 'app.js'에서 Express 애플리케이션을 가져옵니다.

const port = process.env.PORT || 8000;

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

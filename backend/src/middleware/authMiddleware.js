const jwt = require("jsonwebtoken");
const { User } = require("../models"); // User 모델 가져오기

async function authenticateToken(req, res, next) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) return res.sendStatus(401); // 토큰이 없으면 401 Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않으면 403 Forbidden

    try {
      // DB에서 사용자 정보 조회
      const user = await User.findByPk(decoded.id); // 토큰에서 추출한 ID로 사용자 조회
      if (!user) return res.sendStatus(404); // 사용자를 찾을 수 없으면 404 Not Found

      req.user = user; // 사용자 정보를 요청 객체에 저장
      next(); // 다음 미들웨어 또는 라우트 핸들러로 이동
    } catch (err) {
      console.error("Failed to retrieve user:", err);
      res.sendStatus(500); // 서버 오류 시 500 응답
    }
  });
}

module.exports = authenticateToken;

const jwt = require("jsonwebtoken");

// JWT 인증 미들웨어
function authenticateToken(req, res, next) {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) return res.sendStatus(401); // 토큰이 없으면 401 Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 토큰이 유효하지 않으면 403 Forbidden
    req.user = user; // 사용자 정보를 요청 객체에 저장
    next();
  });
}

module.exports = authenticateToken;

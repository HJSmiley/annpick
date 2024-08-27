const passport = require("../config/passportConfig");
const authService = require("../services/authService");

const renderLoginPage = (req, res) => {
  res.render("login"); // login.ejs 템플릿을 렌더링
};

const naverCallback = (req, res) => {
  const token = req.user.token;
  // 프론트엔드로 리다이렉트하며 JWT 토큰 전달
  res.redirect(`http://localhost:3000/login?token=${token}`);
};

module.exports = { renderLoginPage, naverCallback };

const passport = require("../config/passportConfig");
const authService = require("../services/authService");

const renderLoginPage = (req, res) => {
  res.render("login"); // login.ejs 템플릿을 렌더링
};

const naverCallback = (req, res) => {
  const token = req.user.token;
  res.render("callback", { token }); // callback.ejs 템플릿에 token 전달
};

module.exports = { renderLoginPage, naverCallback };

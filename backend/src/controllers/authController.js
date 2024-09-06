const naverCallback = (req, res) => {
  const token = req.user.token;
  // 프론트엔드로 리다이렉트하며 JWT 토큰 전달
  res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
};

module.exports = naverCallback;

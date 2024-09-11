const UserRatedAnime = require("../models/UserRatedAnime");

const naverCallback = async (req, res) => {
  const token = req.user.token; // 네이버 소셜 로그인 후 JWT 토큰
  const userId = req.user.user_id; // 유저 ID

  try {
    // DB에서 유저의 평가 정보가 있는지 확인
    const ratingsCount = await UserRatedAnime.count({
      where: { user_id: userId },
    });

    if (ratingsCount > 0) {
      // 사용자가 이미 별점을 매긴 경우 메인 페이지로 리다이렉트
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } else {
      // 별점 정보가 없으면 평가 페이지로 리다이렉트
      // 리다이렉트 URL 로그 출력
      const redirectUrl = `${process.env.FRONTEND_URL}/evaluation?token=${token}`;
      res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error("Error checking user rating:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

module.exports = naverCallback;

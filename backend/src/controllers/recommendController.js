const {
  getRecommendations, // getRecommendations 추가
} = require("../services/recommendService");

const triggerRecommendation = async (req, res) => {
  const userId = req.user ? req.user.user_id : null; // JWT 토큰에서 사용자 ID 추출

  if (!userId) {
    console.error("추천 생성 중 오류: 유효한 사용자 ID가 없습니다.");
    return res.status(400).json({ message: "유효한 사용자 ID가 없습니다." });
  }

  try {
    const recommendedAnimes = await getRecommendations(userId); // 올바르게 함수 호출
    return res.status(200).json({ recommendedAnimes });
  } catch (error) {
    console.error("추천 생성 중 오류:", error);
    return res
      .status(500)
      .json({ message: "추천 생성 중 오류가 발생했습니다." });
  }
};

module.exports = { triggerRecommendation };

const { UserRatedAnime, Anime } = require("../models");

// 애니메이션 북마크 상태 업데이트 서비스
const updatePickStatus = async (userId, animeId, isPicked) => {
  try {
    // 기존에 북마크한 기록이 있는지 확인
    let pickRecord = await UserRatedAnime.findOne({
      where: { user_id: userId, anime_id: animeId },
    });

    if (pickRecord) {
      // 기존 기록 업데이트
      pickRecord.is_picked = isPicked;
      await pickRecord.save();
    } else {
      // 새 기록 생성
      pickRecord = await UserRatedAnime.create({
        user_id: userId,
        anime_id: animeId,
        is_picked: isPicked,
      });
    }

    return pickRecord;
  } catch (error) {
    console.error("Error in updatePickStatus:", error);
    throw error;
  }
};

// 사용자가 픽한 애니메이션 목록 조회 서비스
const getPickedAnimes = async (userId) => {
  return await UserRatedAnime.findAll({
    where: { user_id: userId, is_picked: true },
    include: [
      {
        model: Anime,
        attributes: ["anime_id", "anime_title", "thumbnail_url", "format"],
      },
    ],
  });
};

module.exports = {
  updatePickStatus,
  getPickedAnimes,
};

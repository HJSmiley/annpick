const { UserRatedAnime, Anime } = require("../models");

// 애니메이션 북마크 상태 업데이트 서비스
const updatePickStatus = async (userId, animeId, isPicked) => {
  try {
    let pickRecord = await UserRatedAnime.findOne({
      where: { user_id: userId, anime_id: animeId },
    });

    if (pickRecord) {
      pickRecord.is_picked = isPicked;
      await pickRecord.save();
    } else {
      pickRecord = await UserRatedAnime.create({
        user_id: userId,
        anime_id: animeId,
        is_picked: isPicked,
        rating: null,
      });
    }

    if (pickRecord.is_picked === false && pickRecord.rating === null) {
      await pickRecord.destroy();
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

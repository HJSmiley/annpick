// recommendService.js
const { Op } = require("sequelize");
const UserRatedAnime = require("../models/UserRatedAnime");
const Anime = require("../models/Anime");
const AniGenre = require("../models/AniGenre");
const AniTag = require("../models/AniTag");
const Genre = require("../models/Genre");
const Tag = require("../models/Tag");

const getHighRatedAnimes = async (userId) => {
  const ratedAnimes = await UserRatedAnime.findAll({
    where: { user_id: userId },
    attributes: ["anime_id", "rating"],
  });

  const highRatedAnimes = ratedAnimes.filter((anime) => anime.rating >= 4);

  return highRatedAnimes;
};

const getTopGenresAndTags = async (userId) => {
  try {
    const ratedAnimeIds = await UserRatedAnime.findAll({
      where: { user_id: userId },
      attributes: ["anime_id"],
    });

    const ratedAnimeIdArray = ratedAnimeIds.map((rating) => rating.anime_id);

    // 평가한 애니메이션을 가져오고, 각 애니메이션의 장르도 포함하여 조회
    const ratedAnimesWithGenres = await Anime.findAll({
      where: {
        anime_id: ratedAnimeIdArray,
      },
      include: [
        {
          model: Genre,
          through: { model: AniGenre }, // 중간 테이블 명시적으로 설정
        },
        {
          model: Tag,
          through: { model: AniTag }, // Tag 모델 추가
        },
      ],
    });

    return ratedAnimesWithGenres;
  } catch (error) {
    console.error("추천 로직 오류 발생:", error);
    throw new Error("추천 생성 중 오류가 발생했습니다.");
  }
};

const findRecommendedAnimes = async (userId, topGenres, topTags) => {
  const ratedAnimeIds = await UserRatedAnime.findAll({
    where: { user_id: userId },
    attributes: ["anime_id"],
  });

  const ratedAnimeIdArray = ratedAnimeIds.map((rating) => rating.anime_id);

  const recommendedAnimes = await Anime.findAll({
    where: {
      anime_id: {
        [Op.notIn]: ratedAnimeIdArray,
      },
    },
    include: [
      {
        model: Genre,
        where: { genre_name: { [Op.in]: topGenres } },
      },
      {
        model: Tag,
        through: {
          model: AniTag, // 중간 테이블 설정
          where: {
            tag_score: { [Op.gte]: 70 },
            tag_id: { [Op.in]: topTags }, // tag_id로 변경
          },
        },
      },
    ],
    limit: 10,
  });

  return recommendedAnimes;
};

const getRecommendations = async (userId) => {
  // 높은 평가를 받은 애니메이션 가져오기
  const highRatedAnimes = await getHighRatedAnimes(userId);

  // 가장 많이 평가된 장르와 태그 가져오기
  const topGenresAndTags = await getTopGenresAndTags(userId);

  // **Genres와 Tags가 undefined 또는 빈 배열일 수 있기 때문에 방어 코드 추가**
  const topGenres = topGenresAndTags
    .map((anime) =>
      anime.Genres ? anime.Genres.map((genre) => genre.genre_name) : []
    )
    .flat();

  const topTags = topGenresAndTags
    .map((anime) => (anime.Tags ? anime.Tags.map((tag) => tag.tag_id) : []))
    .flat();

  // 추천 애니메이션 찾기
  return findRecommendedAnimes(userId, topGenres, topTags);
};

module.exports = {
  getHighRatedAnimes,
  getTopGenresAndTags,
  findRecommendedAnimes,
  getRecommendations,
};

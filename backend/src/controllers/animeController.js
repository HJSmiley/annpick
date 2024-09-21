const {
  Anime,
  Genre,
  Staff,
  Tag,
  AniTag,
  UserRatedAnime,
  UserClusterPreference,
  RecommendationCluster,
} = require("../models");
const { Sequelize, Op } = require("sequelize");
const { formatReleaseDate, formatSeason } = require("../utils/animeFormatting");
const { searchMeiliAnimes } = require("../services/animeService");

// 스태프 역할을 한국어로 번역하는 함수
const translateStaffRole = (role) => {
  const roles = {
    director: "감독",
    origin: "원작",
  };
  return roles[role] || "Unknown";
};

const getAnimeByIds = async (req, res) => {
  try {
    const animeIds = req.query.ids;
    const userId = req.user ? req.user.user_id : null;

    if (!animeIds) {
      return res.status(400).json({ error: "ID값이 없습니다." });
    }

    const idArray = animeIds
      .split(",")
      .map((animeId) => parseInt(animeId.trim(), 10));

    const animeList = await Anime.findAll({
      where: { anime_id: idArray },
      attributes: [
        "anime_id",
        "anime_title",
        "anime_title_ko",
        "thumbnail_url",
        "format",
        "is_completed",
      ],
    });

    if (animeList.length === 0) {
      return res
        .status(404)
        .json({ error: "해당하는 ID의 애니메이션을 찾을 수 없습니다." });
    }

    const genrePromises = animeList.map((anime) =>
      Genre.findAll({
        include: {
          model: Anime,
          where: { anime_id: anime.anime_id },
          attributes: [],
        },
        attributes: ["genre_name"],
      })
    );

    const aniTagPromises = animeList.map((anime) =>
      AniTag.findAll({
        where: { anime_id: anime.anime_id },
        include: [{ model: Tag, attributes: ["tag_name"] }],
        attributes: ["tag_score"],
      })
    );

    const [genresArray, aniTagsArray] = await Promise.all([
      Promise.all(genrePromises),
      Promise.all(aniTagPromises),
    ]);

    const response = animeList.map((anime, index) => {
      const genres = genresArray[index]
        .map((genre) => genre.genre_name)
        .sort((a, b) => a.localeCompare(b, "ko-KR"))
        .slice(0, 3);

      const topTags = aniTagsArray[index]
        .sort((a, b) => b.tag_score - a.tag_score)
        .slice(0, 4)
        .map((aniTag) => aniTag.Tag.tag_name);

      return {
        anime_id: anime.anime_id,
        thumbnail_url: anime.thumbnail_url,
        title: anime.anime_title_ko || anime.anime_title,
        format: anime.format,
        status: anime.is_completed ? "완결" : "방영중",
        genres,
        tags: topTags,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("애니메이션 리스트를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "애니메이션 리스트를 가져오는 데 실패했습니다." });
  }
};

const getAnimeDetails = async (req, res) => {
  try {
    const animeId = req.params.id;
    const userId = req.user ? req.user.user_id : null;

    const anime = await Anime.findOne({
      where: { anime_id: animeId },
      include: [
        {
          model: Genre,
          attributes: ["genre_name"],
          through: { attributes: [] },
        },
        {
          model: AniTag,
          attributes: ["tag_score"],
          include: {
            model: Tag,
            attributes: ["tag_name"],
          },
        },
        {
          model: Staff,
          attributes: ["staff_name"],
          through: { attributes: ["role"] },
        },
      ],
      attributes: [
        "anime_id",
        "anime_title",
        "anime_title_ko",
        "thumbnail_url",
        "banner_img_url",
        "format",
        "is_completed",
        "release_date",
        "description",
        "description_ko",
        "season",
        "studio",
      ],
    });

    if (!anime) {
      return res
        .status(404)
        .json({ error: "해당하는 애니메이션을 찾을 수 없습니다." });
    }

    const topTags = anime.AniTags.map((aniTag) => aniTag.Tag.tag_name);
    const translatedStaff = anime.Staffs.map((staff) => ({
      name: staff.staff_name,
      role: translateStaffRole(staff.AniStaff.role),
    }));

    const userRating = userId
      ? await UserRatedAnime.findOne({
          where: { user_id: userId, anime_id: animeId },
          attributes: ["rating", "is_picked"],
        })
      : null;

    const response = {
      anime_id: anime.anime_id,
      title: anime.anime_title_ko || anime.anime_title,
      thumbnail_url: anime.thumbnail_url,
      banner_img_url: anime.banner_img_url,
      format: anime.format,
      status: anime.is_completed ? "완결" : "방영중",
      release_date: formatReleaseDate(anime.release_date),
      description: anime.description_ko || anime.description,
      season: formatSeason(anime.season),
      studio: anime.studio,
      genres: anime.Genres.map((genre) => genre.genre_name).slice(0, 3),
      tags: topTags,
      staff: translatedStaff,
      user_rating: userRating ? userRating.rating : 0,
      is_picked: userRating ? userRating.is_picked : false,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("애니메이션 상세 정보를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "애니메이션 상세 정보를 가져오는 데 실패했습니다." });
  }
};

const rateAnime = async (req, res) => {
  const { anime_id, rating } = req.body;
  const user_id = req.user.user_id;

  if (!anime_id || rating === undefined) {
    return res
      .status(400)
      .json({ message: "애니메이션 ID와 별점 정보가 필요합니다." });
  }

  try {
    let userRating = await UserRatedAnime.findOne({
      where: { user_id, anime_id },
    });

    if (rating === 0) {
      if (userRating) {
        await userRating.destroy();
        return res.status(200).json({ message: "평가가 삭제되었습니다." });
      }
    } else {
      if (userRating) {
        userRating.rating = rating;
        await userRating.save();
      } else {
        userRating = await UserRatedAnime.create({
          user_id,
          anime_id,
          rating,
        });
      }
    }

    if (userRating.is_picked === 0 && userRating.rating === null) {
      await userRating.destroy();
    }

    return res
      .status(200)
      .json({ message: "평가가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("별점을 저장하는 중 오류 발생:", error);
    return res.status(500).json({
      message: "별점을 저장하는 데 실패했습니다.",
      error: error.message,
    });
  }
};

const getRatedAnimes = async (req, res) => {
  const { user_id } = req.user;
  const { page = 1, rating = null } = req.query;
  const limit = 20;

  try {
    const whereClause = {
      user_id,
      rating: { [Op.ne]: null },
    };

    if (rating) {
      whereClause.rating = rating;
    }

    const ratedAnimes = await UserRatedAnime.findAll({
      where: whereClause,
      include: [
        {
          model: Anime,
          attributes: ["anime_id", "anime_title", "thumbnail_url", "format"],
        },
      ],
      limit,
      offset: (page - 1) * limit,
    });

    if (!ratedAnimes || ratedAnimes.length === 0) {
      return res.status(200).json([]);
    }

    const response = ratedAnimes.map((entry) => ({
      anime_id: entry.Anime.anime_id,
      title: entry.Anime.anime_title,
      thumbnail_url: entry.Anime.thumbnail_url,
      format: entry.Anime.format,
      rating: entry.rating,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error("애니메이션 조회 중 오류 발생:", error);
    return res
      .status(500)
      .json({ message: "평가된 애니메이션 조회 중 오류가 발생했습니다." });
  }
};

const searchAnimes = async (req, res) => {
  try {
    const query = req.query.query || "";
    const genre = req.query.genre ? req.query.genre.split(",") : [];
    const tag = req.query.tag ? req.query.tag.split(",") : [];

    const filters = {};
    if (genre.length > 0) filters.genre = genre;
    if (tag.length > 0) filters.tag = tag;

    const meiliResults = await searchMeiliAnimes(query, filters);
    const animeIds = meiliResults.map((anime) => anime.id);

    if (animeIds.length === 0) {
      return res.status(404).json({ message: "검색 결과가 없습니다." });
    }

    const animeList = await Anime.findAll({
      where: { anime_id: animeIds },
      attributes: [
        "anime_id",
        "anime_title",
        "thumbnail_url",
        "format",
        "is_completed",
      ],
      include: [
        { model: Genre, attributes: ["genre_name"] },
        {
          model: AniTag,
          attributes: ["tag_score"],
          include: { model: Tag, attributes: ["tag_name"] },
        },
      ],
    });

    const formattedResults = animeList.map((anime) => {
      const genres = anime.Genres.map((genre) => genre.genre_name).slice(0, 3);
      const topTags = anime.AniTags.sort((a, b) => b.tag_score - a.tag_score)
        .slice(0, 4)
        .map((aniTag) => aniTag.Tag.tag_name);

      return {
        anime_id: anime.anime_id,
        title: anime.anime_title,
        thumbnail_url: anime.thumbnail_url,
        format: anime.format,
        status: anime.is_completed ? "완결" : "방영중",
        genres: genres,
        tags: topTags,
      };
    });

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "An error occurred while searching animes" });
  }
};

const getRecommendedAnimeSections = async (req, res) => {
  try {
    const userId = req.user ? req.user.user_id : null;

    if (!userId) {
      return res.status(401).json({ error: "인증된 사용자가 아닙니다." });
    }

    // UserClusterPreference에서 사용자 선호 조합 3개 랜덤 선택
    const userPreferences = await UserClusterPreference.findAll({
      where: { user_id: userId },
      order: Sequelize.literal("RAND()"),
      limit: 3,
      include: [{ model: Genre }, { model: Tag }],
    });

    if (userPreferences.length === 0) {
      // 선호 조합이 없을 경우 빈 배열 반환
      return res.status(200).json([]);
    }

    // 사용자가 이미 평가한 애니메이션 ID 목록 조회
    const ratedAnimes = await UserRatedAnime.findAll({
      where: { user_id: userId },
      attributes: ["anime_id"],
    });
    const ratedAnimeIds = ratedAnimes.map((ra) => ra.anime_id); // 평가한 애니메이션 ID 배열

    const sections = [];

    for (const preference of userPreferences) {
      const {
        genre_id,
        tag_id,
        preference_score,
        Genre: genre,
        Tag: tag,
      } = preference;

      // RecommendationCluster에서 해당 장르+태그의 애니메이션 ID 가져오기
      const recommendations = await RecommendationCluster.findAll({
        where: { genre_id, tag_id },
        attributes: ["anime_id", "recommendation_phrase"],
      });

      let animeIds = recommendations
        .map((rec) => rec.anime_id)
        .filter((id) => !ratedAnimeIds.includes(id)); // 평가한 애니메이션 제외

      const recommendationPhrase =
        recommendations[0]?.recommendation_phrase ||
        `${genre.genre_name} + ${tag.tag_name}`;

      // 애니메이션 ID 배열을 섞는다 (최대 15개 선택)
      animeIds = shuffleArray(animeIds).slice(0, 15);

      // 섹션 구성
      if (animeIds.length > 0) {
        sections.push({
          title: recommendationPhrase,
          preference_score,
          ids: animeIds, // 평가한 애니메이션 제외된 ID 배열 반환
        });
      }
    }

    res.status(200).json(sections);
  } catch (error) {
    console.error("추천 섹션을 가져오는 중 오류 발생:", error);
    res.status(500).json({ error: "추천 섹션을 가져오는 데 실패했습니다." });
  }
};

// 배열을 섞는 함수 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex;

  // 남은 요소가 없을 때까지 반복
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // 현재 요소와 선택한 무작위 요소를 교환
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

module.exports = {
  getAnimeByIds,
  getAnimeDetails,
  rateAnime,
  getRatedAnimes,
  searchAnimes,
  getRecommendedAnimeSections,
};

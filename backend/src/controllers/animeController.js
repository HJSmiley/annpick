const { Anime, Genre, Staff, Tag, UserRatedAnime } = require("../models");
const { formatReleaseDate, formatSeason } = require("../utils/animeFormatting");
const {
  translateStaffName,
  translateStaffRole,
  translateGenre,
  translateTag,
} = require("../utils/animeTranslate");
const { searchMeiliAnimes } = require("../services/animeService");

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
      include: [
        { model: Genre, through: { attributes: [] } },
        { model: Tag, through: { attributes: [] } },
      ],
    });

    if (animeList.length === 0) {
      return res
        .status(404)
        .json({ error: "해당하는 ID의 애니메이션을 찾을 수 없습니다." });
    }

    const response = await Promise.all(
      animeList.map(async (anime) => {
        let userRating = 0; // 기본값으로 0 설정

        if (userId) {
          const ratingRecord = await UserRatedAnime.findOne({
            where: { user_id: userId, anime_id: anime.anime_id },
            attributes: ["rating"],
          });
          userRating = ratingRecord ? ratingRecord.rating : 0;
        }

        return {
          anime_id: anime.anime_id,
          thumbnail_url: anime.thumbnail_url,
          title: anime.anime_title,
          format: anime.format,
          status: anime.is_completed ? "완결" : "방영중",
          genres: translateGenre(
            anime.Genres.map((genre) => genre.genre_name)
          ).slice(0, 3),
          tags: translateTag(anime.Tags.map((tag) => tag.tag_name))
            .sort((a, b) => b.rank - a.rank)
            .slice(0, 4),
          user_rating: userRating, // 비로그인 사용자는 0, 로그인 사용자는 별점 정보
        };
      })
    );

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
        { model: Genre, through: { attributes: [] } },
        { model: Tag, through: { attributes: [] } },
        { model: Staff, through: { attributes: ["role"] } },
      ],
    });

    if (!anime) {
      return res
        .status(404)
        .json({ error: "해당하는 애니메이션을 찾을 수 없습니다." });
    }

    let userRating = 0;
    if (userId) {
      const ratingRecord = await UserRatedAnime.findOne({
        where: { user_id: userId, anime_id: anime.anime_id },
        attributes: ["rating"],
      });
      userRating = ratingRecord ? ratingRecord.rating : 0;
    }

    const response = {
      anime_id: anime.anime_id,
      title: anime.anime_title,
      thumbnail_url: anime.thumbnail_url,
      banner_img_url: anime.banner_img_url,
      format: anime.format,
      status: anime.is_completed ? "완결" : "방영중",
      release_date: formatReleaseDate(anime.release_date),
      description: anime.description,
      season: formatSeason(anime.season),
      studio: anime.studio,
      genres: translateGenre(
        anime.Genres.map((genre) => genre.genre_name)
      ).slice(0, 3),
      tags: translateTag(anime.Tags.map((tag) => tag.tag_name))
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 4),
      staff: anime.Staffs.map((staff) => ({
        name: translateStaffName(staff.staff_name),
        role: translateStaffRole(staff.AniStaff.role),
      })),
      user_rating: userRating, // 비로그인 사용자는 0, 로그인 사용자는 별점 정보
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

  if (!anime_id || !rating) {
    return res
      .status(400)
      .json({ message: "애니메이션 ID와 별점 정보가 필요합니다." });
  }

  const user_id = req.user.user_id; // user_id로 접근

  if (!user_id) {
    return res.status(400).json({ message: "유효하지 않은 사용자 ID입니다." });
  }

  try {
    let userRating = await UserRatedAnime.findOne({
      where: { user_id, anime_id },
    });

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

    return res.status(200).json({
      message: "별점이 성공적으로 저장되었습니다.",
      rating: userRating,
    });
  } catch (error) {
    console.error("별점을 저장하는 중 오류 발생:", error);
    return res.status(500).json({
      message: "별점을 저장하는 데 실패했습니다.",
      error: error.message,
    });
  }
};

const searchAnimes = async (req, res) => {
  try {
    // 올바른 매개변수 설정
    const query = req.query.query || ""; // 기본 값으로 빈 문자열 설정
    const filters = req.query; // 쿼리 전체를 필터로 전달

    // searchAnimes 호출
    const results = await searchMeiliAnimes(query, filters);
    res.json(results);
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "An error occurred while searching animes" });
  }
};

module.exports = { getAnimeByIds, getAnimeDetails, rateAnime, searchAnimes };

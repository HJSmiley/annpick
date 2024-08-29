const { Anime, Genre, Staff, Tag, UserRatedAnime } = require("../models");
const { formatReleaseDate, formatSeason } = require("../utils/animeFormatting");
const {
  translateStaffName,
  translateStaffRole,
  translateGenre,
  translateTag,
} = require("../utils/animeTranslate");

const getAnimeByIds = async (req, res) => {
  try {
    const animeIds = req.query.ids;
    const userId = req.user ? req.user.user_id : null; // user가 없으면 null로 설정

    if (!animeIds) {
      return res.status(400).json({ error: "No ids provided" });
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
        .json({ error: "No anime found for the provided ids" });
    }

    const response = await Promise.all(
      animeList.map(async (anime) => {
        let userRating = null;
        if (userId) {
          // 인증된 사용자만 별점을 조회
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
          user_rating: userRating, // 비로그인 사용자는 null, 로그인 사용자는 별점 정보
        };
      })
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching anime list:", error);
    res.status(500).json({ error: "Failed to fetch anime list" });
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
      return res.status(404).json({ error: "애니메이션을 찾을 수 없습니다." });
    }

    // 사용자의 별점 가져오기
    const userRating = await UserRatedAnime.findOne({
      where: { user_id: userId, anime_id: anime.anime_id },
      attributes: ["rating"],
    });

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
        anime.Genres.map((genres) => genres.genre_name)
      ).slice(0, 3),
      tags: translateTag(anime.Tags.map((tag) => tag.tag_name))
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 4),
      staff: anime.Staffs.map((staff) => ({
        name: translateStaffName(staff.staff_name),
        role: translateStaffRole(staff.AniStaff.role),
      })),
      user_rating: userRating ? userRating.rating : null, // 사용자의 별점
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
      .json({ message: "Anime ID and rating are required." });
  }

  const user_id = req.user.user_id; // user_id로 접근

  if (!user_id) {
    return res.status(400).json({ message: "Invalid user ID." });
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

    return res
      .status(200)
      .json({ message: "Rating saved successfully", rating: userRating });
  } catch (error) {
    console.error("Error saving rating:", error);
    return res
      .status(500)
      .json({ message: "Failed to save rating", error: error.message });
  }
};

module.exports = { getAnimeByIds, getAnimeDetails, rateAnime };

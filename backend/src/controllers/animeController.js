const { Anime, Genre, Staff, Tag } = require("../models");
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

    if (!animeIds) {
      return res.status(400).json({ error: "No ids provided" });
    }

    const idArray = animeIds
      .split(",")
      .map((animeId) => parseInt(animeId.trim(), 10));

    // ID 리스트에 해당하는 애니메이션 데이터를 가져옴
    const animeList = await Anime.findAll({
      where: { anime_id: idArray },
      include: [
        {
          model: Genre,
          through: { attributes: [] },
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
      ],
    });

    if (animeList.length === 0) {
      return res
        .status(404)
        .json({ error: "No anime found for the provided ids" });
    }

    const response = animeList.map((anime) => {
      return {
        anime_id: anime.anime_id,
        thumbnail_url: anime.thumbnail_url,
        title: anime.anime_title,
        format: anime.format,
        status: anime.is_completed ? "완결" : "방영중",
        genres: translateGenre(
          anime.Genres.map((genres) => genres.genre_name)
        ).slice(0, 3),
        tags: translateTag(anime.Tags.map((tag) => tag.tag_name))
          .sort((a, b) => b.rank - a.rank)
          .slice(0, 4),
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching anime list:", error);
    res.status(500).json({ error: "Failed to fetch anime list" });
  }
};

const getAnimeDetails = async (req, res) => {
  try {
    const animeId = req.params.id;

    // ID로 애니메이션 상세 정보 검색
    const anime = await Anime.findOne({
      where: { anime_id: animeId },
      include: [
        {
          model: Genre,
          through: { attributes: [] },
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
        {
          model: Staff,
          through: { attributes: ["role"] },
        },
      ],
    });

    if (!anime) {
      return res.status(404).json({ error: "애니메이션을 찾을 수 없습니다." });
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
        anime.Genres.map((genres) => genres.genre_name)
      ).slice(0, 3),
      tags: translateTag(anime.Tags.map((tag) => tag.tag_name))
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 4),
      staff: anime.Staffs.map((staff) => ({
        name: translateStaffName(staff.staff_name),
        role: translateStaffRole(staff.AniStaff.role),
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("애니메이션 상세 정보를 가져오는 중 오류 발생:", error);
    res
      .status(500)
      .json({ error: "애니메이션 상세 정보를 가져오는 데 실패했습니다." });
  }
};

module.exports = { getAnimeByIds, getAnimeDetails };

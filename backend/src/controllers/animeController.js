const {
  Anime,
  Genre,
  Staff,
  Tag,
  AniTag,
  UserRatedAnime,
} = require("../models");
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

    // Anime 정보와 관련된 필드만 먼저 로드
    const animeList = await Anime.findAll({
      where: { anime_id: idArray },
      attributes: [
        "anime_id",
        "anime_title",
        "thumbnail_url",
        "format",
        "is_completed",
      ], // 필요한 필드만 가져오기
    });

    if (animeList.length === 0) {
      return res
        .status(404)
        .json({ error: "해당하는 ID의 애니메이션을 찾을 수 없습니다." });
    }

    // 쿼리 분할: 필요한 데이터만 나누어 가져옴
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

    // 병렬로 데이터를 가져오는 방식
    const [genresArray, aniTagsArray] = await Promise.all([
      Promise.all(genrePromises),
      Promise.all(aniTagPromises),
    ]);

    // 필요한 데이터 결합
    const response = animeList.map((anime, index) => {
      const genres = genresArray[index]
        .map((genre) => genre.genre_name)
        .sort((a, b) => a.localeCompare(b, "ko-KR"))
        .slice(0, 3); // 상위 3개 장르만 반환

      const topTags = aniTagsArray[index]
        .sort((a, b) => b.tag_score - a.tag_score)
        .slice(0, 4)
        .map((aniTag) => aniTag.Tag.tag_name); // 상위 4개의 태그만 반환

      return {
        anime_id: anime.anime_id,
        thumbnail_url: anime.thumbnail_url,
        title: anime.anime_title,
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
          through: { attributes: ["role"] }, // AniStaff의 role을 가져옴
        },
      ],
      attributes: [
        "anime_id",
        "anime_title",
        "thumbnail_url",
        "banner_img_url",
        "format",
        "is_completed",
        "release_date",
        "description",
        "season",
        "studio",
      ], // 필요한 필드만 가져오기
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
          attributes: ["rating"],
        })
      : null;

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
      genres: anime.Genres.map((genre) => genre.genre_name).slice(0, 3),
      tags: topTags,
      staff: translatedStaff,
      user_rating: userRating ? userRating.rating : 0,
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

  if (!anime_id || rating === undefined) {
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

    if (rating === 0) {
      // rating이 0이면 기록을 삭제
      if (userRating) {
        await userRating.destroy();
        return res.status(200);
      }
    } else {
      // 별점이 이미 존재하면 업데이트, 존재하지 않으면 새로 생성
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

    return res.status(200);
  } catch (error) {
    console.error("별점을 저장하는 중 오류 발생:", error);
    return res.status(500).json({
      message: "별점을 저장하는 데 실패했습니다.",
      error: error.message,
    });
  }
};

const getRatedAnimes = async (req, res) => {
  const { user_id } = req.user; // 인증된 사용자의 ID를 가져옵니다.
  const { page = 1, rating = null } = req.query; // 평점과 페이지 정보를 쿼리에서 가져옴.
  const limit = 20; // 한 페이지당 가져올 애니메이션 수.

  try {
    const whereClause = { user_id }; // 사용자 필터
    if (rating) {
      whereClause.rating = rating; // 평점 필터 적용
    }

    // UserRatedAnime 모델에서 사용자 ID와 평점을 기준으로 애니메이션을 조회
    const ratedAnimes = await UserRatedAnime.findAll({
      where: whereClause,
      include: [
        {
          model: Anime, // 애니메이션 정보를 포함시킴
          attributes: ["anime_id", "anime_title", "thumbnail_url", "format"],
        },
      ],
      limit,
      offset: (page - 1) * limit,
    });

    // 데이터가 없으면 빈 배열 반환하여 404 방지
    if (!ratedAnimes || ratedAnimes.length === 0) {
      return res.status(200).json([]); // 빈 배열을 반환해 더 이상의 데이터가 없음을 알림
    }

    // 응답으로 보낼 데이터를 구성
    const response = ratedAnimes.map((entry) => ({
      anime_id: entry.Anime.anime_id,
      title: entry.Anime.anime_title,
      thumbnail_url: entry.Anime.thumbnail_url,
      format: entry.Anime.format,
      rating: entry.rating, // 평점 정보를 포함
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
    const query = req.query.query || ""; // 검색어
    const genre = req.query.genre ? req.query.genre.split(",") : []; // 장르 필터 배열로 처리
    const tag = req.query.tag ? req.query.tag.split(",") : []; // 태그 필터 배열로 처리

    const filters = {};
    if (genre.length > 0) filters.genre = genre;
    if (tag.length > 0) filters.tag = tag;

    // MeiliSearch에서 검색된 애니메이션 ID 리스트를 가져옴
    const meiliResults = await searchMeiliAnimes(query, filters);
    const animeIds = meiliResults.map((anime) => anime.id); // ID만 추출

    if (animeIds.length === 0) {
      return res.status(404).json({ message: "검색 결과가 없습니다." });
    }

    // 우리 DB에서 해당 애니메이션 ID에 대한 정보를 가져옴
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
        {
          model: Genre,
          attributes: ["genre_name"],
        },
        {
          model: AniTag,
          attributes: ["tag_score"],
          include: {
            model: Tag,
            attributes: ["tag_name"],
          },
        },
      ],
    });

    // 필요한 데이터만 정리해서 반환
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

module.exports = {
  getAnimeByIds,
  getAnimeDetails,
  rateAnime,
  getRatedAnimes,
  searchAnimes,
};

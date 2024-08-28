const {
  Anime,
  Genre,
  Staff,
  Tag,
  AniTag,
  AniGenre,
  AniStaff,
} = require("../models");
const { fetchAnimeData } = require("../services/animeService");
const { translateGenre } = require("../utils/genreTranslation");
const { translateTag } = require("../utils/tagTranslation");

const saveAnimeData = async () => {
  try {
    const animeData = await fetchAnimeData();

    for (const anime of animeData) {
      // "TV", "Movie", "ONA", "OVA" 형식이 아닌 경우 건너뜀
      if (!["TV", "MOVIE", "ONA", "OVA"].includes(anime.format)) {
        console.log(
          `Skipping anime with unsupported format: ${anime.title.native}, Format: ${anime.format}`
        );
        continue; // 다음 루프 반복
      }

      // 중복 확인: 동일한 제목의 애니메이션이 이미 존재하는지 체크
      const existingAnime = await Anime.findOne({
        where: { anime_title: anime.title.native },
      });

      if (!existingAnime) {
        // 애니메이션 정보 저장
        const savedAnime = await Anime.create({
          anime_title: anime.title.native || "Unknown Title",
          thumbnail_url: anime.coverImage.extraLarge || null,
          banner_img_url: anime.bannerImage || null,
          format: anime.format || null,
          is_completed: anime.status === "FINISHED",
          release_date: anime.startDate.year
            ? new Date(
                anime.startDate.year,
                anime.startDate.month - 1,
                anime.startDate.day
              )
            : null,
          description: anime.description || null,
          season: anime.seasonInt || null,
          studio:
            anime.studios.nodes.length > 0
              ? anime.studios.nodes.map((studio) => studio.name).join(", ")
              : null,
        });

        // 장르 저장
        if (anime.genres && anime.genres.length > 0) {
          for (const genreName of anime.genres) {
            const [genre] = await Genre.findOrCreate({
              where: { genre_name: genreName },
            });
            console.log("Adding genre to anime:", genreName); // 추가된 장르 로그 확인
            await AniGenre.create({
              anime_id: savedAnime.anime_id,
              genre_id: genre.genre_id,
            });
          }
        }

        // 태그 저장
        if (anime.tags && anime.tags.length > 0) {
          for (const tag of anime.tags) {
            const [tagRecord] = await Tag.findOrCreate({
              where: { tag_name: tag.name },
            });

            // AniTag 테이블에 애니메이션과 태그 간의 관계 저장
            await AniTag.create({
              anime_id: savedAnime.anime_id,
              tag_id: tagRecord.tag_id,
              tag_score: tag.rank, // 태그 점수 추가
            });
          }
        }

        // 스태프 저장
        if (anime.staff.edges && anime.staff.edges.length > 0) {
          for (const staffEdge of anime.staff.edges) {
            const role = staffEdge.role.toLowerCase();
            const staffName = staffEdge.node.name.full;

            let finalRole = null;
            if (role === "original creator" || role === "original story") {
              finalRole = "origin";
            } else if (role.includes("director")) {
              finalRole = "director";
            } else if (role === "voice actor" || role === "voiceactor") {
              finalRole = "voiceactor";
            }

            if (finalRole) {
              const [staff] = await Staff.findOrCreate({
                where: { staff_name: staffName },
              });

              // 기존에 같은 anime_id, staff_id, role이 있는지 확인
              const existingEntry = await AniStaff.findOne({
                where: {
                  anime_id: savedAnime.anime_id,
                  staff_id: staff.staff_id,
                  role: finalRole,
                },
              });

              // 기존에 없다면 새로 생성
              if (!existingEntry) {
                await AniStaff.create({
                  anime_id: savedAnime.anime_id,
                  staff_id: staff.staff_id,
                  role: finalRole,
                });
              }
            }
          }
        }
      } else {
        console.log(`Skipping duplicate anime: ${anime.title.native}`);
      }
    }

    console.log("Anime data saved successfully.");
  } catch (error) {
    console.error("Error saving anime data to the database:", error);
    throw error;
  }
};

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

module.exports = { getAnimeByIds, saveAnimeData };

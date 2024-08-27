const Anime = require("../models/Anime"); // Anime 모델 불러오기
const Genre = require("../models/Genre"); // Genre 모델 불러오기
const Staff = require("../models/Staff"); // Staff 모델 불러오기
const Tag = require("../models/Tag"); // Tag 모델 불러오기
const AniTag = require("../models/AniTag"); // AniTag 모델 불러오기
const AnimeStaffs = require("../models/AnimeStaffs"); // AnimeStaffs 모델 불러오기
const { fetchAnimeData } = require("../services/anilistService");
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
          thumbnail_url: anime.coverImage.extraLarge,
          banner_image_url: anime.bannerImage || null,
          format: anime.format || "TV",
          is_completed: anime.status === "FINISHED",
          release_date: anime.startDate.year
            ? new Date(
                anime.startDate.year,
                anime.startDate.month - 1,
                anime.startDate.day
              )
            : null,
          description: anime.description || null,
          season_int: anime.seasonInt || null,
          studio:
            anime.studios.nodes.length > 0 ? anime.studios.nodes[0].name : null,
        });

        // 장르 저장
        if (anime.genres && anime.genres.length > 0) {
          for (const genreName of anime.genres) {
            const [genre] = await Genre.findOrCreate({
              where: { genre_name: genreName },
            });
            console.log("Adding genre to anime:", genreName); // 추가된 장르 로그 확인
            await savedAnime.addGenre(genre); // Anime-Genre 관계 저장
          }
        }

        // 태그 저장
        if (anime.tags && anime.tags.length > 0) {
          for (const tag of anime.tags) {
            const [tagRecord] = await Tag.findOrCreate({
              where: { tag_name: tag.name },
              defaults: { rank: tag.rank },
            });

            // AniTag 테이블에 애니메이션과 태그 간의 관계 저장
            await AniTag.create({
              anime_id: savedAnime.anime_id,
              tag_id: tagRecord.tag_id,
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
              const existingEntry = await AnimeStaffs.findOne({
                where: {
                  anime_id: savedAnime.anime_id,
                  staff_id: staff.staff_id,
                  role: finalRole,
                },
              });

              // 기존에 없다면 새로 생성
              if (!existingEntry) {
                await AnimeStaffs.create({
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

const getAnimeList = async (req, res) => {
  try {
    // 쿼리 파라미터에서 limit 값을 가져오고, 기본값을 10으로 설정
    const limit = parseInt(req.query.limit, 10) || 10;

    const animeList = await Anime.findAll({
      limit, // 가져올 개수 지정
      include: [
        {
          model: Genre,
          through: { attributes: [] }, // 중간 테이블 데이터는 불러오지 않음
        },
        {
          model: Tag,
          through: { attributes: [] }, // 중간 테이블 데이터는 불러오지 않음
        },
      ],
    });

    const response = animeList.map((anime) => {
      const tags = anime.Tags.sort((a, b) => b.rank - a.rank).slice(0, 4); // rank 순으로 정렬 후 4개만 추출

      return {
        anime_id: anime.anime_id,
        thumbnail_url: anime.thumbnail_url,
        title: anime.anime_title,
        format: anime.format,
        status: anime.is_completed ? "완결" : "방영중",
        genres: translateGenre(anime.Genres.map((genre) => genre.genre_name)),
        tags: translateTag(tags.map((tag) => tag.tag_name)), // 태그 번역 로직 적용
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching anime list:", error);
    res.status(500).json({ error: "Failed to fetch anime list" });
  }
};

module.exports = { getAnimeList, saveAnimeData };

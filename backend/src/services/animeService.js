const axios = require("axios");

const {
  Anime,
  Genre,
  Staff,
  Tag,
  AniTag,
  AniGenre,
  AniStaff,
} = require("../models");

const fetchAnimeData = async () => {
  const query = `
    query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $endDate: FuzzyDateInt) {
      Page(page: $page, perPage: $perPage) {
        media(search:"one piece", startDate_greater: $startDate, startDate_lesser: $endDate, type: ANIME, countryOfOrigin: "JP") {
          id
          title {
            native
          }
          description(asHtml: false)
          startDate {
            year
            month
            day
          }
          seasonInt
          coverImage {
            extraLarge
          }
          bannerImage
          genres
          format
          status
          tags {
            name
            rank
          }
          staff {
            edges {
              node {
                name {
                  full
                }
              }
              role
            }
          }
          studios {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  const variables = {
    page: 1,
    perPage: 100,
    startDate: 19940101,
    endDate: 20240930,
  };

  try {
    const response = await axios.post("https://graphql.anilist.co", {
      query,
      variables,
    });
    console.log("Anilist API response:", response.data); // API 응답 확인
    return response.data.data.Page.media;
  } catch (error) {
    console.error("Error fetching data from Anilist API:", error); // API 오류 로그
    throw error;
  }
};

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
            } else if (role === "director") {
              finalRole = "director";
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

module.exports = { fetchAnimeData, saveAnimeData };

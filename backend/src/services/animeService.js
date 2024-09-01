const axios = require("axios");

const {
  Anime,
  Genre,
  Staff,
  Tag,
  AniTag,
  AniGenre,
  AniStaff,
  UserRatedAnime,
  AnilistAnime,
} = require("../models");
const { animeIndex } = require("../config/meiliConfig");

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
          popularity
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
      if (!["TV", "MOVIE", "ONA", "OVA"].includes(anime.format)) {
        console.log(
          `Skipping anime with unsupported format: ${anime.title.native}, Format: ${anime.format}`
        );
        continue;
      }

      const existingAnime = await Anime.findOne({
        where: { anime_title: anime.title.native },
      });

      let savedAnime; // savedAnime 변수를 블록 외부에서 정의

      if (!existingAnime) {
        savedAnime = await Anime.create({
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
        savedAnime = existingAnime; // 중복된 애니메이션의 경우 기존 애니메이션을 사용
      }
      if (savedAnime) {
        // savedAnime이 정의된 경우에만 실행
        const [anilistEntry, created] = await AnilistAnime.findOrCreate({
          where: { anime_id: savedAnime.anime_id },
          defaults: {
            anilist_id: anime.id,
            popularity: anime.popularity,
            anime_id: savedAnime.anime_id,
          },
        });

        if (!created) {
          anilistEntry.popularity = anime.popularity;
          await anilistEntry.save();
        }
      }
    }

    console.log("Anime data saved successfully.");
  } catch (error) {
    console.error("Error saving anime data to the database:", error);
    throw error;
  }
};

const saveRating = async (user_id, anime_id, rating) => {
  try {
    let userRating = await UserRatedAnime.findOne({
      where: { user_id, anime_id },
    });

    if (userRating) {
      // 이미 평가한 기록이 있으면 업데이트
      userRating.rating = rating;
      await userRating.save();
    } else {
      // 평가한 기록이 없으면 새로 생성
      userRating = await UserRatedAnime.create({
        user_id,
        anime_id,
        rating,
      });
    }

    return userRating;
  } catch (error) {
    throw new Error("Error saving rating: " + error.message);
  }
};

// 데이터베이스에서 데이터를 가져와 MeiliSearch에 인덱싱하는 함수
const indexAnimeData = async () => {
  try {
    const animes = await Anime.findAll({
      include: [
        {
          model: Genre,
          through: { model: AniGenre },
        },
        {
          model: Tag,
          through: { model: AniTag },
        },
        {
          model: Staff,
          through: { model: AniStaff },
        },
      ],
    });

    const formattedAnimes = animes.map((anime) => ({
      id: anime.anime_id,
      title: anime.anime_title,
      popularity: anime.popularity,
      genres: anime.genres ? anime.genres.map((genre) => genre.genre_name) : [],
      tags: anime.tags ? anime.tags.map((tag) => tag.tag_name) : [],
      staff: anime.staff ? anime.staff.map((staff) => staff.staff_name) : [],
    }));

    await animeIndex.addDocuments(formattedAnimes);
    console.log("Anime data indexed successfully");
  } catch (error) {
    console.error("Error indexing anime data:", error);
  }
};

const setSortableAttributes = async () => {
  try {
    await animeIndex.updateSortableAttributes(["popularity"]);
    console.log("Sortable attributes updated successfully.");
  } catch (error) {
    console.error("Error updating sortable attributes:", error);
  }
};

// MeiliSearch에서 애니메이션을 검색하는 함수
const searchMeiliAnimes = async (query, filters = {}) => {
  try {
    console.time("searchAnimes");

    // SetSortableAttributes 호출은 한 번만 설정되도록 하는 것이 좋음
    await setSortableAttributes();

    const searchQuery = typeof query === "string" ? query : query.toString();

    const searchResults = await animeIndex.search(searchQuery, {
      filter: buildFilterString(filters),
      sort: ["popularity:desc"],
    });

    console.timeEnd("searchAnimes");
    return searchResults.hits;
  } catch (error) {
    console.error("Error searching animes:", error);
    throw error; // 오류를 라우터로 전달하여 처리를 맡김
  }
};

// 검색 필터 문자열을 구성하는 함수
const buildFilterString = (filters) => {
  const filterStrings = [];
  if (filters.genre) filterStrings.push(`genres = "${filters.genre}"`);
  if (filters.tag) filterStrings.push(`tags = "${filters.tag}"`);
  if (filters.staff) filterStrings.push(`staff = "${filters.staff}"`);
  return filterStrings.join(" AND ");
};

module.exports = {
  fetchAnimeData,
  saveAnimeData,
  saveRating,
  indexAnimeData,
  searchMeiliAnimes,
  buildFilterString,
};

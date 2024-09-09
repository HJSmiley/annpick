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

const fetchAnimeData = async (page = 1, retryCount = 0) => {
  const query = `
    query ($page: Int, $perPage: Int, $startDate: FuzzyDateInt, $endDate: FuzzyDateInt) {
      Page(page: $page, perPage: $perPage) {
        media(
          startDate_greater: $startDate, 
          startDate_lesser: $endDate, 
          type: ANIME, 
          countryOfOrigin: "JP", 
          format: TV
        ) {
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
    page,
    perPage: 100, // Anilist API의 최대 값은 50이지만, 지금은 100으로 설정되어 있습니다.
    startDate: 19940101,
    endDate: 20240930,
  };

  try {
    const response = await axios.post("https://graphql.anilist.co", {
      query,
      variables,
    });
    console.log(`Anilist API response for page ${page}:`, response.data); // API 응답 확인
    return response.data.data.Page.media;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter =
        parseInt(error.response.headers["retry-after"], 10) || 60;
      console.warn(
        `Rate limit exceeded. Retrying after ${retryAfter} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));

      if (retryCount < 5) {
        return fetchAnimeData(page, retryCount + 1); // 재시도
      } else {
        throw new Error("Rate limit exceeded. Max retry attempts reached.");
      }
    } else {
      console.error("Error fetching data from Anilist API:", error); // API 오류 로그
      throw error;
    }
  }
};

const saveAnimeData = async (page = 1) => {
  try {
    const animeData = await fetchAnimeData(page);

    for (const anime of animeData) {
      // 여기서 format을 다시 한번 TV로 필터링, 이미 fetchAnimeData에서 필터링 되었지만 안전장치로 추가
      if (anime.format !== "TV") {
        console.log(
          `Skipping non-TV anime: ${anime.title.native}, Format: ${anime.format}`
        );
        continue;
      }

      // 애니메이션이 데이터베이스에 이미 존재하는지 확인
      const existingAnime = await Anime.findOne({
        where: { anime_title: anime.title.native },
      });

      if (existingAnime) {
        console.log(`Skipping duplicate anime: ${anime.title.native}`);
        continue; // 이미 존재하면 다음 항목으로 넘어갑니다.
      }

      // 새 애니메이션 저장
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
          await AniGenre.findOrCreate({
            where: {
              anime_id: savedAnime.anime_id,
              genre_id: genre.genre_id,
            },
          });
        }
      }

      // 태그 저장
      if (anime.tags && anime.tags.length > 0) {
        for (const tag of anime.tags) {
          const [tagRecord] = await Tag.findOrCreate({
            where: { tag_name: tag.name },
          });
          await AniTag.findOrCreate({
            where: {
              anime_id: savedAnime.anime_id,
              tag_id: tagRecord.tag_id,
            },
            defaults: {
              tag_score: tag.rank, // 태그 점수 추가
            },
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

            await AniStaff.upsert({
              anime_id: savedAnime.anime_id,
              staff_id: staff.staff_id,
              role: finalRole,
            });
          }
        }
      }

      // AnilistAnime 저장
      const [anilistEntry, created] = await AnilistAnime.findOrCreate({
        where: { anilist_id: anime.id }, // anilist_id로 검색하도록 수정
        defaults: {
          popularity: anime.popularity,
          anime_id: savedAnime.anime_id,
        },
      });

      if (!created) {
        anilistEntry.popularity = anime.popularity;
        await anilistEntry.save();
      }
    }

    return animeData;
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
const batchSize = 500;

const indexAnimeData = async () => {
  try {
    const totalAnimes = await Anime.count();
    for (let i = 0; i < totalAnimes; i += batchSize) {
      const animes = await Anime.findAll({
        offset: i,
        limit: batchSize,
        include: [
          {
            model: Genre,
            through: { model: AniGenre },
          },
          {
            model: Tag,
            through: { model: AniTag },
          },
        ],
      });

      const formattedAnimes = animes.map((anime) => ({
        id: anime.anime_id,
        title: anime.anime_title,
        popularity: anime.popularity,
        genres: anime.genres
          ? anime.genres.map((genre) => genre.genre_name)
          : [],
        tags: anime.tags ? anime.tags.map((tag) => tag.tag_name) : [],
      }));

      await animeIndex.addDocuments(formattedAnimes);
      console.log(`Batch ${i / batchSize + 1} indexed successfully`);
    }
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
      sort: ["popularity:desc"], // 인기도 순으로 정렬
      matchingStrategy: "all", // 완벽 일치 우선
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

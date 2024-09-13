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

const initializeMeiliSearch = async () => {
  try {
    // 필터 가능한 속성 설정
    await animeIndex.updateFilterableAttributes(["genre", "tag"]);
    console.log("Filterable attributes updated successfully.");

    // 정렬 가능한 속성 설정
    await animeIndex.updateSortableAttributes(["popularity"]);
    console.log("Sortable attributes updated successfully.");
  } catch (error) {
    console.error("Error initializing MeiliSearch attributes:", error);
  }
};

// 검색 필터 문자열을 구성하는 함수
const buildFilterString = (filters) => {
  const filterStrings = [];

  // genre 필터: 배열 내 값이므로 IN 연산자로 처리
  if (filters.genre) {
    if (Array.isArray(filters.genre)) {
      filterStrings.push(
        `genre IN [${filters.genre.map((g) => `"${g}"`).join(", ")}]`
      );
    } else {
      filterStrings.push(`genre IN ["${filters.genre}"]`);
    }
  }

  // tag 필터: 배열 내 값이므로 IN 연산자로 처리
  if (filters.tag) {
    if (Array.isArray(filters.tag)) {
      filterStrings.push(
        `tag IN [${filters.tag.map((t) => `"${t}"`).join(", ")}]`
      );
    } else {
      filterStrings.push(`tag IN ["${filters.tag}"]`);
    }
  }

  // 필터가 있을 경우 "AND"로 필터들을 연결해서 반환
  return filterStrings.length ? filterStrings.join(" AND ") : "";
};

const searchMeiliAnimes = async (query, filters = {}) => {
  try {
    console.time("searchAnimes");

    const searchQuery = typeof query === "string" ? query : query.toString();
    const filterString = buildFilterString(filters); // 필터링 문자열 생성

    const searchResults = await animeIndex.search(searchQuery, {
      filter: filterString,
      sort: ["popularity:desc"], // 인기도순 정렬
      matchingStrategy: "last",
      attributesToRetrieve: ["id", "anime_title"], // ID와 애니메이션 제목 필드를 반환하도록 지정
    });

    console.timeEnd("searchAnimes");
    return searchResults.hits;
  } catch (error) {
    console.error("MeiliSearch 검색 오류:", error);
    throw error;
  }
};

module.exports = {
  fetchAnimeData,
  saveAnimeData,
  saveRating,
  initializeMeiliSearch,
  buildFilterString,
  searchMeiliAnimes,
};

// services/anilistService.js
const axios = require("axios");

const fetchAnimeData = async () => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(seasonYear: 2023, type: ANIME, sort: START_DATE_DESC) {
          id
          title {
            romaji
            english
          }
          description
          startDate {
            year
            month
            day
          }
          season
          coverImage {
            large
          }
          genres
          format
          status
          staff {
            edges {
              node {
                name {
                  full
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    page: 1,
    perPage: 100,
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

module.exports = { fetchAnimeData };

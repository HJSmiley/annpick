const axios = require("axios");

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

module.exports = { fetchAnimeData };

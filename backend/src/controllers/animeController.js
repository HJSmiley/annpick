// controllers/animeController.js
const Anime = require("../models/Anime"); // Anime 모델 불러오기
const Genre = require("../models/Genre"); // Genre 모델 불러오기
const Staff = require("../models/Staff"); // Staff 모델 불러오기
const { fetchAnimeData } = require("../services/anilistService");

const saveAnimeData = async () => {
  try {
    const animeData = await fetchAnimeData();

    for (const anime of animeData) {
      // 애니메이션 정보 저장
      const savedAnime = await Anime.create({
        anime_title:
          anime.title.romaji || anime.title.english || "Unknown Title",
        thumbnail_url: anime.coverImage.large,
        format: anime.format || "TV",
        is_completed: anime.status === "FINISHED",
        release_date: anime.startDate.year
          ? new Date(
              anime.startDate.year,
              anime.startDate.month - 1,
              anime.startDate.day
            )
          : null,
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

      // 스태프 저장
      if (anime.staff.edges && anime.staff.edges.length > 0) {
        for (const staffEdge of anime.staff.edges) {
          const staffName = staffEdge.node.name.full;
          const [staff] = await Staff.findOrCreate({
            where: { staff_name: staffName },
          });
          await savedAnime.addStaff(staff); // Anime-Staff 관계 저장
        }
      }
    }

    console.log("Anime data saved successfully.");
  } catch (error) {
    console.error("Error saving anime data to the database:", error);
    throw error;
  }
};

module.exports = saveAnimeData;

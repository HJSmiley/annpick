const sequelize = require("../src/config/dbConfig"); // DB 연결 설정
const { Genre } = require("../src/models"); // Genre 모델 임포트
const { translateGenre } = require("../src/utils/animeTranslate"); // 번역 로직 임포트

const translateGenresInDb = async () => {
  try {
    // DB 연결 확인
    await sequelize.authenticate();
    console.log("DB connection has been established successfully.");

    // DB에 있는 모든 장르 가져오기
    const genres = await Genre.findAll();

    // 각 장르에 대해 번역을 시도하고 업데이트
    for (const genre of genres) {
      const translatedGenre = translateGenre([genre.genre_name])[0]; // 첫 번째 요소가 번역된 값

      if (translatedGenre && translatedGenre !== genre.genre_name) {
        // 번역된 값이 기존 값과 다를 경우 업데이트
        genre.genre_name = translatedGenre;
        await genre.save(); // 변경 사항 저장
        console.log(`Updated genre: ${genre.genre_name}`);
      }
    }

    console.log("Genre translation and update completed successfully.");
  } catch (error) {
    console.error("Error translating genres:", error);
  } finally {
    // DB 연결 종료
    await sequelize.close();
    console.log("DB connection closed.");
  }
};

translateGenresInDb();

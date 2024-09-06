// 필요한 모듈 임포트
const sequelize = require("../src/config/dbConfig"); // DB 연결 설정
const { Tag } = require("../src/models"); // Tag 모델 임포트
const { translateTag } = require("../src/utils/animeTranslate"); // 번역 로직 임포트

// 태그 번역 및 DB 업데이트 로직
const translateAndSaveTags = async () => {
  try {
    // 모든 태그를 불러옴
    const tags = await Tag.findAll();

    // 태그를 번역하고 DB에 업데이트
    await Promise.all(
      tags.map(async (tag) => {
        const translatedName = translateTag([tag.tag_name])[0]; // 번역된 태그 이름

        // 번역된 이름이 다를 경우에만 업데이트
        if (translatedName !== tag.tag_name) {
          tag.tag_name = translatedName;
          await tag.save();
        }
      })
    );

    console.log("태그 번역 및 업데이트 완료");
  } catch (error) {
    console.error("태그를 번역하고 저장하는 중 오류 발생:", error);
  }
};

// 스크립트 실행 로직
const runScript = async () => {
  try {
    // DB 연결 시작
    await sequelize.authenticate();
    console.log("DB 연결 성공");

    // 태그 번역 및 저장
    await translateAndSaveTags();

    // DB 연결 종료
    await sequelize.close();
    console.log("DB 연결 종료");
  } catch (error) {
    console.error("스크립트 실행 중 오류 발생:", error);
    process.exit(1); // 오류 발생 시 스크립트 종료
  }
};

// 스크립트 실행
runScript();

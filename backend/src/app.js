const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/dbConfig");

// 구조분해 할당으로 모든 모델 가져오기
const {
  User,
  Anime,
  Tag,
  AniTag,
  Preference,
  Review,
  Recommendation,
  UserTag,
} = require("./models");

const app = express();

// Sequelize 데이터베이스 동기화
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("An error occurred while synchronizing the models:", err);
  });

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app; // Express 애플리케이션 인스턴스를 내보냅니다.

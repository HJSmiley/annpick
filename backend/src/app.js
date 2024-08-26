require("./models/associations"); // 모델 간의 관계 설정을 불러옴

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const sequelize = require("./config/dbConfig");
const { swaggerUi, swaggerSpec } = require("./config/swaggerConfig");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");

const { saveAnimeData } = require("./controllers/animeController");

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
app.use(
  cors({
    origin: "http://172.28.224.1:3000", // 프론트엔드의 로컬 주소
    credentials: true, // 쿠키와 인증 정보를 포함할 수 있도록 설정
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우트 설정
app.use("/", authRoutes);
app.use("/", profileRoutes);
// Anilist API 데이터를 가져와 MySQL RDS에 저장하는 라우트
app.get("/fetch-anime", async (req, res) => {
  console.log("Fetching anime data...");
  try {
    await saveAnimeData();
    res.status(200).send("Anime data has been fetched and saved.");
  } catch (error) {
    console.error("Error fetching or saving anime data:", error); // 오류 로그 확인
    res.status(500).send("Failed to fetch or save anime data.");
  }
});

module.exports = app;

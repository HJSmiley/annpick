require("./models/associations"); // 모델 간의 관계 설정을 불러옴

const {
  express,
  cors,
  bodyParser,
  passport,
  sequelize,
  swaggerUi,
  swaggerSpec,
  authRoutes,
  saveAnimeData,
} = require("./config/appConfig");

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
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우트 설정
app.use("/", authRoutes);

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

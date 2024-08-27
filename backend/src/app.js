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
  animeRoutes,
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
app.use("/api/v1", authRoutes);
app.use("/api/v1", animeRoutes);

/*
// 스케줄러 설정 (예: 매일 자정에 실행)
const schedule = require("node-schedule");

schedule.scheduleJob("0 0 * * *", async () => {
  try {
    console.log("Fetching anime data...");
    await saveAnimeData();
    console.log("Anime data has been fetched and saved.");
  } catch (error) {
    console.error("Error fetching or saving anime data:", error);
  }
});
*/

module.exports = app;

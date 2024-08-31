require("./models/associations");

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
  meiliClient,
  animeIndex,
} = require("./config/appConfig");

const app = express();

// Sequelize 데이터베이스 동기화
sequelize
  .sync({ force: true })
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
app.use("/api/v1/anime", animeRoutes);

// MeiliSearch 클라이언트를 전역적으로 사용하기 위해 앱 객체에 추가
app.set("meiliClient", meiliClient);
app.set("animeIndex", animeIndex);

module.exports = app;

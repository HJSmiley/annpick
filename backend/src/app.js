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
  .sync({ force: false })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("An error occurred while synchronizing the models:", err);
  });

// 미들웨어 설정
const allowedOrigins = [
  process.env.FRONTEND_URL, // .env 파일에 설정된 배포 URL
  "http://team03-test2.s3-website.ap-northeast-2.amazonaws.com/", // 만약 .env 파일을 통해 설정되지 않는 추가 URL이 있다면 여기 추가
  "http://127.0.0.1:3000", // 개발 환경에서의 로컬 URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 허용된 목록에 있거나, origin이 없는 경우 (비어 있는 경우)
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

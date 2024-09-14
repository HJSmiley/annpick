require("dotenv").config();
require("./models/associations");

const { initializeMeiliSearch } = require("./services/animeService");

const {
  express,
  cors,
  bodyParser,
  cookieParser,
  passport,
  sequelize,
  swaggerUi,
  swaggerSpec,
  authRoutes,
  animeRoutes,
  recommendRoutes,
  userRoutes,
  pickRoutes,
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
  process.env.FRONTEND_URL, // 배포된 프론트엔드 URL
  "http://localhost:3000", // 개발 환경 URL
  "http://127.0.0.1:3000", // 로컬 개발 환경 URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // origin이 허용된 목록에 있거나, origin이 없는 경우 (비어 있는 경우)
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        console.error("CORS Error: Not allowed by CORS, Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// CORS 프리플라이트 요청 처리
app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/v1", authRoutes);
app.use("/api/v1/anime", animeRoutes);
app.use("/api/v1", recommendRoutes);
app.use("/api/v1/profile", userRoutes);
app.use("/api/v1", pickRoutes);

// MeiliSearch 클라이언트를 전역적으로 사용하기 위해 앱 객체에 추가
app.set("meiliClient", meiliClient);
app.set("animeIndex", animeIndex);

// 서버 시작 시 MeiliSearch 초기화 실행
initializeMeiliSearch().then(() => {
  console.log(
    "MeiliSearch initialized with filterable and sortable attributes."
  );
});

module.exports = app;

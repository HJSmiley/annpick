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
  process.env.FRONTEND_URL, // 배포된 프론트엔드 URL
  "http://localhost:3000", // 개발 환경 URL
  "http://127.0.0.1:3000", // 로컬 개발 환경 URL
  "https://annpick.link",
  "https://d2rj4857nnqxpf.cloudfront.net", // CloudFront 배포 도메인 (정확한 CloudFront 도메인을 추가)
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin attempting to access:", origin); // 요청의 출처 로그 출력

      // origin이 허용된 목록에 있거나, origin이 없는 경우 (서버에서 직접 호출)
      if (allowedOrigins.includes(origin) || !origin) {
        console.log("Origin allowed:", origin); // 허용된 경우
        callback(null, true);
      } else {
        console.error("CORS Error: Not allowed by CORS, Origin:", origin); // 차단된 경우 로그 출력
        callback(new Error("Not allowed by CORS")); // 허용되지 않은 경우 에러 발생
      }
    },
    credentials: true, // 인증 정보 허용 (쿠키 등)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용할 메소드
    allowedHeaders: ["Authorization", "Content-Type"], // 허용할 헤더
  })
);

// CORS 프리플라이트 요청 처리
app.options("*", cors()); // 모든 경로에 대해 OPTIONS 요청 허용

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/v1", authRoutes);
app.use("/api/v1/anime", animeRoutes);

// MeiliSearch 클라이언트를 전역적으로 사용하기 위해 앱 객체에 추가
app.set("meiliClient", meiliClient);
app.set("animeIndex", animeIndex);

module.exports = app;

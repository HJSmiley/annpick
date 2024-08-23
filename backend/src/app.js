const { express, cors, bodyParser, passport } = require("./config/appConfig");
const sequelize = require("./config/dbConfig");
const { swaggerUi, swaggerSpec } = require("./config/swaggerConfig");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");

const app = express();

// 템플릿 엔진 설정
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우트 설정
app.use("/", authRoutes);
app.use("/", profileRoutes);

module.exports = app;

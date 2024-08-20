const { express, cors, bodyParser, passport } = require("./config/appConfig");
const sequelize = require("./config/dbConfig");
const indexRoutes = require("./routes/index");

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

// CORS 미들웨어 설정
app.use(cors());

// Body Parser 미들웨어 설정
app.use(bodyParser.json()); // JSON 요청 파싱
app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 요청 파싱

// Passport 초기화
app.use(passport.initialize());

app.use("/", indexRoutes);

module.exports = app;

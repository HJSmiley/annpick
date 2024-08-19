const sequelize = require("./config/dbConfig");
const User = require("./models/User");

sequelize
  .sync({ force: true }) // force: true는 기존 테이블을 삭제하고 다시 생성
  .then(() => {
    console.log("All tables created successfully!");
  })
  .catch((err) => {
    console.error("Error creating tables:", err);
  })
  .finally(() => {
    sequelize.close(); // 연결 종료
  });

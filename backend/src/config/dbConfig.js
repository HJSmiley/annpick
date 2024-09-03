require("dotenv").config();
require("dotenv").config();
const { Sequelize } = require("sequelize");

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_NAME, // 데이터베이스 이름
  process.env.DB_USER, // 사용자 이름
  process.env.DB_PASS, // 비밀번호
  {
    host: process.env.DB_HOST, // RDS 엔드포인트
    port: process.env.DB_PORT, // 포트 번호
    dialect: "mysql",
    // logging: console.log, // SQL 쿼리 로깅 활성화
    logging: false, // 이 옵션을 추가하여 로그를 비활성화
  }
);

module.exports = sequelize;

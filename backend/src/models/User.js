const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      comment: "SNS 이메일",
    },
    nickname: {
      type: DataTypes.STRING(20),
    },
    user_name: {
      type: DataTypes.STRING(20),
    },
    phone: {
      type: DataTypes.STRING(20),
      comment: "국제 형식으로 저장(예: +82-10-1234-5678)",
    },
    birth: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.CHAR(1),
      comment: "남성: M, 여성: F",
    },
    nationality: {
      type: DataTypes.CHAR(1),
      comment: "내국인: D (Domestic), 외국인: F (Foreign)",
    },
    user_status: {
      type: DataTypes.CHAR(1),
      comment: "A(ctivated), H(ibernated), D(eleted)",
    },
    user_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "User",
    timestamps: false,
  }
);

module.exports = User;

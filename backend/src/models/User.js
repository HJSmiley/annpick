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
      allowNull: false,
    },
    profile_img: {
      type: DataTypes.STRING(255),
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
    naver_access_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    naver_refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    timestamps: true,
  }
);

module.exports = User;

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class AnimeStaffs extends Model {}

AnimeStaffs.init(
  {
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Anime", // 참조할 모델 이름
        key: "anime_id",
      },
      allowNull: false,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Staff", // 참조할 모델 이름
        key: "staff_id",
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(100), // 역할을 저장할 필드
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AnimeStaffs",
    tableName: "AnimeStaffs",
    timestamps: false,
  }
);

module.exports = AnimeStaffs;

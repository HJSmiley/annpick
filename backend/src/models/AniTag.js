const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime"); // Anime 모델 불러오기
const Tag = require("./Tag"); // Tag 모델 불러오기

class AniTag extends Model {}

AniTag.init(
  {
    anitag_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Anime,
        key: "anime_id",
      },
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag,
        key: "tag_id",
      },
      allowNull: false,
    },
    tag_score: {
      type: DataTypes.INTEGER,
      comment: "각 태그와 애니메이션 간의 연관성(백분율)",
    },
  },
  {
    sequelize,
    modelName: "AniTag",
    tableName: "AniTag",
    timestamps: true,
  }
);

module.exports = AniTag;

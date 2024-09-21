const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime");
const Genre = require("./Genre");
const Tag = require("./Tag");

const RecommendationCluster = sequelize.define(
  "RecommendationCluster",
  {
    recommendation_id: {
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
    genre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Genre, // Genre 테이블을 참조
        key: "genre_id",
      },
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag, // Tag 테이블을 참조
        key: "tag_id",
      },
      allowNull: false,
    },
    recommendation_phrase: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "추천 문구 (예: 우주에서 피어나는 사랑)",
    },
  },
  {
    sequelize,
    modelName: "RecommendationCluster",
    tableName: "RecommendationCluster",
    timestamps: true,
  }
);

module.exports = RecommendationCluster;

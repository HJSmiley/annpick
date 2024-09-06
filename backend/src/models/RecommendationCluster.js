const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime");

const RecommendationCluster = sequelize.define(
  "RecommendationCluster",
  {
    cluster_id: {
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
    cluster_group: {
      type: DataTypes.INTEGER,
      comment: "군집화된 그룹 번호",
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

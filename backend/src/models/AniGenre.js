const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime");
const Genre = require("./Genre");

// Anime-Genre 중간 테이블 정의
const AniGenre = sequelize.define(
  "AniGenre",
  {
    anigenre_id: {
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
    },
    genre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Genre,
        key: "genre_id",
      },
    },
  },
  {
    sequelize,
    modelName: "AniGenre",
    tableName: "AniGenre",
    timestamps: true,
  }
);

module.exports = AniGenre;

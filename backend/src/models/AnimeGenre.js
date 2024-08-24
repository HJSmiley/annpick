// models/AnimeGenre.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime");
const Genre = require("./Genre");

// Anime-Genre 중간 테이블 정의
const AnimeGenre = sequelize.define(
  "AnimeGenre",
  {
    id: {
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
    tableName: "AnimeGenres",
    timestamps: false,
  }
);

Anime.belongsToMany(Genre, { through: AnimeGenre, foreignKey: "anime_id" });
Genre.belongsToMany(Anime, { through: AnimeGenre, foreignKey: "genre_id" });

module.exports = AnimeGenre;

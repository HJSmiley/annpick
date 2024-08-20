const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Anime = sequelize.define(
  "Anime",
  {
    anime_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    anime_title: {
      type: DataTypes.STRING(100),
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      comment: "썸네일 이미지 저장한 경로",
    },
    genre: {
      type: DataTypes.STRING(20),
    },
    format: {
      type: DataTypes.ENUM("TV", "ONA", "OVA", "Movie"),
      comment: "TV, ONA, OVA, Movie",
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      comment: "true: 완결, false: 방영중",
    },
    staff: {
      type: DataTypes.STRING(50),
    },
    release_date: {
      type: DataTypes.DATE,
    },
    anime_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Anime",
    timestamps: false,
  }
);

module.exports = Anime;

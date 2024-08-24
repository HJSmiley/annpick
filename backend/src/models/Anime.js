// models/Anime.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Anime extends Model {}

Anime.init(
  {
    anime_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    anime_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
    },
    format: {
      type: DataTypes.ENUM("TV", "ONA", "OVA", "Movie"),
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
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
    sequelize,
    modelName: "Anime",
    tableName: "Anime",
    timestamps: false,
  }
);

module.exports = Anime;

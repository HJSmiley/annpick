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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    anime_title_ko: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
    },
    banner_img_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    format: {
      type: DataTypes.ENUM("TV", "ONA", "OVA", "MOVIE"),
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
    },
    release_date: {
      type: DataTypes.DATE,
    },
    description: {
      type: DataTypes.TEXT,
    },
    description_ko: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    season: {
      type: DataTypes.INTEGER,
    },
    studio: {
      type: DataTypes.STRING(100),
    },
  },
  {
    sequelize,
    modelName: "Anime",
    tableName: "Anime",
    timestamps: true,
  }
);

module.exports = Anime;

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
    banner_image_url: {
      // 새로운 필드
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
      // 새로운 필드
      type: DataTypes.TEXT,
      allowNull: true,
    },
    season_int: {
      // 새로운 필드
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    studio: {
      // 새로운 필드
      type: DataTypes.STRING(100),
      allowNull: true,
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

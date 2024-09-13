const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

const AnilistAnime = sequelize.define(
  "AniListAnime",
  {
    anilist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    popularity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    anime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Anime",
        key: "anime_id",
      },
    },
  },
  {
    sequelize,
    modelName: "AnilistAnime",
    tableName: "AnilistAnime",
    timestamps: true,
  }
);

module.exports = AnilistAnime;

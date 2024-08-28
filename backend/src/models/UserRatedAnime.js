const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const Anime = require("./Anime");

const UserRatedAnime = sequelize.define(
  "UserRatedAnime",
  {
    pref_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      allowNull: false,
    },
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Anime,
        key: "anime_id",
      },
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      comment: "5점 만점, 0.5점 간격으로 평가",
    },
  },
  {
    sequelize,
    modelName: "UserRatedAnime",
    tableName: "UserRatedAnime",
    timestamps: true,
  }
);

module.exports = UserRatedAnime;

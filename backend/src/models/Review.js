const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const Anime = require("./Anime");

const Review = sequelize.define(
  "Review",
  {
    review_id: {
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
    },
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Anime,
        key: "anime_id",
      },
    },
    review_content: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "Review",
    timestamps: true,
  }
);

User.hasMany(Review, { foreignKey: "user_id" });
Anime.hasMany(Review, { foreignKey: "anime_id" });

module.exports = Review;

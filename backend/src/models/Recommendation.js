const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const Anime = require("./Anime");

const Recommendation = sequelize.define(
  "Recommendation",
  {
    rec_id: {
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
    similarity: {
      type: DataTypes.FLOAT,
      comment: "추천 로직으로 도출된 유사도",
    },
    rec_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Recommendation",
    timestamps: false,
  }
);

User.belongsToMany(Anime, { through: Recommendation, foreignKey: "user_id" });
Anime.belongsToMany(User, { through: Recommendation, foreignKey: "anime_id" });

module.exports = Recommendation;

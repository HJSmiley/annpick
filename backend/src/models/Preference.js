const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const Anime = require("./Anime");

const Preference = sequelize.define(
  "Preference",
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
    },
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Anime,
        key: "anime_id",
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      comment: "5점 만점, 0.5점 간격으로 평가",
    },
    is_liked: {
      type: DataTypes.BOOLEAN,
      comment: "사용자가 별점 3점 이상으로 평가하면 true",
    },
    pref_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    pref_updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "Preference",
    timestamps: false,
  }
);

User.belongsToMany(Anime, { through: Preference, foreignKey: "user_id" });
Anime.belongsToMany(User, { through: Preference, foreignKey: "anime_id" });

module.exports = Preference;

// models/AnimeStaff.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime");
const Staff = require("./Staff");

// Anime-Staff 중간 테이블 정의
const AnimeStaff = sequelize.define(
  "AnimeStaff",
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
    staff_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Staff,
        key: "staff_id",
      },
    },
  },
  {
    tableName: "AnimeStaffs",
    timestamps: false,
  }
);

Anime.belongsToMany(Staff, { through: AnimeStaff, foreignKey: "anime_id" });
Staff.belongsToMany(Anime, { through: AnimeStaff, foreignKey: "staff_id" });

module.exports = AnimeStaff;

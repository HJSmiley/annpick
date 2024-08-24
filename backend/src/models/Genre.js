// models/Genre.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Genre extends Model {}

Genre.init(
  {
    genre_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    genre_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Genre",
    tableName: "Genres",
    timestamps: false,
  }
);

module.exports = Genre;

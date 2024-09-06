// models/Staff.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Staff extends Model {}

Staff.init(
  {
    staff_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Staff",
    tableName: "Staff",
    timestamps: true,
  }
);

module.exports = Staff;

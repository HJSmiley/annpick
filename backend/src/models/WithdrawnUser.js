const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const WithdrawnUser = sequelize.define(
  "WithdrawnUser",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    reason: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "WithdrawnUser",
    tableName: "WithdrawnUser",
    timestamps: true,
  }
);

module.exports = WithdrawnUser;

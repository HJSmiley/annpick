const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");

const UserClusterPreference = sequelize.define(
  "UserClusterPreference",
  {
    usercluster_id: {
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
    genre_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preference_score: {
      type: DataTypes.FLOAT,
      comment:
        "사용자가 특정 군집에 대해 얼마나 선호하는지를 정량적으로 나타내는 점수",
    },
    preference_rank: {
      type: DataTypes.CHAR(1),
      comment: "preference_score를 상/중/하로 분류",
    },
  },
  {
    sequelize,
    modelName: "UserClusterPreference",
    tableName: "UserClusterPreference",
    timestamps: true,
  }
);

module.exports = UserClusterPreference;

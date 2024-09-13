const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const RecommendationCluster = require("./RecommendationCluster");

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
    cluster_group: {
      type: DataTypes.INTEGER,
      references: {
        model: RecommendationCluster,
        key: "cluster_group",
      },
      allowNull: false,
    },
    preference_score: {
      type: DataTypes.FLOAT,
      comment:
        "사용자가 특정 군집에 대해 얼마나 선호하는지를 정량적으로 나타내는 점수",
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

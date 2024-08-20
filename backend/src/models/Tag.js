const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Tag = sequelize.define(
  "Tag",
  {
    tag_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING(50),
    },
    rank: {
      type: DataTypes.INTEGER,
      comment: "태그의 중요도(백분율)",
    },
    tag_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Tag",
    timestamps: false,
  }
);

module.exports = Tag;

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Tag extends Model {}

Tag.init(
  {
    tag_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100), // 대분류 필드 추가
      allowNull: false,
      defaultValue: "Uncategorized",
    },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "Tag",
    timestamps: true,
  }
);

module.exports = Tag;

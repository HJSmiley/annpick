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
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "Tag",
    timestamps: true,
  }
);

module.exports = Tag;

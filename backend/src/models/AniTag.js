const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Anime = require("./Anime");
const Tag = require("./Tag");

const AniTag = sequelize.define(
  "AniTag",
  {
    anitag_id: {
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
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag,
        key: "tag_id",
      },
    },
  },
  {
    tableName: "AniTag",
    timestamps: false,
  }
);

Anime.belongsToMany(Tag, { through: AniTag, foreignKey: "anime_id" });
Tag.belongsToMany(Anime, { through: AniTag, foreignKey: "tag_id" });

module.exports = AniTag;

const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class AniTag extends Model {}

AniTag.init(
  {
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Anime", // 참조할 모델 이름
        key: "anime_id",
      },
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Tag", // 참조할 모델 이름
        key: "tag_id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AniTag",
    tableName: "AniTags",
    timestamps: false,
  }
);

module.exports = AniTag;

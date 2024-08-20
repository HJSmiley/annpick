const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./User");
const Tag = require("./Tag");

const UserTag = sequelize.define(
  "UserTag",
  {
    usertag_id: {
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
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag,
        key: "tag_id",
      },
    },
    ratio: {
      type: DataTypes.FLOAT,
      comment: "사용자별 평가한 작품의 전체 태그에서 해당 태그가 차지하는 비율",
    },
    usertag_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "UserTag",
    timestamps: false,
  }
);

User.belongsToMany(Tag, { through: UserTag, foreignKey: "user_id" });
Tag.belongsToMany(User, { through: UserTag, foreignKey: "tag_id" });

module.exports = UserTag;

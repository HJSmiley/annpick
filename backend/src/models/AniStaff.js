const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/dbConfig");

class AniStaff extends Model {}

AniStaff.init(
  {
    anistaff_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    anime_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Anime",
        key: "anime_id",
      },
      allowNull: false,
    },
    staff_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Staff",
        key: "staff_id",
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(10),
      comment: "원작자: origin, 감독: director, 성우: voiceactor",
    },
  },
  {
    sequelize,
    modelName: "AniStaff",
    tableName: "AniStaff",
    timestamps: true,
  }
);

module.exports = AniStaff;

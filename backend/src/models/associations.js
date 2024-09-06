// models/associations.js
const Anime = require("./Anime");
const Genre = require("./Genre");
const Staff = require("./Staff");
const Tag = require("./Tag");
const User = require("./User");
const AniGenre = require("./AniGenre");
const AniStaff = require("./AniStaff");
const AniTag = require("./AniTag");
const RecommendationCluster = require("./RecommendationCluster");
const UserClusterPreference = require("./UserClusterPreference");
const UserRatedAnime = require("./UserRatedAnime");
const AnilistAnime = require("./AnilistAnime");

// User와 RecommendationCluster 간의 다대다 관계 설정
User.belongsToMany(RecommendationCluster, {
  through: UserClusterPreference,
  foreignKey: "user_id",
  otherKey: "cluster_group",
});

RecommendationCluster.belongsToMany(User, {
  through: UserClusterPreference,
  foreignKey: "cluster_group",
  otherKey: "user_id",
});

User.hasMany(UserRatedAnime, { foreignKey: "user_id" });
Anime.hasMany(UserRatedAnime, { foreignKey: "anime_id" });

UserRatedAnime.belongsTo(User, { foreignKey: "user_id" });
UserRatedAnime.belongsTo(Anime, { foreignKey: "anime_id" });

// Anime와 Genre 간의 다대다 관계 설정
Anime.belongsToMany(Genre, { through: AniGenre, foreignKey: "anime_id" });
Genre.belongsToMany(Anime, { through: AniGenre, foreignKey: "genre_id" });

// Anime과 Staff의 다대다 관계 설정
Anime.belongsToMany(Staff, { through: AniStaff, foreignKey: "anime_id" });
Staff.belongsToMany(Anime, { through: AniStaff, foreignKey: "staff_id" });

// Anime과 AniStaff 간의 관계 설정
Anime.hasMany(AniStaff, { foreignKey: "anime_id" });
AniStaff.belongsTo(Anime, { foreignKey: "anime_id" });

Staff.hasMany(AniStaff, { foreignKey: "staff_id" });
AniStaff.belongsTo(Staff, { foreignKey: "staff_id" });

// Anime과 Tag의 다대다 관계 설정
Anime.belongsToMany(Tag, { through: AniTag, foreignKey: "anime_id" });
Tag.belongsToMany(Anime, { through: AniTag, foreignKey: "tag_id" });

// Anime과 AniTag 간의 관계 설정
Anime.hasMany(AniTag, { foreignKey: "anime_id" });
AniTag.belongsTo(Anime, { foreignKey: "anime_id" });

Tag.hasMany(AniTag, { foreignKey: "tag_id" });
AniTag.belongsTo(Tag, { foreignKey: "tag_id" });

// Anime와 RecommendationCluster 간의 1대다 관계 설정
Anime.hasMany(RecommendationCluster, { foreignKey: "anime_id" });
RecommendationCluster.belongsTo(Anime, { foreignKey: "anime_id" });

// Anime과 AniListAnime 간의 1대1 관계 설정
Anime.hasOne(AnilistAnime, { foreignKey: "anime_id" });
AnilistAnime.belongsTo(Anime, { foreignKey: "anime_id" });

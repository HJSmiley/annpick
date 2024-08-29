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

// Anime와 Staff 간의 다대다 관계 설정
Anime.belongsToMany(Staff, {
  through: AniStaff,
  foreignKey: "anime_id",
  otherKey: "staff_id",
});

Staff.belongsToMany(Anime, {
  through: AniStaff,
  foreignKey: "staff_id",
  otherKey: "anime_id",
});

// Anime와 Tag 간의 다대다 관계 설정
Anime.belongsToMany(Tag, {
  through: AniTag,
  foreignKey: "anime_id",
  otherKey: "tag_id",
});

Tag.belongsToMany(Anime, {
  through: AniTag,
  foreignKey: "tag_id",
  otherKey: "anime_id",
});

// Anime와 RecommendationCluster 간의 1대다 관계 설정
Anime.hasMany(RecommendationCluster, { foreignKey: "anime_id" });
RecommendationCluster.belongsTo(Anime, { foreignKey: "anime_id" });

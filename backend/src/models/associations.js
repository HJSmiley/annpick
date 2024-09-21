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

// User와 Anime 간의 다대다 관계 설정 (중간 테이블 UserRatedAnime 사용)
User.belongsToMany(Anime, { through: UserRatedAnime, foreignKey: "user_id" });
Anime.belongsToMany(User, { through: UserRatedAnime, foreignKey: "anime_id" });

User.hasMany(UserRatedAnime, { foreignKey: "user_id" });
UserRatedAnime.belongsTo(User, { foreignKey: "user_id" });

Anime.hasMany(UserRatedAnime, { foreignKey: "anime_id" });
UserRatedAnime.belongsTo(Anime, { foreignKey: "anime_id" });

// Anime와 Genre 간의 다대다 관계 설정 (중간 테이블 AniGenre 사용)
Anime.belongsToMany(Genre, { through: AniGenre, foreignKey: "anime_id" });
Genre.belongsToMany(Anime, { through: AniGenre, foreignKey: "genre_id" });

Anime.hasMany(AniGenre, { foreignKey: "anime_id" });
AniGenre.belongsTo(Anime, { foreignKey: "anime_id" });

Genre.hasMany(AniGenre, { foreignKey: "genre_id" });
AniGenre.belongsTo(Genre, { foreignKey: "genre_id" });

// Anime과 Staff의 다대다 관계 설정 (중간 테이블 AniStaff 사용)
Anime.belongsToMany(Staff, { through: AniStaff, foreignKey: "anime_id" });
Staff.belongsToMany(Anime, { through: AniStaff, foreignKey: "staff_id" });

Anime.hasMany(AniStaff, { foreignKey: "anime_id" });
AniStaff.belongsTo(Anime, { foreignKey: "anime_id" });

Staff.hasMany(AniStaff, { foreignKey: "staff_id" });
AniStaff.belongsTo(Staff, { foreignKey: "staff_id" });

// Anime과 Tag의 다대다 관계 설정 (중간 테이블 AniTag 사용)
Anime.belongsToMany(Tag, { through: AniTag, foreignKey: "anime_id" });
Tag.belongsToMany(Anime, { through: AniTag, foreignKey: "tag_id" });

Anime.hasMany(AniTag, { foreignKey: "anime_id" });
AniTag.belongsTo(Anime, { foreignKey: "anime_id" });

Tag.hasMany(AniTag, { foreignKey: "tag_id" });
AniTag.belongsTo(Tag, { foreignKey: "tag_id" });

// Anime와 RecommendationCluster 간의 1대다 관계 설정
Anime.hasMany(RecommendationCluster, { foreignKey: "anime_id" });
RecommendationCluster.belongsTo(Anime, { foreignKey: "anime_id" });

RecommendationCluster.belongsTo(Genre, { foreignKey: "genre_id" });
RecommendationCluster.belongsTo(Tag, { foreignKey: "tag_id" });

// User와 UserClusterPreference 간의 1대다 관계 설정
User.hasMany(UserClusterPreference, { foreignKey: "user_id" });
UserClusterPreference.belongsTo(User, { foreignKey: "user_id" });

UserClusterPreference.belongsTo(Genre, { foreignKey: "genre_id" });
UserClusterPreference.belongsTo(Tag, { foreignKey: "tag_id" });

// Anime과 AnilistAnime 간의 1대1 관계 설정
Anime.hasOne(AnilistAnime, { foreignKey: "anime_id" });
AnilistAnime.belongsTo(Anime, { foreignKey: "anime_id" });

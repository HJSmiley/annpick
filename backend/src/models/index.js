const User = require("./User");
const WithdrawnUser = require("./WithdrawnUser");
const Anime = require("./Anime");
const Staff = require("./Staff");
const Genre = require("./Genre");
const Tag = require("./Tag");
const Review = require("./Review");
const AniStaff = require("./AniStaff");
const AniGenre = require("./AniGenre");
const AniTag = require("./AniTag");
const UserRatedAnime = require("./UserRatedAnime");
const UserClusterPreference = require("./UserClusterPreference");
const RecommendationCluster = require("./RecommendationCluster");
const AnilistAnime = require("./AnilistAnime");

// 모델 내보내기
module.exports = {
  User,
  WithdrawnUser,
  Anime,
  Staff,
  Genre,
  Tag,
  Review,
  AniStaff,
  AniGenre,
  AniTag,
  UserRatedAnime,
  UserClusterPreference,
  RecommendationCluster,
  AnilistAnime,
};

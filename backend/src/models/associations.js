// models/associations.js
const Anime = require("./Anime");
const Genre = require("./Genre");
const Staff = require("./Staff");
const Tag = require("./Tag");
const AnimeGenre = require("./AnimeGenre");
const AnimeStaffs = require("./AnimeStaffs");
const AniTag = require("./AniTag");

// Anime와 Genre 간의 관계 설정
Anime.belongsToMany(Genre, { through: AnimeGenre, foreignKey: "anime_id" });
Genre.belongsToMany(Anime, { through: AnimeGenre, foreignKey: "genre_id" });

// Anime와 Staff 간의 관계 설정
Anime.belongsToMany(Staff, {
  through: AnimeStaffs,
  foreignKey: "anime_id",
  otherKey: "staff_id",
});

Staff.belongsToMany(Anime, {
  through: AnimeStaffs,
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

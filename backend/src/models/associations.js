// models/associations.js
const Anime = require("./Anime");
const Genre = require("./Genre");
const Staff = require("./Staff");
const AnimeGenre = require("./AnimeGenre");
const AnimeStaff = require("./AnimeStaff");

// Anime와 Genre 간의 관계 설정
Anime.belongsToMany(Genre, { through: AnimeGenre, foreignKey: "anime_id" });
Genre.belongsToMany(Anime, { through: AnimeGenre, foreignKey: "genre_id" });

// Anime와 Staff 간의 관계 설정
Anime.belongsToMany(Staff, { through: AnimeStaff, foreignKey: "anime_id" });
Staff.belongsToMany(Anime, { through: AnimeStaff, foreignKey: "staff_id" });

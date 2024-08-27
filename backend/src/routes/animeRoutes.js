const express = require("express");
const { getAnimeList } = require("../controllers/animeController");

const router = express.Router();

router.get("/animes", getAnimeList);

module.exports = router;

const fs = require("fs");
const { animeIndex } = require("../src/config/meiliConfig");

const indexAnimeFromFile = async () => {
  try {
    const data = fs.readFileSync("../data/anime_data.json", "utf-8");
    const animes = JSON.parse(data);

    await animeIndex.addDocuments(animes);
    console.log("Anime data indexed successfully.");
  } catch (error) {
    console.error("Error indexing anime data from file:", error);
  }
};

indexAnimeFromFile();

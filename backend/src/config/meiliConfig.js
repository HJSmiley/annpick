const { MeiliSearch } = require("meilisearch");

const meiliClient = new MeiliSearch({
  host: "http://localhost:7700",
  apiKey: process.env.MEILISEARCH_API_KEY || null,
});

const animeIndex = meiliClient.index("animes");

module.exports = { meiliClient, animeIndex };

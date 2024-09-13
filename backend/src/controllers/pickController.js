const {
  updatePickStatus,
  getPickedAnimes,
} = require("../services/pickService");

const pickAnime = async (req, res) => {
  const { anime_id, is_picked } = req.body;
  const userId = req.user.user_id;

  try {
    const updatedPick = await updatePickStatus(userId, anime_id, is_picked);
    res.status(200).json(updatedPick);
  } catch (error) {
    console.error("Error updating pick status:", error);
    res.status(500).json({ error: "Failed to update pick status." });
  }
};

const getPickedAnimeList = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const pickedAnimes = await getPickedAnimes(userId);
    res.status(200).json(pickedAnimes);
  } catch (error) {
    console.error("Error fetching picked animes:", error);
    res.status(500).json({ error: "Failed to fetch picked animes." });
  }
};

module.exports = {
  pickAnime,
  getPickedAnimeList,
};

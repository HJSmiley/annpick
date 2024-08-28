const { saveAnimeData } = require("../src/controllers/animeController");

const runSaveAnimeData = async () => {
  try {
    console.log("Fetching and saving anime data...");
    await saveAnimeData();
    console.log("Anime data has been fetched and saved successfully.");
    process.exit(0); // 스크립트 실행 후 종료
  } catch (error) {
    console.error("Error during anime data save operation:", error);
    process.exit(1);
  }
};

runSaveAnimeData();

const { saveAnimeData } = require("../src/services/animeService");

const runSaveAnimeData = async () => {
  try {
    console.log("Fetching and saving anime data...");

    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      console.log(`Fetching data from page ${currentPage}...`);
      const moreData = await saveAnimeData(currentPage);

      if (moreData.length === 0) {
        hasMorePages = false; // 더 이상 가져올 데이터가 없으면 루프 종료
      } else {
        currentPage++;
      }
    }

    console.log("All anime data has been fetched and saved successfully.");
    process.exit(0); // 스크립트 실행 후 종료
  } catch (error) {
    console.error("Error during anime data save operation:", error);
    process.exit(1);
  }
};

runSaveAnimeData();

const { Anime } = require("../src/models");

const deleteNonTVAnime = async () => {
  try {
    // 삭제할 애니메이션 형식
    const formatsToDelete = ["ONA", "OVA", "MOVIE"];

    // 삭제할 애니메이션을 조회
    const animesToDelete = await Anime.findAll({
      where: {
        format: formatsToDelete,
      },
    });

    if (animesToDelete.length > 0) {
      console.log(`Found ${animesToDelete.length} non-TV animes. Deleting...`);

      // 삭제 진행
      await Anime.destroy({
        where: {
          format: formatsToDelete,
        },
      });

      console.log("Non-TV animes deleted successfully.");
    } else {
      console.log("No non-TV animes found to delete.");
    }

    process.exit(0); // 스크립트 실행 후 종료
  } catch (error) {
    console.error("Error deleting non-TV animes from the database:", error);
    process.exit(1);
  }
};

deleteNonTVAnime();

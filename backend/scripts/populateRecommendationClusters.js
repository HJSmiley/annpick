require("../src/models/associations");
const { Anime, Genre, Tag, RecommendationCluster } = require("../src/models/");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

async function populateRecommendationClusters() {
  try {
    // 기존 데이터 삭제 (필요한 경우)
    await RecommendationCluster.destroy({ where: {} });
    console.log("기존 RecommendationCluster 데이터 삭제 완료.");

    // 모든 장르와 태그 가져오기
    const genres = await Genre.findAll();
    const tags = await Tag.findAll();

    for (const genre of genres) {
      for (const tag of tags) {
        // 해당 장르와 태그를 가진 애니메이션 찾기
        const animes = await Anime.findAll({
          include: [
            {
              model: Genre,
              where: { genre_id: genre.genre_id },
              through: { attributes: [] },
            },
            {
              model: Tag,
              where: { tag_id: tag.tag_id },
              through: {
                attributes: ["tag_score"],
                where: { tag_score: { [Op.gte]: 70 } },
              },
            },
          ],
        });

        if (animes.length === 0) {
          continue; // 해당 조합에 애니메이션이 없으면 다음으로 넘어감
        }

        // 추천 문구 생성 (일단 장르+태그 문자열 조합으로 설정)
        const recommendationPhrase = `${genre.genre_name} + ${tag.tag_name}`;

        const bulkData = animes.map((anime) => ({
          anime_id: anime.anime_id,
          genre_id: genre.genre_id,
          tag_id: tag.tag_id,
          recommendation_phrase: recommendationPhrase,
        }));

        // RecommendationCluster 테이블에 데이터 삽입
        await RecommendationCluster.bulkCreate(bulkData);
        console.log(
          `Genre: ${genre.genre_name}, Tag: ${tag.tag_name} 조합에 ${animes.length}개의 애니메이션 저장 완료.`
        );
      }
    }

    console.log("RecommendationCluster 테이블 데이터 생성 완료.");
  } catch (error) {
    console.error("RecommendationCluster 생성 중 오류 발생:", error);
  }
}

// 스크립트 실행
populateRecommendationClusters();

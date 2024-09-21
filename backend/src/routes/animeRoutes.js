const express = require("express");
const {
  getAnimeByIds,
  getAnimeDetails,
  rateAnime,
  getRatedAnimes,
  searchAnimes,
  getRecommendedAnimeSections,
} = require("../controllers/animeController");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/anime/search:
 *   get:
 *     summary: 애니메이션 검색
 *     description: MeiliSearch를 사용하여 애니메이션을 검색하고, 검색된 anime_id 리스트를 기반으로 DB에서 애니메이션 세부 정보를 가져옵니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: 검색할 애니메이션 제목 또는 키워드
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: false
 *         description: 장르 필터 (쉼표로 구분된 여러 개의 장르 가능)
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         required: false
 *         description: 태그 필터 (쉼표로 구분된 여러 개의 태그 가능)
 *     responses:
 *       200:
 *         description: 검색된 애니메이션 정보 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anime_id:
 *                     type: integer
 *                     example: 12345
 *                     description: 애니메이션의 고유 ID
 *                   title:
 *                     type: string
 *                     example: 원피스
 *                     description: 애니메이션 제목
 *                   thumbnail_url:
 *                     type: string
 *                     example: https://example.com/image.jpg
 *                     description: 애니메이션 썸네일 이미지 URL
 *                   format:
 *                     type: string
 *                     example: TV
 *                     description: 애니메이션의 포맷 (TV, OVA 등)
 *                   status:
 *                     type: string
 *                     example: 방영중
 *                     description: 애니메이션의 상태 (방영중, 완결 등)
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Action
 *                     description: 애니메이션의 장르 리스트
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Pirate
 *                     description: 애니메이션의 태그 리스트
 *       404:
 *         description: 검색 결과가 없습니다.
 *       500:
 *         description: 서버 오류
 */
router.get("/search", searchAnimes);

/**
 * @swagger
 * /api/v1/anime/public/cards:
 *   get:
 *     summary: 퍼블릭 엔드포인트 - 여러 ID의 애니메이션 정보를 가져옴
 *     description: 로그인이 필요 없는 퍼블릭 엔드포인트로, 애니메이션 카드 정보를 가져옵니다. 별점은 0으로 설정됩니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *           description: 요청할 애니메이션의 ID 리스트
 *     responses:
 *       200:
 *         description: 애니메이션 정보 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anime_id:
 *                     type: integer
 *                   thumbnail_url:
 *                     type: string
 *                   title:
 *                     type: string
 *                   format:
 *                     type: string
 *                   status:
 *                     type: string
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: 애니메이션을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get("/public/cards", getAnimeByIds);

/**
 * @swagger
 * /api/v1/anime/public/details/{id}:
 *   get:
 *     summary: 퍼블릭 엔드포인트 - 특정 ID의 애니메이션 상세 정보를 가져옴
 *     description: 로그인이 필요 없는 퍼블릭 엔드포인트로, 특정 애니메이션의 상세 정보를 가져옵니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: 애니메이션의 ID
 *     responses:
 *       200:
 *         description: 애니메이션 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 anime_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 thumbnail_url:
 *                   type: string
 *                 banner_img_url:
 *                   type: string
 *                 format:
 *                   type: string
 *                 status:
 *                   type: string
 *                 release_date:
 *                   type: string
 *                   format: date
 *                 description:
 *                   type: string
 *                 season:
 *                   type: string
 *                 studio:
 *                   type: string
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 staff:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *       404:
 *         description: 애니메이션을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get("/public/details/:id", getAnimeDetails);

/**
 * @swagger
 * /api/v1/anime/cards:
 *   get:
 *     summary: 여러 ID의 애니메이션 정보를 가져옴
 *     description: 인증된 사용자에 대한 엔드포인트로, 애니메이션 카드 정보를 가져옵니다. 별점은 사용자 DB 정보를 반영합니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *           description: 요청할 애니메이션의 ID 리스트
 *     responses:
 *       200:
 *         description: 애니메이션 정보 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anime_id:
 *                     type: integer
 *                   thumbnail_url:
 *                     type: string
 *                   title:
 *                     type: string
 *                   format:
 *                     type: string
 *                   status:
 *                     type: string
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: 애니메이션을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
// 애니메이션 데이터를 IDs로 가져오기
router.get("/cards", getAnimeByIds);

// 인증된 사용자의 추천 섹션 가져오기
router.get(
  "/recommendations",
  ensureAuthenticated,
  getRecommendedAnimeSections
);

/**
 * @swagger
 * /api/v1/anime/details/{id}:
 *   get:
 *     summary: 특정 ID의 애니메이션 상세 정보를 가져옴
 *     description: 인증된 사용자에 대한 엔드포인트로, 특정 애니메이션의 상세 정보를 가져옵니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: 애니메이션의 ID
 *     responses:
 *       200:
 *         description: 애니메이션 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 anime_id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 thumbnail_url:
 *                   type: string
 *                 banner_img_url:
 *                   type: string
 *                 format:
 *                   type: string
 *                 status:
 *                   type: string
 *                 release_date:
 *                   type: string
 *                   format: date
 *                 description:
 *                   type: string
 *                 season:
 *                   type: string
 *                 studio:
 *                   type: string
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 staff:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *       404:
 *         description: 애니메이션을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */
router.get("/details/:id", ensureAuthenticated, getAnimeDetails);

/**
 * @swagger
 * /api/v1/anime/ratings:
 *   get:
 *     summary: 사용자가 평가한 애니메이션 목록 조회
 *     description: 인증된 사용자가 평가한 애니메이션 목록을 평점별로 조회할 수 있습니다. 평점 필터와 페이지네이션 기능을 제공합니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: 페이지 번호, 기본값 1
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           format: float
 *         required: false
 *         description: 필터할 평점, 선택 사항
 *     responses:
 *       200:
 *         description: 평가된 애니메이션 정보 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   anime_id:
 *                     type: integer
 *                     example: 12345
 *                   title:
 *                     type: string
 *                     example: 원피스
 *                   thumbnail_url:
 *                     type: string
 *                     example: https://example.com/image.jpg
 *                   format:
 *                     type: string
 *                     example: TV
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.5
 *       404:
 *         description: 평가된 애니메이션이 없습니다.
 *       500:
 *         description: 서버 오류
 */
router.get("/ratings", ensureAuthenticated, getRatedAnimes);

/**
 * @swagger
 * /api/v1/anime/ratings:
 *   post:
 *     summary: 애니메이션에 별점 부여
 *     description: 사용자가 애니메이션에 별점을 부여할 수 있습니다. 사용자가 이미 별점을 부여한 경우, 별점이 업데이트됩니다.
 *     tags:
 *       - 애니메이션
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               anime_id:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: number
 *                 format: float
 *                 example: 4.5
 *     responses:
 *       200:
 *         description: 별점 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rating saved successfully
 *                 rating:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     anime_id:
 *                       type: integer
 *                       example: 1
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.5
 *       500:
 *         description: 별점 저장 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to save rating
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post("/ratings", ensureAuthenticated, rateAnime);

module.exports = router;

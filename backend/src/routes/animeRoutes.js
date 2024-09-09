const express = require("express");
const {
  getAnimeByIds,
  getAnimeDetails,
  rateAnime,
} = require("../controllers/animeController");
const ensureAuthenticated = require("../middleware/authMiddleware");
const { searchAnimes } = require("../controllers/animeController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/anime/search:
 *   get:
 *     summary: 애니메이션 검색
 *     description: 주어진 쿼리와 필터를 사용하여 애니메이션을 검색합니다.
 *     tags:
 *       - 애니메이션
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: false
 *         description: 장르 필터
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         required: false
 *         description: 태그 필터
 *     responses:
 *       200:
 *         description: 검색된 애니메이션 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 12345
 *                   title:
 *                     type: string
 *                     example: 원피스
 *                   popularity:
 *                     type: integer
 *                     example: 10000
 *                   genres:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Action
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Pirate
 *                   staff:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Eiichiro Oda
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
router.get("/cards", ensureAuthenticated, getAnimeByIds);

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

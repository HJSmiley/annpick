const express = require("express");
const {
  getAnimeByIds,
  getAnimeDetails,
  rateAnime,
} = require("../controllers/animeController");
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// prettier-ignore
/**
 * @swagger
 * /api/v1/anime/cards:
 *   get:
 *     summary: 여러 ID의 애니메이션 정보를 가져옴
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
router.get("/anime/cards", getAnimeByIds);

// prettier-ignore
/**
 * @swagger
 * /api/v1/anime/details/{id}:
 *   get:
 *     summary: 특정 ID의 애니메이션 상세 정보를 가져옴
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
router.get("/anime/details/:id", ensureAuthenticated, getAnimeDetails);

/**
 * @swagger
 * /api/v1/anime/ratings:
 *   post:
 *     summary: Rate an anime
 *     description: Allows a user to rate an anime. If the user has already rated the anime, the rating will be updated.
 *     tags:
 *       - Anime
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
 *         description: Rating saved successfully
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
 *         description: Failed to save rating
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
router.post("/anime/ratings", ensureAuthenticated, rateAnime);

module.exports = router;

const express = require("express");
const { getAnimeList } = require("../controllers/animeController");

const router = express.Router();

/**
 * @swagger
 * /api/v1/animecard:
 *   get:
 *     summary: 애니메이션 카드 정보를 가져옴
 *     tags: [애니메이션]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 반환할 애니메이션의 최대 개수
 *     responses:
 *       200:
 *         description: 애니메이션 카드 정보
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
 */
router.get("/animecard", getAnimeList);

module.exports = router;

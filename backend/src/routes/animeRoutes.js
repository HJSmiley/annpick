const express = require("express");
const {
  getAnimeById,
  getAnimeByIds,
} = require("../controllers/animeController");

const router = express.Router();

// prettier-ignore
/**
 * @swagger
 * /api/v1/animecards:
 *   get:
 *     summary: 여러 id의 애니메이션 정보를 가져옴
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
router.get("/animecards", getAnimeByIds);

module.exports = router;

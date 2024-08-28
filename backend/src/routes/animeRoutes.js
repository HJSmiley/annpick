const express = require("express");
const {
  getAnimeByIds,
  getAnimeDetails,
} = require("../controllers/animeController");

const router = express.Router();

// prettier-ignore
/**
 * @swagger
 * /api/v1/animecards:
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
router.get("/animecards", getAnimeByIds);

// prettier-ignore
/**
 * @swagger
 * /api/v1/animedetails/{id}:
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
router.get("/animedetails/:id", getAnimeDetails);

module.exports = router;

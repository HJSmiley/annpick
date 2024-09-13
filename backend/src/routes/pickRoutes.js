const express = require("express");
const router = express.Router();
const {
  pickAnime,
  getPickedAnimeList,
} = require("../controllers/pickController");
const ensureAuthenticated = require("../middleware/authMiddleware"); // JWT 인증 미들웨어

// 애니메이션 북마크 상태 저장 API
router.post("/picks", ensureAuthenticated, pickAnime);

// 사용자가 픽한 애니메이션 목록 조회 API
router.get("/picks", ensureAuthenticated, getPickedAnimeList);

module.exports = router;

const express = require("express");
const { triggerRecommendation } = require("../controllers/recommendController"); // 새 컨트롤러 파일 추가
const ensureAuthenticated = require("../middleware/authMiddleware");

const router = express.Router();

// 평가 완료 후 추천 트리거
router.post("/recommend", ensureAuthenticated, triggerRecommendation);

module.exports = router;

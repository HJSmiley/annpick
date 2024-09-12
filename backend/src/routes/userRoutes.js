const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/userController");
const upload = require("../middleware/multer"); // multer 미들웨어 설정
const ensureAuthenticated = require("../middleware/authMiddleware");

// 프로필 업데이트 라우트 (이미지와 닉네임 처리)
router.post(
  "/update",
  ensureAuthenticated,
  upload.single("profileImage"),
  updateProfile
);

module.exports = router;

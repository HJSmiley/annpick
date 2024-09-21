const express = require("express");
const router = express.Router();
const {
  updateProfile,
  withdrawUser,
} = require("../controllers/userController");
const upload = require("../middleware/multer"); // multer 미들웨어 설정
const ensureAuthenticated = require("../middleware/authMiddleware");
const passport = require("../config/authConfig");

// 프로필 업데이트 라우트 (이미지와 닉네임 처리)
router.post(
  "/update",
  ensureAuthenticated,
  upload.single("profileImage"),
  updateProfile
);

// 회원 탈퇴 엔드포인트
router.post(
  "/withdraw",
  passport.authenticate("jwt", { session: false }),
  withdrawUser
);

module.exports = router;

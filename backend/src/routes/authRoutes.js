const express = require("express");
const {
  naverCallback,
  refreshAccessToken,
  logout,
} = require("../controllers/authController");
const passport = require("../config/authConfig");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/naver:
 *   get:
 *     summary: 네이버 인증 시작
 *     tags: [인증]
 *     responses:
 *       302:
 *         description: 네이버 로그인 페이지로 리다이렉트됩니다.
 */
router.get(
  "/auth/naver",
  passport.authenticate("naver", { authType: "reprompt" })
);

/**
 * @swagger
 * /api/v1/auth/naver/callback:
 *   get:
 *     summary: 네이버 인증 콜백
 *     tags: [인증]
 *     responses:
 *       302:
 *         description: JWT 토큰과 함께 프론트엔드로 리다이렉트됩니다.
 */
router.get(
  "/auth/naver/callback",
  passport.authenticate("naver", { session: false }),
  naverCallback
);

router.post("/auth/token", refreshAccessToken);

router.post("/auth/logout", logout);

module.exports = router;

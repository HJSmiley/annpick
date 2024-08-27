const express = require("express");
const {
  renderLoginPage,
  naverCallback,
} = require("../controllers/authController");
const passport = require("../config/passportConfig");

const router = express.Router();

router.get(
  "/auth/naver",
  passport.authenticate("naver", { authType: "reprompt" })
);
router.get(
  "/auth/naver/callback",
  passport.authenticate("naver", { session: false }),
  naverCallback
);

module.exports = router;

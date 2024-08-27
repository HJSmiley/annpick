const express = require("express");
const naverCallback = require("../controllers/authController");
const passport = require("../config/authConfig");

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

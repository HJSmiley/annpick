const express = require("express");
const { renderProfilePage } = require("../controllers/profileController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, renderProfilePage);

module.exports = router;

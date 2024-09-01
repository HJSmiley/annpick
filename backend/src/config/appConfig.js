require("dotenv").config(); // 환경 변수 로드
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const sequelize = require("./dbConfig");
const { swaggerUi, swaggerSpec } = require("./swaggerConfig");
const authRoutes = require("../routes/authRoutes");
const animeRoutes = require("../routes/animeRoutes");
const { meiliClient, animeIndex } = require("../config/meiliConfig");
const models = require("../models");

module.exports = {
  express,
  cors,
  bodyParser,
  passport,
  sequelize,
  swaggerUi,
  swaggerSpec,
  authRoutes,
  animeRoutes,
  meiliClient,
  animeIndex,
  models,
};

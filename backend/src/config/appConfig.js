require("dotenv").config(); // 환경 변수 로드
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const NaverStrategy = require("passport-naver").Strategy;

module.exports = {
  express,
  cors,
  bodyParser,
  passport,
  jwt,
  NaverStrategy,
};

// src/config/passportConfig.js
const { passport, jwt, NaverStrategy } = require("./appConfig");
const sequelize = require("./dbConfig");
const { User } = require("../models"); // 사용자 모델 가져오기

// 네이버 전략 설정
passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/naver/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // 네이버 프로필 정보를 활용하여 JWT 토큰 생성
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      };

      // JWT 토큰 생성
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h", // 토큰 유효 기간
      });

      return done(null, { user, token });
    }
  )
);

module.exports = passport;

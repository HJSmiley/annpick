const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/naver/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // 네이버 API 호출하여 프로필 정보 가져오기
        const response = await axios.get(
          "https://openapi.naver.com/v1/nid/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const profileData = response.data.response;

        // 데이터베이스에 저장할 사용자 정보 구성
        const userData = {
          email: profileData.email || null,
          nickname: profileData.nickname || null,
          user_name: profileData.name || null, // 이름
          phone: profileData.mobile
            ? profileData.mobile.replace(/-/g, "")
            : null, // 전화번호
          birth: profileData.birthday
            ? `${profileData.birthyear}-${profileData.birthday}`
            : null, // 생일 (YYYY-MM-DD 형식으로 변환)
          gender:
            profileData.gender === "M"
              ? "M"
              : profileData.gender === "F"
              ? "F"
              : null, // 성별
          user_status: "A",
        };

        // DB에 맞지 않는 정보는 저장하지 않음
        // 예: profile_image, age, birthyear 등은 DB에 맞지 않기 때문에 제외

        // 사용자 정보 DB에 저장 또는 업데이트
        const [user, created] = await User.findOrCreate({
          where: { email: userData.email },
          defaults: userData,
        });

        // JWT 토큰 생성
        const token = jwt.sign(
          { id: user.user_id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return done(null, { user, token });
      } catch (err) {
        console.error("Failed to fetch Naver profile:", err);
        return done(err, false);
      }
    }
  )
);

module.exports = passport;

const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const {
  findOrCreateUser,
  generateToken,
  fetchNaverProfile,
} = require("../services/authService");

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://3.36.94.230:8000/auth/naver/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // 네이버 API로부터 프로필 정보 가져오기
        const profileData = await fetchNaverProfile(accessToken);

        // 사용자 정보 DB에 저장 또는 업데이트
        const user = await findOrCreateUser(profileData);

        // JWT 토큰 생성
        const token = generateToken(user);

        return done(null, { user, token });
      } catch (err) {
        console.error("Failed to authenticate using Naver:", err);
        return done(err, false);
      }
    }
  )
);

module.exports = passport;

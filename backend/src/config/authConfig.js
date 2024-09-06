const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const {
  findOrCreateUser,
  generateToken,
  fetchNaverProfile,
} = require("../services/authService");
const { User } = require("../models");

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/naver/callback`,
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

// JWT 전략 설정
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // JWT 토큰 서명 검증을 위한 비밀 키
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // JWT의 payload에서 사용자를 검색
      const user = await User.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false); // 사용자 없음
      }
    } catch (err) {
      return done(err, false); // 에러 발생
    }
  })
);

module.exports = passport;

const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const {
  findOrCreateUser,
  generateAccessToken,
  generateRefreshToken,
  fetchNaverProfile,
} = require("../services/authService");
const { User } = require("../models");

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID, // .env에서 클라이언트 ID 가져옴
      clientSecret: process.env.NAVER_CLIENT_SECRET, // .env에서 클라이언트 시크릿 가져옴
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/naver/callback`, // 콜백 URL 설정
      passReqToCallback: true, // req 객체 전달 활성화
    },
    async function (req, accessToken, refreshToken, params, profile, done) {
      try {
        const profileData = await fetchNaverProfile(accessToken);
        const user = await findOrCreateUser(profileData);

        // 네이버 토큰으로 업데이트
        await user.update({
          naver_access_token: accessToken,
          naver_refresh_token: refreshToken,
        });

        const jwtAccessToken = generateAccessToken(user); // JWT Access Token 생성
        const jwtRefreshToken = generateRefreshToken(user); // JWT Refresh Token 생성

        // 리프레시 토큰을 HTTP-Only 쿠키에 저장
        req.res.cookie("refreshToken", jwtRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // HTTPS에서만 전달되도록 설정
          sameSite: "Strict",
        });

        req.authInfo = {
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
        };

        return done(null, user, req.authInfo);
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

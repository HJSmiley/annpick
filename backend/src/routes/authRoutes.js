const express = require("express");
const passport = require("../config/passportConfig");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
      <html>
        <body>
          <h1>Welcome to the Home Page</h1>
          <a href="/auth/naver">네이버 로그인</a><br/><br/>
          <button id="profileButton">Go to Profile</button>
          <script>
            document.getElementById('profileButton').onclick = function() {
              const token = localStorage.getItem('jwtToken'); // localStorage에서 토큰 가져오기
  
              if (token) {
                fetch('/profile', {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Unauthorized');
                  }
                  return response.json();
                })
                .then(data => {
                  alert('Welcome ' + data.user.displayName);
                })
                .catch(error => {
                  console.error('Error:', error);
                });
              } else {
                console.error('No JWT token found, please login first.');
              }
            };
          </script>
        </body>
      </html>
    `);
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/naver:
 *   get:
 *     summary: 네이버 로그인
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 네이버 로그인 페이지로 리디렉션
 */

// 네이버 로그인 라우트
router.get("/auth/naver", passport.authenticate("naver"));

/**
 * @swagger
 * /auth/naver/callback:
 *   get:
 *     summary: 네이버 로그인 콜백
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 네이버 로그인 성공 후 리디렉션
 *       401:
 *         description: 인증 실패
 */

// 네이버 인증 후 콜백 라우트 (여기서 JWT 토큰 생성 및 반환)
router.get(
  "/auth/naver/callback",
  passport.authenticate("naver", { session: false }),
  (req, res) => {
    // 네이버 로그인 성공 후 JWT 토큰을 발급받아 클라이언트에 전달
    const token = req.user.token;

    // 클라이언트 측에서 토큰을 저장하고, 프로필 페이지로 이동시키기 위한 스크립트 반환
    res.send(`
      <html>
        <body>
          <script>
            // JWT 토큰을 localStorage에 저장
            localStorage.setItem('jwtToken', '${token}');
            // 프로필 페이지로 이동
            window.location.href = '/';
          </script>
        </body>
      </html>
    `);
  }
);

// 보호된 라우트
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;

const passport = require("passport");

// JWT를 사용한 인증 미들웨어
const ensureAuthenticated = passport.authenticate("jwt", { session: false });

module.exports = ensureAuthenticated;

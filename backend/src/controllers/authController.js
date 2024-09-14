const { User, UserRatedAnime } = require("../models");

const naverCallback = async (req, res) => {
  const accessToken = req.authInfo?.accessToken;
  const refreshToken = req.authInfo?.refreshToken;
  const user = req.user;

  if (!accessToken || !refreshToken) {
    return res
      .status(401)
      .json({ message: "네이버 토큰이 없습니다. 다시 로그인 해주세요." });
  }

  try {
    const userId = user ? user.user_id : null;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const ratingsCount = await UserRatedAnime.count({
      where: { user_id: userId },
    });

    // 리프레시 토큰을 HTTP-Only 쿠키에 저장 (보안 강화)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // 응답을 한 번만 보내도록 수정
    let redirectUrl =
      ratingsCount > 0
        ? `${process.env.FRONTEND_URL}?token=${accessToken}`
        : `${process.env.FRONTEND_URL}/evaluation?token=${accessToken}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error checking user rating:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "리프레시 토큰이 없습니다." });
  }

  try {
    const response = await axios.post("https://nid.naver.com/oauth2.0/token", {
      grant_type: "refresh_token",
      client_id: process.env.NAVER_CLIENT_ID,
      client_secret: process.env.NAVER_CLIENT_SECRET,
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    const newRefreshToken = response.data.refresh_token || refreshToken;

    res.json({ accessToken: newAccessToken });

    if (newRefreshToken !== refreshToken) {
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "토큰 갱신 실패" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully." });
};

module.exports = {
  naverCallback,
  refreshAccessToken,
  logout,
};

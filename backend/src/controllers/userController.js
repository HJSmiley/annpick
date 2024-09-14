const axios = require("axios");
const { User, WithdrawnUser } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/authService");
const { uploadToS3, deleteFromS3 } = require("../services/s3Service");

const updateProfile = async (req, res) => {
  const { nickname } = req.body;
  const userId = req.user ? req.user.user_id : null;

  try {
    // 현재 사용자의 기존 프로필 이미지 URL 가져오기
    const user = await User.findByPk(userId);
    const existingProfileImageUrl = user.profile_img;

    let profileImageUrl = existingProfileImageUrl;

    // 새 프로필 이미지가 존재할 경우 S3에 업로드
    if (req.file) {
      profileImageUrl = await uploadToS3(req.file);

      // 기존 이미지가 존재할 경우 S3에서 삭제
      if (existingProfileImageUrl) {
        await deleteFromS3(existingProfileImageUrl);
      }
    }

    // 사용자 DB 업데이트
    await User.update(
      { nickname, profile_img: profileImageUrl },
      { where: { user_id: userId } }
    );

    // 업데이트된 사용자 정보 다시 불러오기
    const updatedUser = await User.findByPk(userId);

    // 새로운 JWT Access Token 발급
    const newAccessToken = generateAccessToken(updatedUser); // JWT 발급
    const newRefreshToken = generateRefreshToken(updatedUser); // Refresh Token 발급 (필요할 경우)

    // 새로운 토큰을 쿠키에 저장
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전달되도록 설정
      sameSite: "Strict",
    });

    // 응답에 새로운 토큰과 사용자 정보 전달
    return res.status(200).json({
      message: "프로필 업데이트 성공",
      token: newAccessToken, // 새로운 Access Token 반환
      user: {
        nickname: updatedUser.nickname,
        profile_img: updatedUser.profile_img,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    return res.status(500).json({ message: "프로필 업데이트 중 오류 발생" });
  }
};

const withdrawUser = async (req, res) => {
  const reason = req.body.reason;

  try {
    const user = await User.findByPk(req.user.user_id);

    let accessToken = user.naver_access_token;
    let refreshToken = user.naver_refresh_token;

    if (!accessToken || !refreshToken) {
      return res
        .status(401)
        .json({ message: "네이버 토큰이 없습니다. 다시 로그인 해주세요." });
    }

    // 네이버 연동 해제 API 호출
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "delete");
      params.append("client_id", process.env.NAVER_CLIENT_ID);
      params.append("client_secret", process.env.NAVER_CLIENT_SECRET);
      params.append("access_token", accessToken);
      params.append("service_provider", "NAVER");

      await axios.post(
        "https://nid.naver.com/oauth2.0/token",
        params.toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
    } catch (error) {
      // 네이버 Access Token 만료 시 갱신 시도
      if (
        error.response &&
        error.response.data.error === "invalid_access_token"
      ) {
        const refreshParams = new URLSearchParams();
        refreshParams.append("grant_type", "refresh_token");
        refreshParams.append("client_id", process.env.NAVER_CLIENT_ID);
        refreshParams.append("client_secret", process.env.NAVER_CLIENT_SECRET);
        refreshParams.append("refresh_token", refreshToken);

        const refreshResponse = await axios.post(
          "https://nid.naver.com/oauth2.0/token",
          refreshParams.toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        // 네이버 Access Token 갱신 후 다시 연동 해제 시도
        accessToken = refreshResponse.data.access_token;
        await user.update({ naver_access_token: accessToken });

        const retryParams = new URLSearchParams();
        retryParams.append("grant_type", "delete");
        retryParams.append("client_id", process.env.NAVER_CLIENT_ID);
        retryParams.append("client_secret", process.env.NAVER_CLIENT_SECRET);
        retryParams.append("access_token", accessToken);
        retryParams.append("service_provider", "NAVER");

        await axios.post(
          "https://nid.naver.com/oauth2.0/token",
          retryParams.toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );
      } else {
        throw error;
      }
    }

    // DB에서 사용자 정보 삭제
    await WithdrawnUser.create({ user_id: user.user_id, reason });
    await User.destroy({ where: { user_id: user.user_id } });

    // 리프레시 토큰 삭제
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("Error during user withdrawal:", error);
    res.status(500).json({ message: "회원 탈퇴에 실패했습니다." });
  }
};

module.exports = { updateProfile, withdrawUser };

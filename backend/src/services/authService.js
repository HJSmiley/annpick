const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const findOrCreateUser = async (profileData) => {
  const userData = {
    email: profileData.email || null,
    profile_img: profileData.profile_image || null,
    nickname: profileData.nickname || null,
    user_name: profileData.name || null,
    phone: profileData.mobile ? profileData.mobile.replace(/-/g, "") : null,
    birth: profileData.birthday
      ? `${profileData.birthyear}-${profileData.birthday}`
      : null,
    gender:
      profileData.gender === "M"
        ? "M"
        : profileData.gender === "F"
        ? "F"
        : null,
  };

  const [user, created] = await User.findOrCreate({
    where: { email: userData.email },
    defaults: userData,
  });

  return user;
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      nickname: user.nickname,
      profile_img: user.profile_img,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Access Token 유효 기간 설정 (예: 15분)
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.user_id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Refresh Token 유효 기간 설정 (예: 7일)
  );
};

const fetchNaverProfile = async (accessToken) => {
  try {
    const response = await axios.get("https://openapi.naver.com/v1/nid/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.response;
  } catch (error) {
    throw new Error("Failed to fetch Naver profile");
  }
};

module.exports = {
  findOrCreateUser,
  generateAccessToken,
  generateRefreshToken,
  fetchNaverProfile,
};

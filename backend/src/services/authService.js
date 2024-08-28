const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const findOrCreateUser = async (profileData) => {
  const userData = {
    email: profileData.email || null,
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
    user_status: "A",
  };

  const [user, created] = await User.findOrCreate({
    where: { email: userData.email },
    defaults: userData,
  });

  return user;
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id }, // 사용자 ID만 포함
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
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

module.exports = { findOrCreateUser, generateToken, fetchNaverProfile };

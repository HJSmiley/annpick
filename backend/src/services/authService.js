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
    user_status: "A",
  };

  const [user, created] = await User.findOrCreate({
    where: { email: userData.email },
    defaults: userData,
  });

  return user;
};

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.user_id,
      profile_img: user.profile_img,
      email: user.email, // 이메일 포함
      nickname: user.nickname, // 닉네임 포함
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
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

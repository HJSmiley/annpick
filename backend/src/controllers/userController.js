const { User } = require("../models"); // User 모델을 가져옵니다.
const { uploadToS3, deleteFromS3 } = require("../services/s3Service"); // S3 업로드 및 삭제 함수
const { generateToken } = require("../services/authService");

exports.updateProfile = async (req, res) => {
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

    // 새로운 JWT 토큰 발급
    const newToken = generateToken(updatedUser);

    return res.status(200).json({
      message: "프로필 업데이트 성공",
      token: newToken, // 새로운 JWT 토큰 반환
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

const multer = require("multer");
const path = require("path");

// 메모리 저장소를 사용하여 파일을 메모리에 저장
const storage = multer.memoryStorage();

// 파일 업로드 설정
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 파일 크기: 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다."));
    }
  },
});

module.exports = upload;

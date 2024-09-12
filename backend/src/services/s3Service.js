const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// S3에 파일 업로드
exports.uploadToS3 = (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data.Location); // S3에 업로드된 파일 URL 반환
    });
  });
};

// S3에서 기존 파일 삭제
exports.deleteFromS3 = (fileUrl) => {
  // fileUrl에서 S3 버킷의 도메인 부분을 제거하고 파일 Key 추출
  const bucketUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
  const fileKey = fileUrl.replace(bucketUrl, ""); // URL에서 파일 Key만 추출

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey, // 전체 파일 경로 (Key) 필요
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(data); // 파일 삭제 성공
    });
  });
};

// 장르 이름을 한글로 번역하는 매핑
const genreTranslations = {
  Action: "액션",
  Adventure: "모험",
  Comedy: "코미디",
  Drama: "드라마",
  Fantasy: "판타지",
  // 필요한 다른 장르를 여기에 추가
  // ...
};

// 장르를 한글로 번역하는 함수
const translateGenre = (genres) => {
  const translatedGenres = genres
    .map((genre) => genreTranslations[genre] || genre) // 매핑된 번역이 없으면 원래 이름 사용
    .sort((a, b) => a.localeCompare(b, "ko-KR")); // 가나다순 정렬
  return translatedGenres;
};

module.exports = { translateGenre };

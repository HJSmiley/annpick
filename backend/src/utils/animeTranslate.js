// 스태프 이름을 한국어로 번역하는 함수
const translateStaffName = (staffName) => {
  const translations = {
    "John Doe": "존 도",
    "Jane Smith": "제인 스미스",
    "Eiichirou Oda": "오다 에이이치로",
    "Junji Shimizu": "시미즈 준지",
    "Takashi Ootsuka": "오오츠카 타카시",
    "Katsumi Tokoro": "토코로 카츠미",
    "Kounosuke Uda": "우다 코우노스케",
    "Kazuhisa Takenouchi": "타케노우치 카즈히사",
    "Takahiro Imamuro": "이마무로 타카히로",
    "Tatsuya Nagamine": "나가미네 타츠야",
    "Gorou Taniguchi": "타니구치 고로",
    "Hiroaki Miyamoto": "미야모토 히로아키",
    // 추가 번역 데이터
  };

  return translations[staffName] || staffName;
};

// 스태프 역할을 한국어로 번역하는 함수
const translateStaffRole = (role) => {
  const roles = {
    director: "감독",
    origin: "원작",
  };

  return roles[role] || "Unknown";
};

// 장르 이름을 한글로 번역하는 매핑
const genreTranslations = {
  Action: "액션",
  Adventure: "모험",
  Comedy: "코미디",
  Drama: "드라마",
  Fantasy: "판타지",
  // 필요한 다른 장르를 여기에 추가
};

// 장르를 한글로 번역하는 함수
const translateGenre = (genres) => {
  const translatedGenres = genres
    .map((genre) => genreTranslations[genre] || genre) // 매핑된 번역이 없으면 원래 이름 사용
    .sort((a, b) => a.localeCompare(b, "ko-KR")); // 가나다순 정렬
  return translatedGenres;
};

// 태그 이름을 한글로 번역하는 매핑
// prettier-ignore
const tagTranslations = {
    "Pirates": "해적",
    "Shounen": "소년",
    "Ensemble Cast": "앙상블 캐스트",
    "Travel": "여행",
    "Super Power": "초능력",
    "Found Family": "가족 찾기",
    "Male Protagonist": "남자 주인공",
    "Slapstick": "슬랩스틱",
    "Ships": "배",
    "Conspiracy": "음모",
    "Tragedy": "비극",
    "Time Skip": "타임 스킵",
    "Aromantic": "무로맨스",
    "Slavery": "노예제",
    "Politics": "정치",
    "War": "전쟁",
    "Fugitive": "도망자",
    "Crime": "범죄",
    "Gods": "신들",
    "Dystopian": "디스토피아",
    "Philosophy": "철학",
    "Prison": "감옥",
    "Lost Civilization": "사라진 문명",
    "Swordplay": "검술",
    "Food": "음식",
    "Medicine": "의학",
    "Samurai": "사무라이",
    "Monster Boy": "괴물 소년",
    "Anthropomorphism": "의인화",
    "Henshin": "변신",
    "Artificial Intelligence": "인공지능",
    "Shapeshifting": "변신 능력",
    "Cyborg": "사이보그",
    "Robots": "로봇",
    "Primarily Adult Cast": "주로 성인 출연진",
    "Desert": "사막",
    "Animals": "동물",
    "Guns": "총기",
    "Coming of Age": "성장",
    "Skeleton": "해골",
    "Anti-Hero": "반영웅",
    "Dragons": "용",
    "Marriage": "결혼",
    "Anachronism": "시대착오적",
    "Post-Apocalyptic": "포스트 아포칼립스",
    "Espionage": "첩보",
    "Monster Girl": "괴물 소녀",
    "Fairy": "요정",
    "Trains": "기차",
    "Female Protagonist": "여자 주인공",
    "Asexual": "무성애",
    "Assassins": "암살자",
    "Drugs": "약물",
    "Clone": "클론",
    "Kuudere": "쿨데레",
    "Gender Bending": "성전환",
    "Adoption": "입양",
    "Revenge": "복수",
    "Ninja": "닌자",
    "Battle Royale": "배틀 로얄",
    "Mermaid": "인어",
    "Time Manipulation": "시간 조작",
    "CGI": "CGI",
    "Angels": "천사",
    "Musical Theater": "뮤지컬 시어터",
    "LGBTQ+ Themes": "LGBTQ+ 테마",
    "Unrequited Love": "짝사랑",
    "Body Swapping": "몸 바꾸기",
    "Zombie": "좀비",
    "Acting": "연기",
    "Transgender": "트랜스젠더",
    "Achromatic": "무채색",
    "Primarily Male Cast": "주로 남성 캐스트",
    "Kaiju": "괴수",
    "Butler": "집사",
    "Super Robot": "슈퍼 로봇",
    "Environmental": "환경",
    "Gambling": "도박",
    "Magic": "마법",
    "Orphan": "고아",
    "Cult": "종교 집단",
    "Handball": "핸드볼",
    "Fairy Tale": "동화",
    "Martial Arts": "무술",
    "Fishing": "낚시",
    "Archery": "양궁",
    "Family Life": "가족 생활",
    "Age Regression": "연령 퇴행",
    "Idol": "아이돌",
    "Suicide": "자살",
    "Alternate Universe": "평행 우주",
    "Augmented Reality": "증강 현실",
    "Bar": "술집",
    "Full CGI": "전체 CGI"
};

// 태그를 한글로 번역하는 함수
const translateTag = (tags) => {
  const translatedTags = tags.map((tag) => tagTranslations[tag] || tag); // 매핑된 번역이 없으면 원래 이름 사용
  return translatedTags;
};

module.exports = {
  translateStaffName,
  translateStaffRole,
  translateGenre,
  translateTag,
};

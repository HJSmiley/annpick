// 날짜를 'YYYY년 M월 D일' 형식으로 포맷하는 함수
const formatReleaseDate = (dateString) => {
  if (!dateString) return null;

  // ISO 문자열을 Date 객체로 변환
  const date = new Date(dateString);

  // 월과 일 값을 1부터 시작하도록 조정
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
  const day = date.getDate();

  // 'YYYY년 M월 D일' 형식으로 반환
  return `${year}년 ${month}월 ${day}일`;
};

// 시즌을 'YY년 QX' 형식으로 포맷, 90년대와 2000년대 모두 포함
const formatSeason = (seasonInt) => {
  if (typeof seasonInt !== "number" || seasonInt < 0) {
    return null;
  }

  let yearPrefix;
  const year = Math.floor(seasonInt / 10); // 두 자리 숫자에서 앞 자리 추출
  const quarter = seasonInt % 10; // 두 자리 숫자에서 뒷 자리 추출

  // 90년대는 90~99, 2000년대는 00~99로 가정
  if (year >= 90) {
    yearPrefix = 1900; // 90년대
  } else {
    yearPrefix = 2000; // 2000년대
  }

  const fullYear = yearPrefix + year;
  const shortYear = fullYear.toString().slice(2); // 'YY' 형식으로 연도 추출

  // 'YY년 QX분기' 형식으로 반환
  return `${shortYear}년 ${quarter}분기`;
};

module.exports = { formatReleaseDate, formatSeason };

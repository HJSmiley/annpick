export interface SectionData {
  title: string;
  ids: number[];
}

// 주어진 범위 내에서 랜덤한 숫자를 생성하는 함수
const getRandomIds = (count: number, max: number): number[] => {
  const ids: number[] = [];
  while (ids.length < count) {
    const randomId = Math.floor(Math.random() * max) + 1; // 1부터 max까지 랜덤 숫자 생성
    if (!ids.includes(randomId)) {
      ids.push(randomId); // 중복되지 않게 추가
    }
  }
  return ids;
};

export const getAnimeSections = (): SectionData[] => {
  return [
    {
      title: "마음을 울리는 애니메이션",
      ids: getRandomIds(10, 3503), // 10개의 랜덤 아이디
    },
    {
      title: "보는 내내 가슴이 두근거리는 애니메이션",
      ids: getRandomIds(8, 3503), // 8개의 랜덤 아이디
    },
    {
      title: "깊은 철학적 메시지를 담은 애니메이션",
      ids: getRandomIds(5, 3503), // 5개의 랜덤 아이디
    },
  ];
};

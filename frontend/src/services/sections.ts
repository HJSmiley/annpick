export interface SectionData {
  title: string;
  ids: number[];
}

export const getAnimeSections = (): SectionData[] => {
  return [
    {
      title: "마음을 울리는 애니메이션",
      ids: [1, 14, 2, 13, 6, 3, 7, 8, 9, 10],
    },
    {
      title: "보는 내내 가슴이 두근거리는 애니메이션",
      ids: [14, 12, 10, 8, 6, 4, 2, 1],
    },
    {
      title: "깊은 철학적 메시지를 담은 애니메이션",
      ids: [19, 7, 5, 3, 1],
    },
  ];
};

export interface SectionData {
  title: string;
  ids: number[];
}

export const getAnimeSections = (): SectionData[] => {
  return [
    {
      title: "마음을 울리는 애니메이션",
      ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      title: "보는 내내 가슴이 두근거리는 애니메이션",
      ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      title: "깊은 철학적 메시지를 담은 애니메이션",
      ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  ];
};

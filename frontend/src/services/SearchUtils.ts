// 필터 클릭 처리 함수
export const handleFilterClick = ({
    tag,
    selectedFilters,
    setSelectedFilters,
    handleSearch
  }: {
    tag: string;
    selectedFilters: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
    handleSearch: () => void;
  }) => {
    setSelectedFilters(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    handleSearch();
  };
  // 카테고리 토글 함수
  export const toggleCategory = (
    categoryName: string,
    expandedCategories: string[],
    setExpandedCategories: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };
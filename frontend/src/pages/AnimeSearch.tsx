import React, { useState } from "react";

const SearchGrid: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("검색");

  const handleSearch = () => {
    console.log("검색어:", searchTerm);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-16 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">찜기능 사용중일 때 첫행에 추천 예외작품 정렬</h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-md border border-[#F35815] focus:outline-none focus:ring-2 focus:ring-[#F35815] focus:border-transparent bg-[#F35815] text-white placeholder-white::placeholder"
              placeholder="검색 필터를 설정해주세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* 여기에 검색 결과를 표시할 수 있습니다 */}
        </div>
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={handleSearch}
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#F35815] text-white font-bold py-3 px-16 rounded-full shadow-lg hover:bg-[#D14704] transition duration-300 ease-in-out"
      >
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="bg-transparent text-white text-center focus:outline-none w-full"
          onClick={(e) => e.stopPropagation()}
        />
      </button>

      {/* 풋터 */}
      <footer/>
    </div>
  );
};

export default SearchGrid;
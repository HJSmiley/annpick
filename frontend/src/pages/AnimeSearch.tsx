// React와 useState를 가져옵니다. React는 웹 페이지를 만드는 도구이고, 
// useState는 페이지의 상태를 관리하는 기능입니다.
import React, { useState } from "react";

// SearchGrid라는 이름의 함수형 컴포넌트를 만듭니다. 
// 이것은 웹 페이지의 한 부분을 나타냅니다.
const SearchGrid: React.FC = () => {
  // useState를 사용해 검색어와 버튼 텍스트의 상태를 관리합니다.
  // 이 상태들은 사용자의 입력에 따라 변할 수 있습니다.
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [buttonText, setButtonText] = useState<string>("검색");

  // 검색 버튼을 눌렀을 때 실행될 함수입니다.
  const handleSearch = () => {
    console.log("검색어:", searchTerm);
  };

  // 여기서부터 실제로 화면에 보이는 부분을 만듭니다.
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pt-40 px-4">
        <div className="max-w-md mx-auto">
          {/* 페이지 상단의 제목 부분입니다. */}
          <h1 className="text-2xl font-bold mb-6 text-center">평가한 작품들로,<br></br> 취향에 꼭 맞는 애니를 찾아드릴게요!</h1>
          <div className="relative">
            {/* 검색 아이콘을 표시합니다. */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 text-[#F35815]"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* 검색어를 입력하는 입력 필드입니다. */}
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F7f7f7] focus:outline-none focus:ring-2 focus:ring-[#F35815] focus:border-transparent bg-[#F7f7f7] text-gray placeholder-white::placeholder"
              placeholder="검색 필터를 설정해주세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 검색 결과를 표시할 그리드 영역입니다. */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* 여기에 검색 결과를 표시할 수 있습니다 */}
        </div>
      </div>

      {/* 화면 하단에 고정된 검색 버튼입니다. */}
      <button
        onClick={handleSearch}
        className="fixed bottom-60 left-1/2 transform -translate-x-1/2 bg-[#F35815] text-white font-bold py-3 px-16 rounded-full shadow-lg hover:bg-[#D14704] transition duration-300 ease-in-out"
      >
        {/* 버튼의 텍스트를 변경할 수 있는 입력 필드입니다. */}
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="bg-transparent text-white text-center focus:outline-none w-full"
          onClick={(e) => e.stopPropagation()}
        />
      </button>

      {/* 페이지 하단의 풋터 영역입니다. */}
      <footer/>
    </div>
  );
};

// 이 컴포넌트를 다른 곳에서 사용할 수 있도록 내보냅니다.
export default SearchGrid;
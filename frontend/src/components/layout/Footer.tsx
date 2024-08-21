import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 h-[280px] pt-[60px] relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="w-1/3 pl-8">
            <a href="/" className="block mb-4">
              <img src="/path-to-your-logo.png" alt="앤픽 로고" className="h-8" />
            </a>
            <p className="text-gray-600 font-semibold mb-1">(주) 앤픽</p>
            <div className="text-m text-gray-600">
              <p>상호: 주식회사 앤픽 | 사업자등록번호: 000-00-000000</p>
              <p>주소: 서울특별시 강남구 역삼로 160</p>
              <p>이메일: contact@annpick.net</p>
            </div>
          </div>
          <div className="w-2/3 flex justify-end space-x-16 pr-8">
            <div>
              <h3 className="font-semibold mb-4">앤픽</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">소개</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">고객센터</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">공지사항</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">자주 묻는 질문</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">제휴 문의</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">이용 약관</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">개인정보 처리방침</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-gray-500">
          © {currentYear} 앤픽. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
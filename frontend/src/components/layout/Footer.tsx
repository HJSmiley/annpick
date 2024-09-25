import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // footer 전체 컨테이너
    // 모바일에서는 높이 자동 조정, 태블릿 이상에서는 280px 고정
    <footer className="bg-gray-100 h-auto md:h-[280px] pt-8 md:pt-[60px] relative">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between">
          {/* 로고 및 회사 정보 섹션 */}
          <div className="w-full md:w-1/3 pl-0 md:pl-12 mb-8 md:mb-0">
            {/* 로고 링크 */}
            <a href="/" className="block mb-4">
              <img
                src="/images/logo_annpick_dk.svg"
                alt="앤픽 로고"
                className="h-8"
              />
            </a>
            {/* 회사명 */}
            <p className="text-gray-600 font-semibold mb-1">(주) 앤픽</p>
            {/* 회사 정보 */}
            <div className="text-m text-gray-600">
              <p>상호: 주식회사 앤픽 | 사업자등록번호: 000-00-000000</p>
              <p>주소: 서울특별시 강남구 역삼로 160</p>
              <p>이메일: contact@annpick.net</p>
            </div>
          </div>
          {/* 메뉴 섹션 */}
          <div className="w-full md:w-2/3 flex flex-wrap md:flex-nowrap justify-between md:justify-end space-x-0 md:space-x-16 pr-0 md:pr-8">
            {/* 앤픽 메뉴 */}
            <div>
              <h3 className="font-semibold mb-4">앤픽</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    소개
                  </a>
                </li>
              </ul>
            </div>
            {/* 고객센터 메뉴 */}
            <div>
              <h3 className="font-semibold mb-4">고객센터</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    공지사항
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    자주 묻는 질문
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    제휴 문의
                  </a>
                </li>
              </ul>
            </div>
            {/* 서비스 메뉴 */}
            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    이용 약관
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    개인정보 처리방침
                  </a>
                </li>
                <li>
                  <a
                    href="/marketing-agreement"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    마케팅 및 알림 수신 동의
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* 저작권 정보 */}
      <div className="mt-8 md:mt-0 md:absolute md:bottom-4 left-0 right-0 text-center pb-4 md:pb-0">
        <p className="text-sm text-gray-500">
          © {currentYear} 앤픽. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

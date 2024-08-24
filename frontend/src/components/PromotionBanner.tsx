import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// 각 슬라이드의 데이터 구조를 정의
interface Slide {
  imageUrl: string;
  link: string;
  title: string;
}

const PromotionBanner: React.FC = () => {
  // 현재 표시 중인 슬라이드의 인덱스를 state로 관리
  const [currentSlide, setCurrentSlide] = useState(0);

  // 슬라이드 데이터 배열
  const slides: Slide[] = [
    { imageUrl: '/images/지브리1.png', link: '/promo4', title: '프로모션 4' },
    { imageUrl: '/images/지브리2.jpg', link: '/promo5', title: '프로모션 5' },
    { imageUrl: '/images/지브리7.jpg', link: '/promo6', title: '프로모션 6' },
    { imageUrl: '/images/지브리10.jpg', link: '/promo7', title: '프로모션 7' },
    { imageUrl: '/images/지브리16.jpg', link: '/promo8', title: '프로모션 8' },
  ];

  // 3초마다 자동으로 다음 슬라이드로 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    // 컴포넌트 언마운트 시 인터벌 클리어
    return () => clearInterval(interval);
  }, [slides.length]);

  // 특정 슬라이드로 직접 이동하는 함수
  const changeSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // 다음 슬라이드로 이동하는 함수
  // 주의: 이 함수는 이미 순환 기능을 포함하고 있습니다.
  // 마지막 슬라이드에서 다음으로 넘어가면 자동으로 첫 번째 슬라이드로 이동합니다.
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // 이전 슬라이드로 이동하는 함수
  // 주의: 이 함수는 이미 순환 기능을 포함하고 있습니다.
  // 첫 번째 슬라이드에서 이전으로 가면 자동으로 마지막 슬라이드로 이동합니다.
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="absolute inset-0"> {/* 배너 컨테이너: 부모 요소 전체를 채웁니다 */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 슬라이드 이미지 */}
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          {/* 그라데이션 오버레이: 이미지 위에 약간의 어두움을 추가합니다 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          {/* "보러가기" 버튼 */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <a
              href={slide.link}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg"
            >
              보러가기
            </a>
          </div>
        </div>
      ))}
      {/* 이전 슬라이드 버튼 */}
      {/* 버튼 위치 조정: left-4를 변경하여 좌우 위치 조정, top-1/2를 변경하여 상하 위치 조정 */}
      <button
        onClick={prevSlide}
        className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
      >
        <FaChevronLeft size={24} />
      </button>
      {/* 다음 슬라이드 버튼 */}
      {/* 버튼 위치 조정: right-4를 변경하여 좌우 위치 조정, top-1/2를 변경하여 상하 위치 조정 */}
      <button
        onClick={nextSlide}
        className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
      >
        <FaChevronRight size={24} />
      </button>
      {/* 슬라이드 인디케이터 (하단 점) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionBanner;
import React, { useState, useEffect, useCallback } from "react";

// Slide 인터페이스 정의: 각 슬라이드의 구조를 정의합니다.
interface Slide {
  imageUrl: string;
  link: string;
  title: string;
}

const PromotionBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const slides: Slide[] = [
    {
      imageUrl: "/images/지브리1.png",
      link: "https://laftel.net/search?keyword=%ED%8F%AC%EB%87%A8&modal=15694",
      title: "프로모션 4",
    },
    {
      imageUrl: "/images/지브리2.jpg",
      link: "https://laftel.net/search?keyword=%ED%86%A0%ED%86%A0%EB%A1%9C&modal=14943",
      title: "프로모션 5",
    },
    { imageUrl: "/images/Banner.jpg", link: "/promo1", title: "프로모션 1" },
    {
      imageUrl: "/images/지브리7.jpg",
      link: "https://laftel.net/search?keyword=%ED%95%98%EC%9A%B8&modal=15454",
      title: "프로모션 6",
    },
    {
      imageUrl: "/images/지브리10.jpg",
      link: "https://laftel.net/search?keyword=%ED%82%A4%ED%82%A4&modal=14995",
      title: "프로모션 7",
    },
    {
      imageUrl: "/images/지브리16.jpg",
      link: "https://laftel.net/search?keyword=%ED%86%A0%ED%86%A0%EB%A1%9C&modal=14943",
      title: "프로모션 8",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoSliding) {
      interval = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoSliding, nextSlide]);

  const changeSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 5000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoSliding(false);
    setTimeout(() => setIsAutoSliding(true), 5000);
  };

  const handleLinkClick = (link: string) => {
    // 자동 슬라이딩 멈춤
    setIsAutoSliding(false);

    // 링크로 이동
    window.open(link, "_blank");

    // 5초 후 자동 슬라이딩 재개
    setTimeout(() => setIsAutoSliding(true), 500);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <button
              onClick={() => handleLinkClick(slide.link)}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg"
            >
              보러가기
            </button>
          </div>
        </div>
      ))}
      {/* 이전 슬라이드 버튼 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 md:left-12 lg:left-16 top-1/2 transform -translate-y-1/2 bg-transparent transition-all duration-300 rounded-full p-2 group"
      >
        <img
          src="/images/ic_swipe_dk_prev-button.svg"
          alt="이전"
          className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] md:w-[3rem] md:h-[3rem] lg:w-[4rem] lg:h-[4rem] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[2px_2px_3px_rgba(0,0,0,0.3)]"
        />
      </button>
      {/* 다음 슬라이드 버튼 */}
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 md:right-12 lg:right-16 top-1/2 transform -translate-y-1/2 bg-transparent transition-all duration-300 rounded-full p-2 group"
      >
        <img
          src="/images/ic_swipe_dk_next-button.svg"
          alt="다음"
          className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] md:w-[3rem] md:h-[3rem] lg:w-[4rem] lg:h-[4rem] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[2px_2px_3px_rgba(0,0,0,0.3)]"
        />
      </button>
      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => changeSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionBanner;

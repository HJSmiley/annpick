import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Slide {
  imageUrl: string;
  link: string;
  title: string;
}

const PromotionBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    { imageUrl: '/images/지브리1.png', link: '/promo4', title: '프로모션 4' },
    { imageUrl: '/images/지브리2.jpg', link: '/promo5', title: '프로모션 5' },
    { imageUrl: '/images/지브리7.jpg', link: '/promo6', title: '프로모션 6' },
    { imageUrl: '/images/지브리10.jpg', link: '/promo7', title: '프로모션 7' },
    { imageUrl: '/images/지브리16.jpg', link: '/promo8', title: '프로모션 8' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <a
              href={slide.link}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300 shadow-lg"
            >
              보러가기
            </a>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300"
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
};

export default PromotionBanner;
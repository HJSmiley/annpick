import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 mt-16 text-center">
      <h1 className="text-5xl font-bold text-orange-500 mb-8">
        404 - Page Not Found
      </h1>
      <p className="text-xl mb-8">찾고 계신 페이지는 존재하지 않습니다.</p>
      <Link
        to="/"
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        메인으로 이동
      </Link>
    </div>
  );
};

export default NotFound;

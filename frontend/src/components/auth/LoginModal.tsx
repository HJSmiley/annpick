import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, state } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      login(token); // 로그인 처리
    }
  }, [navigate]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/${provider}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto z-50">
      <div className="bg-white rounded-lg relative max-w-sm w-full mx-4 my-8 p-10">
        {" "}
        <button
          onClick={handleClose}
          className="absolute top-4 right-6 text-2xl"
        >
          &times;
        </button>
        <div className="text-center mt-4 mb-16">
          {" "}
          <h6 className="text-sm mb-6">
            내 취향에 딱 맞는 애니메이션 추천 서비스
          </h6>
          <h1 className="text-3xl font-bold mb-10">앤픽</h1>{" "}
        </div>
        <div className="text-center">
          <img
            src="/images/kakao-login.svg"
            alt="카카오 로그인"
            className="w-full mb-3 cursor-pointer"
            onClick={() => handleSocialLogin("kakao")}
          />
          <img
            src="/images/naver-login.svg"
            alt="네이버 로그인"
            className="w-full mb-3 cursor-pointer"
            onClick={() => handleSocialLogin("naver")}
          />
          <img
            src="/images/google-login.svg"
            alt="구글 로그인"
            className="w-full cursor-pointer"
            onClick={() => handleSocialLogin("google")}
          />
        </div>
        {state.error && (
          <p className="text-red-500 text-center mt-4">{state.error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

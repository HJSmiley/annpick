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
      <div className="bg-white rounded-2xl relative max-w-sm w-full mx-4 my-8 p-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-6 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="text-center mt-4 mb-16">
          <h6 className="text-m mb-6 font-bold">
            <span className="text-orange-500">나만의 애니</span>를 만나보세요!
          </h6>
          <div className="flex justify-center">
            <img
              src="/images/logo_annpick_dk.svg"
              alt="앤픽 로고"
              className="w-[136px] h-[68px]"
            />
          </div>
        </div>
        <div className="text-center flex flex-col items-center">
          <img
            src="/images/kakao-login.svg"
            alt="카카오 로그인"
            className="w-full max-w-[250px] mb-3 cursor-pointer"
            onClick={() => handleSocialLogin("kakao")}
          />
          <img
            src="/images/naver-login.svg"
            alt="네이버 로그인"
            className="w-full max-w-[250px] mb-3 cursor-pointer"
            onClick={() => handleSocialLogin("naver")}
          />
          <img
            src="/images/google-login.svg"
            alt="구글 로그인"
            className="w-full max-w-[250px] cursor-pointer"
            onClick={() => handleSocialLogin("google")}
          />
        </div>
        {state.error && (
          <p className="text-red-500 text-center mt-4 font-bold">{state.error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
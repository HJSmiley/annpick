import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Draggable from 'react-draggable';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, state } = useAuth();

  useEffect(() => {
    if (isOpen && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isOpen, location.pathname, navigate]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate(-1);
  };

  const handleSocialLogin = async (provider: string) => {
    console.log(">>>>>>>");
    try {
      // 실제 로그인 로직을 구현해야 합니다.
      // 예를 들어, 백엔드에서 제공하는 소셜 로그인 엔드포인트를 호출합니다.
      // const response = await fetch(`http://3.36.94.230:8000/auth/${provider}`, {
      const response = await fetch(`http://localhost:8000/auth/${provider}`, {
        method: 'GET',
        credentials: 'include',
      });
      console.log(">>>>");
      console.log(response);
      const data = await response.json();
      
      if (response.ok) {
        await login(data.token);
        onClose();
        navigate('/');  // 로그인 성공 후 홈페이지로 이동
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      // 에러 처리 로직 (예: 에러 메시지 표시)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <Draggable handle=".modal-handle">
        <div className="bg-white rounded-lg relative max-w-md w-full mx-4 my-8">
          <div className="modal-handle cursor-move p-4 bg-gray-100 rounded-t-lg">
            <h2 className="text-center text-2xl font-bold">앤픽</h2>
          </div>
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <h6 className="text-center text-sm mb-4">내 취향에 딱 맞는 애니메이션 추천 서비스</h6>
            <button onClick={handleClose} className="absolute top-2 right-2 text-2xl">&times;</button>
            <button onClick={() => handleSocialLogin('kakao')} className="w-full bg-yellow-400 text-black py-3 rounded mb-3 font-semibold">
              카카오로 로그인
            </button>
            <button onClick={() => handleSocialLogin('naver')} className="w-full bg-green-500 text-white py-3 rounded mb-3 font-semibold">
              네이버 로그인
            </button>
            <button onClick={() => handleSocialLogin('google')} className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded font-semibold">
              구글 로그인
            </button>
            <div className="mt-8">
              <p>추가 정보나 약관 등을 여기에 넣을 수 있습니다.</p>
            </div>
          </div>
          {state.error && <p className="text-red-500 text-center mt-4">{state.error}</p>}
        </div>
      </Draggable>
    </div>
  );
};

export default LoginModal;
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Draggable from 'react-draggable';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
            <button className="w-full bg-yellow-400 text-black py-3 rounded mb-3 font-semibold">
              카카오로 로그인
            </button>
            <button className="w-full bg-green-500 text-white py-3 rounded mb-3 font-semibold">
              네이버 로그인
            </button>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded font-semibold">
              구글 로그인
            </button>
            {/* 추가 컨텐츠를 넣어 스크롤이 생기는지 테스트할 수 있습니다 */}
            <div className="mt-8">
              <p>추가 정보나 약관 등을 여기에 넣을 수 있습니다.</p>
              {/* 더 많은 컨텐츠... */}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default LoginModal;
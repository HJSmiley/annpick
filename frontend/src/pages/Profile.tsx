import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

const ProfileForm = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = {
        nickname: '익기10001',
        email: 'focus@naver.com',
        accountType: 'naver',
        profileImage: '/api/placeholder/100/100' // 플레이스홀더 이미지
      };
      setNickname(userData.nickname);
      setEmail(userData.email);
      setAccountType(userData.accountType);
      setProfileImage(userData.profileImage);
    };

    fetchUserData();
  }, []);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('프로필 저장:', { nickname, email, profileImage });
  };

  const handleWithdraw = () => {
    console.log('회원 탈퇴 요청');
  };

  const getAccountTypeMessage = () => {
    const messages = {
      naver: '네이버로 가입한 계정이에요',
      google: '구글로 가입한 계정이에요',
      kakao: '카카오로 가입한 계정이에요'
    };
    return messages[accountType] || '';
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <div 
        className="relative w-24 h-24 mb-6 rounded-full overflow-hidden cursor-pointer"
        onClick={handleImageClick}
      >
        <img 
          src={profileImage || '/api/placeholder/100/100'} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Camera size={24} className="text-white" />
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageChange} 
        className="hidden" 
        accept="image/*"
      />
      
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
          <p className="mt-1 text-sm text-gray-500">{getAccountTypeMessage()}</p>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-md hover:from-red-600 hover:to-orange-600 transition duration-300"
        >
          저장
        </button>
      </form>

      <div className="w-full mt-8 flex justify-end">
        <button
          onClick={handleWithdraw}
          className="text-sm text-gray-500 hover:text-gray-700 transition duration-300"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
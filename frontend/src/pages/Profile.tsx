import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
  const { state, logout } = useAuth();

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (!state.isAuthenticated) {
    return <div>Please log in to view this page.</div>;
  }

  const handleLogout = () => {
    logout(); // 로그아웃 처리
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-4">
        반갑습니다, {state.user?.nickname}님!
      </h1>
      <p className="text-xl mb-4">이메일: {state.user?.email}</p>
      <button
        onClick={handleLogout}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        로그아웃
      </button>
    </div>
  );
};

export default Profile;

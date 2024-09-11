import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EvaluationPage: React.FC = () => {
  const { login, state } = useAuth(); // AuthContext에서 login 함수와 state 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 JWT 토큰을 가져옴
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      login(token); // JWT 토큰으로 로그인 처리
    } else if (!state.isAuthenticated && !state.loading) {
      // 인증되지 않고 로딩이 끝난 경우에만 리다이렉트
      navigate("/login");
    }
  }, [login, state.isAuthenticated, state.loading, navigate]);

  if (!state.isAuthenticated) {
    return <div>로딩 중...</div>; // 로그인 상태가 확인될 때까지 로딩 메시지 출력
  }

  return (
    <div>
      <h1>애니메이션 평가 페이지</h1>
      {/* 평가 컴포넌트 */}
    </div>
  );
};

export default EvaluationPage;

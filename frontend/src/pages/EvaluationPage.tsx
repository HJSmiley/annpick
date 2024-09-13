import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import EvalSearchGrid from "../components/search/EvaluationSearchGrid";
import AnimeCard from "../components/anime/AnimeCard";

const EvaluationPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, state } = useAuth(); // AuthContext에서 login 함수와 state 가져오기
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]); // 추천 결과 상태
  const [showRecommendations, setShowRecommendations] = useState(false); // 추천 결과 표시 여부

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

  const handleCompleteEvaluation = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("추천 생성 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setRecommendations(data.recommendedAnimes); // 추천 결과 상태에 저장
      setShowRecommendations(true); // 추천 결과 표시
    } catch (error) {
      console.error("추천 생성 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col h-auto">
      {/* 추천 결과가 없을 때는 검색 모듈, 있을 때는 추천 결과 출력 */}
      {!showRecommendations ? (
        <EvalSearchGrid />
      ) : (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {recommendations.length > 0 ? (
            recommendations.map((anime) => (
              <AnimeCard
                key={anime.anime_id}
                {...anime}
                onRatingClick={() => {}}
                isModalOpen={false}
              />
            ))
          ) : (
            <div className="text-center w-full">추천 결과가 없습니다.</div>
          )}
        </div>
      )}

      {/* 플로팅 평가 완료 버튼 (하단 중앙 정렬, 너비 설정) */}
      {!showRecommendations && (
        <div className="fixed bottom-16 left-0 right-0 flex justify-center z-50">
          <button
            onClick={handleCompleteEvaluation}
            className="bg-[#F35815] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-[#D14704] transition duration-300 ease-in-out w-full max-w-sm"
            style={{
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // 플로팅 느낌을 주기 위한 그림자
            }}
            disabled={loading} // 추천 처리 중에는 버튼 비활성화
          >
            {loading ? "처리 중..." : "평가 완료"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EvaluationPage;

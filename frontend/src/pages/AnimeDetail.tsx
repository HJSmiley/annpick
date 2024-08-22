import React from 'react';
import { useParams } from 'react-router-dom';

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 여기에서 애니메이션 상세 정보를 불러오는 로직을 구현합니다.
  // 예를 들어, API 호출이나 상태 관리 라이브러리를 사용할 수 있습니다.

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
      <h1 className="text-3xl font-bold mb-4">애니메이션 상세 정보</h1>
      <p>애니메이션 ID: {id}</p>
      {/* 여기에 더 많은 상세 정보를 표시합니다 */}
    </div>
  );
};

export default AnimeDetail;
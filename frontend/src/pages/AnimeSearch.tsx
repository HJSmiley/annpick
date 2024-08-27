import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface AnimeItem {
  id: number;
  title: string;
  // 다른 필요한 속성들 추가
}

const AnimeSearch: React.FC = () => {
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreData = () => {
    // API에서 추가 데이터를 가져오는 로직
    // 예시:
    // const newItems: AnimeItem[] = await fetchAnimeItems();
    // setItems([...items, ...newItems]);
    // if (newItems.length === 0) setHasMore(false);
  };

  useEffect(() => {
    fetchMoreData(); // 초기 데이터 로드
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
      <h1 className="text-3xl font-bold mb-4">애니검색</h1>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default AnimeSearch;
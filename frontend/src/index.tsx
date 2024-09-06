import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/globals.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AnimeProvider } from './contexts/AnimeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AnimeProvider>
      <App />
    </AnimeProvider>
  </React.StrictMode>
);

reportWebVitals();


// // React 라이브러리 불러오기
// import React from 'react';
// import ReactDOM from 'react-dom/client';

// // CSS 스타일 파일 불러오기
// import './index.css';
// import './styles/globals.css';

// // 메인 App 컴포넌트 불러오기
// import App from './App';

// // 웹 성능 측정 도구 불러오기
// import reportWebVitals from './reportWebVitals';

// // AnimeProvider 컨텍스트 불러오기 (애니메이션 관련 상태 관리용)
// import { AnimeProvider } from './contexts/AnimeContext';

// // HTML에서 'root' id를 가진 요소를 찾아 React 앱의 시작점으로 설정
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// // React 앱 렌더링
// root.render(
//   // 엄격 모드 활성화 (개발 시 잠재적 문제 감지)
//   <React.StrictMode>
//     // AnimeProvider로 전체 앱 감싸기 (애니메이션 관련 상태 제공)
//     <AnimeProvider>
//       // 메인 App 컴포넌트 렌더링
//       <App />
//     </AnimeProvider>
//   </React.StrictMode>
// );

// // 웹 성능 측정 실행
// reportWebVitals();
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './components/layout/Header';
// import PromotionBanner from './components/PromotionBanner';
// import Footer from './components/layout/Footer';
// import LoginModal from './components/auth/LoginModal';
// import AnimeSearch from './components/anime/AnimeSearch';
// import AnimeDetail from './pages/AnimeDetail';
// import AnimeList from './components/anime/AnimeList';

// const Home: React.FC = () => {
//   const dummyAnimes = [
//     { id: 1, title: "도망을 잘 치는 던컨", image: "https://via.placeholder.com/150" },
//     { id: 2, title: "전생했더니 슬라임이었단 건에 대하여", image: "https://via.placeholder.com/150" },
//     { id: 3, title: "ATRI -My Dear Moments-", image: "https://via.placeholder.com/150" },
//     { id: 4, title: "최애의 아이", image: "https://via.placeholder.com/150" },
//     { id: 5, title: "이세계 노예 꼬붕", image: "https://via.placeholder.com/150" },
//   ];

//   return (
//     <>
//       <PromotionBanner />
//       <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8">
//         <h1 className="text-3xl font-bold mb-4">전 세계가 주목한 인기 Top 10</h1>
//         <AnimeList animes={dummyAnimes} />
//       </div>
//     </>
//   );
// };

// const Login: React.FC = () => <h1>로그인/가입</h1>;

// const App: React.FC = () => {
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

//   const openLoginModal = () => setIsLoginModalOpen(true);
//   const closeLoginModal = () => setIsLoginModalOpen(false);

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Header openLoginModal={openLoginModal} />
//         <main className="flex-grow pt-16">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/anime-search" element={<AnimeSearch/>} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/anime/:id" element={<AnimeDetail />} />
//           </Routes>
//         </main>
//         <Footer />
//         <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
//       </div>
//     </Router>
//   );
// };

// export default App;

export {};

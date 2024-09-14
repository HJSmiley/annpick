// src/pages/Profile.tsx
import React, { useState, useRef, ReactNode } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-10 mt-6 px-5">{title}</h3>
        {children}
        <div className="flex justify-end mt-4"></div>
      </div>
    </div>
  );
};

const ProfileForm = () => {
  const { state, login, logout, refreshAccessToken } = useAuth();
  const [nickname, setNickname] = useState(state.user?.nickname || "");
  const [originalNickname, setOriginalNickname] = useState(
    state.user?.nickname || ""
  );
  const [profileImage, setProfileImage] = useState(
    state.user?.profile_img || "/images/default-profile.png"
  );
  const [withdrawalReason, setWithdrawalReason] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // Access Token 유효성 검사 함수
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      // decoded.exp가 정의되지 않은 경우 false를 반환하도록 처리
      return decoded.exp !== undefined && decoded.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  };

  // 프로필 업데이트 처리 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nickname.length < 2) {
      setErrorMessage("닉네임은 2자 이상 입력해주세요.");
      setIsErrorModalOpen(true);
      return;
    }

    // 닉네임 또는 프로필 이미지 변경 여부 확인
    if (nickname !== originalNickname || fileInputRef.current?.files?.[0]) {
      try {
        const formData = new FormData();

        // 닉네임 변경 시 추가
        if (nickname !== originalNickname) {
          formData.append("nickname", nickname);
        }

        // 프로필 이미지 변경 시 추가
        if (fileInputRef.current?.files?.[0]) {
          formData.append("profileImage", fileInputRef.current.files[0]);
        }

        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/update`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${state.token}`, // JWT 토큰 포함
            },
            body: formData, // FormData 전송
          }
        );

        if (response.ok) {
          const data = await response.json();

          // 새로운 JWT 토큰을 AuthContext에 업데이트
          login(data.token); // 새로운 JWT 토큰으로 상태 업데이트

          // 페이지 새로고침
          window.location.reload();
        } else if (response.status === 401) {
          // Access Token 만료 시 갱신
          await refreshAccessToken();
        } else {
          throw new Error("프로필 업데이트에 실패했습니다.");
        }
      } catch (error) {
        console.error("프로필 업데이트 중 오류 발생:", error);
        setErrorMessage("프로필 업데이트에 실패했습니다. 다시 시도해 주세요.");
        setIsErrorModalOpen(true);
      }
    } else {
      setErrorMessage("변경 사항이 없습니다.");
      setIsErrorModalOpen(true);
    }
  };

  // 회원 탈퇴 처리 함수
  const handleWithdraw = async () => {
    try {
      if (!state.token || !isTokenValid(state.token)) {
        await refreshAccessToken();
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/profile/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({ reason: withdrawalReason }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setErrorMessage("회원 탈퇴가 완료되었습니다.");
        setIsErrorModalOpen(true);
        logout();
      } else if (response.status === 401) {
        await refreshAccessToken();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      setErrorMessage("회원 탈퇴에 실패했습니다. 다시 시도해 주세요.");
      setIsErrorModalOpen(true);
    }
    setIsWithdrawModalOpen(false);
  };

  // 프로필 이미지 클릭 시 파일 선택기 열기
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 프로필 이미지 변경 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-48 mb-80 border border-gray-200">
      {/* 프로필 이미지 */}
      <div
        className="relative w-24 h-24 mb-6 rounded-full overflow-hidden cursor-pointer border border-gray-200"
        onClick={handleImageClick}
      >
        <img
          src={profileImage}
          alt="프로필"
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

      {/* 프로필 업데이트 폼 */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* 닉네임 입력 */}
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            닉네임 <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="mt-1 text-sm text-gray-500">2자 이상 입력해 주세요.</p>
        </div>

        {/* 이메일 표시 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            이메일 <span className="text-orange-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={state.user?.email || ""}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            네이버로 가입한 계정이에요.
          </p>
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-md hover:from-red-600 hover:to-orange-600 transition duration-300"
        >
          저장
        </button>
      </form>

      {/* 탈퇴하기 버튼 */}
      <div className="w-full mt-8 flex justify-end">
        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="text-sm text-gray-500 hover:text-gray-700 transition duration-300"
        >
          탈퇴하기
        </button>
      </div>

      {/* 탈퇴 모달 */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="정말 떠나시겠어요?"
      >
        <div className="px-5 pt-50 ">
          <p className="mb-2 mt-2">
            탈퇴하시면 그동안 등록하신 애니메이션 평가를 비롯한
            <br />
            <span className="text-orange-500 font-bold text-base">
              모든 활동 정보가 사라지며 복구할 수 없어요.
            </span>
            😢
          </p>
          <br />
          <div className="mb-10">
            <label
              htmlFor="withdrawalReason"
              className="block text-lg text-gray-700 mb-2 font-bold"
            >
              혹시 불편했던 점이 있었다면 알려주세요.
              <br />
            </label>
            <p className="mb-4 text-sm">더 나은 서비스를 위해 노력할게요!</p>
            <div className="relative">
              <select
                id="withdrawalReason"
                value={withdrawalReason}
                onChange={(e) => setWithdrawalReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-base appearance-none "
              >
                <option value="" className="text-sm">
                  선택
                </option>
                <option value="사용 빈도가 낮음" className="text-sm">
                  사용 빈도가 낮음
                </option>
                <option value="원하는 서비스를 찾지 못함" className="text-sm">
                  원하는 서비스를 찾지 못함
                </option>
                <option value="컨텐츠가 맘에 들지 않음" className="text-sm">
                  컨텐츠가 맘에 들지 않음
                </option>
                <option value="기타" className="text-sm">
                  기타
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg
                  className="fill-current h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex w-full space-x-4">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="flex-1 py-2.5 px-3 bg-gray-200 text-gray-800 font-semibold rounded-3xl hover:scale-105 transition duration-300 text-lg"
            >
              취소
            </button>
            <button
              onClick={handleWithdraw}
              className="flex-1 py-2.5 px-3 bg-orange-600 text-white font-semibold rounded-3xl hover:scale-105 transition duration-300 text-lg"
            >
              탈퇴
            </button>
          </div>
        </div>
      </Modal>

      {/* 에러 모달 */}
      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="알림"
      >
        <p>{errorMessage}</p>
      </Modal>
    </div>
  );
};

export default ProfileForm;

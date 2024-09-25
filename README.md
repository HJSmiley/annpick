# AnnPick

> 취향을 기반으로 애니메이션을 추천해 드립니다.
> <br />

## 프로젝트 개요

### 1. 프로젝트 주제

- 애니메이션 취향을 분석하고 큐레이팅하는 서비스

### 2. 메인/서브 기능

```markdown
1. Recommendation MVP : 취향 분석 및 추천 기능
2. Information MVP : 애니메이션 정보 제공
3. Search MVP : 제목, 장르, 태그로 애니 검색
4. Rating MVP : 평점 저장 및 북마크(픽하기) 기능
5. User MVP : 로그인, 회원가입, 회원정보 수정, 회원 탈퇴
```

### 3. 프로젝트 팀원

| 이름   | 역할        |
| ------ | ----------- |
| 김서정 | 팀장 / 기획 |
| 최윤석 | 기획        |
| 김수현 | 프론트엔드  |
| 정혜주 | 풀스택      |

---

## 프로젝트 구조

### 아키텍처

![architecture](./docs/architecture.png)

### ERD

![ERD](./docs/erd.png)

### 디렉토리 구조

<details>
<summary>Front-end</summary>

```
frontend
 ┣ node_modules
 ┣ public
 ┃ ┣ images
 ┃ ┣ favicon.ico
 ┃ ┗ index.html
 ┣ src
 ┃ ┣ assets
 ┃ ┃ ┣ font
 ┃ ┃ ┗ icons
 ┃ ┣ components
 ┃ ┃ ┣ anime
 ┃ ┃ ┃ ┣ AnimeCard.tsx
 ┃ ┃ ┃ ┗ AnimeList.tsx
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┗ LoginModal.tsx
 ┃ ┃ ┣ common
 ┃ ┃ ┃ ┣ LoadingSpinner.css
 ┃ ┃ ┃ ┣ LoadingSpinner.tsx
 ┃ ┃ ┃ ┗ SwipeButton.tsx
 ┃ ┃ ┣ error
 ┃ ┃ ┃ ┗ ErrorBoundary.tsx
 ┃ ┃ ┣ layout
 ┃ ┃ ┃ ┣ Footer.tsx
 ┃ ┃ ┃ ┗ Header.tsx
 ┃ ┃ ┣ mypage
 ┃ ┃ ┃ ┗ AvatarDropdown.tsx
 ┃ ┃ ┣ promotion
 ┃ ┃ ┃ ┗ PromotionBanner.tsx
 ┃ ┃ ┣ review
 ┃ ┃ ┃ ┗ .gitkeep
 ┃ ┃ ┗ search
 ┃ ┃ ┃ ┣ EvaluationSearchGrid.tsx
 ┃ ┃ ┃ ┣ RecentSearches.tsx
 ┃ ┃ ┃ ┣ SearchFilters.tsx
 ┃ ┃ ┃ ┗ SearchSuggestions.tsx
 ┃ ┣ config
 ┃ ┃ ┣ constants.ts
 ┃ ┃ ┣ react-app-env.d.ts
 ┃ ┃ ┣ reportWebVitals.ts
 ┃ ┃ ┣ sections.ts
 ┃ ┃ ┣ setupTests.ts
 ┃ ┃ ┗ TagCategories.ts
 ┃ ┣ contexts
 ┃ ┃ ┣ AnimeContext.tsx
 ┃ ┃ ┗ AuthContext.tsx
 ┃ ┣ pages
 ┃ ┃ ┣ anime
 ┃ ┃ ┃ ┣ AnimeDetail.tsx
 ┃ ┃ ┃ ┗ AnimeSearch.tsx
 ┃ ┃ ┣ profile
 ┃ ┃ ┃ ┣ MyPicks.tsx
 ┃ ┃ ┃ ┣ MyRatings.tsx
 ┃ ┃ ┃ ┗ Profile.tsx
 ┃ ┃ ┣ terms
 ┃ ┃ ┃ ┣ MarketingAgreement.tsx
 ┃ ┃ ┃ ┣ PrivacyPolicy.tsx
 ┃ ┃ ┃ ┗ TermsOfService.tsx
 ┃ ┃ ┣ EvaluationPage.tsx
 ┃ ┃ ┣ Home.tsx
 ┃ ┃ ┗ NotFound.tsx
 ┃ ┣ service
 ┃ ┃ ┣ SearchHooks.ts
 ┃ ┃ ┣ SearchUtils.ts
 ┃ ┃ ┗ useHover.ts
 ┃ ┣ styles
 ┃ ┃ ┣ globals.css
 ┃ ┃ ┗ tailwind.css
 ┃ ┣ types
 ┃ ┃ ┣ anime.ts
 ┃ ┃ ┗ auth.ts
 ┃ ┣ App.css
 ┃ ┣ App.tsx
 ┃ ┣ index.css
 ┃ ┗ index.tsx
 ┣ .env
 ┣ package-lock.json
 ┣ package.json
 ┣ tailwind.config.js
 ┗ tsconfig.json
```

</details>
<br>
<details>
<summary>Back-end</summary>

```
backend
 ┣ data
 ┃ ┣ anime_data.json
 ┃ ┗ meilisearch.service
 ┣ scripts
 ┃ ┣ deleteNonTVAnimes
 ┃ ┣ populateRecommendationClusters.js
 ┃ ┣ saveAnimeData.js
 ┃ ┣ translateGenres.js
 ┃ ┗ translateTags.js
 ┣ src
 ┃ ┣ config
 ┃ ┃ ┣ appConfig.js
 ┃ ┃ ┣ authConfig.js
 ┃ ┃ ┣ config.js
 ┃ ┃ ┣ dbConfig.js
 ┃ ┃ ┣ meiliConfig.js
 ┃ ┃ ┗ swaggerConfig.js
 ┃ ┣ controllers
 ┃ ┃ ┣ animeController.js
 ┃ ┃ ┣ authController.js
 ┃ ┃ ┣ pickController.js
 ┃ ┃ ┣ recommendController.js
 ┃ ┃ ┗ userController.js
 ┃ ┣ middleware
 ┃ ┃ ┣ authMiddleware.js
 ┃ ┃ ┗ multer.js
 ┃ ┣ models
 ┃ ┃ ┣ AniGenre.js
 ┃ ┃ ┣ AnilistAnime.js
 ┃ ┃ ┣ Anime.js
 ┃ ┃ ┣ AniStaff.js
 ┃ ┃ ┣ AniTag.js
 ┃ ┃ ┣ associations.js
 ┃ ┃ ┣ Genre.js
 ┃ ┃ ┣ index.js
 ┃ ┃ ┣ RecommendationCluster.js
 ┃ ┃ ┣ Review.js
 ┃ ┃ ┣ Staff.js
 ┃ ┃ ┣ Tag.js
 ┃ ┃ ┣ User.js
 ┃ ┃ ┣ UserClusterPreference.js
 ┃ ┃ ┣ UserRatedAnime.js
 ┃ ┃ ┗ WithdrawnUser.js
 ┃ ┣ routes
 ┃ ┃ ┣ animeRoutes.js
 ┃ ┃ ┣ authRoutes.js
 ┃ ┃ ┣ pickRoutes.js
 ┃ ┃ ┣ recommendRoutes.js
 ┃ ┃ ┗ userRoutes.js
 ┃ ┣ services
 ┃ ┃ ┣ animeService.js
 ┃ ┃ ┣ authService.js
 ┃ ┃ ┣ pickService.js
 ┃ ┃ ┣ recommendService.js
 ┃ ┃ ┗ s3Service.js
 ┃ ┣ utils
 ┃ ┃ ┣ animeFormatting.js
 ┃ ┃ ┗ animeTranslate.js
 ┃ ┣ app.js
 ┃ ┗ server.js
 ┣ .env
 ┣ package-lock.json
 ┗ package.json
```

</details>

## 프로젝트 환경

### 1. 기술 스택

<details>
<summary>Front-end</summary>

- 프레임워크 및 라이브러리
  - `React` : 프론트엔드 UI 라이브러리
  - `React Router DOM` : 클라이언트 사이드 라우팅
  - `Axios` : HTTP 요청 처리
  - `Framer Motion` : 애니메이션 라이브러리
  - `React Icons` : 아이콘 컴포넌트
  - `React Markdown` : 마크다운 렌더링
  - `JWT Decode` : JWT 토큰 디코딩

* 스타일링
  - `Tailwind CSS` : 유틸리티 기반의 CSS 프레임워크
  - `DaisyUI` : Tailwind와 함께 사용하는 UI 컴포넌트 라이브러리
  - `@tailwindcss/forms` : Tailwind의 form 스타일링 확장
  - `@tailwindcss/typography` : 타이포그래피 확장(Markdown 등)
* 빌드 및 개발 도구
  - `npm` : 패키지 관리 도구로, 의존성 설치 및 스크립트 실행을 관리
  - `TypeScript` : 타입스크립트 사용

</details>
<br>
<details>
<summary>Back-end</summary>

- 서버 프레임워크
  - `Express` : 백엔드 애플리케이션의 주요 서버 프레임워크
- 인증 및 세션 관리
  - `passport` : 인증 미들웨어
  - `passport-naver` : 네이버 인증 지원
  - `passport-jwt` : JWT 토큰 인증 처리
  - `jsonwebtoken` : JWT 토큰 생성 및 검증
  - `express-session` : 세션 관리
- 데이터베이스 및 ORM
  - `MySQL` : 데이터베이스로 사용
  - `sequelize` : MySQL과의 상호작용을 위한 ORM (Object-Relational Mapping)
  - `sequelize-cli` : Sequelize 데이터 마이그레이션 도구
- 파일 업로드 및 파싱
  - `multer` : 파일 업로드 처리 미들웨어
  - `body-parser` : 요청 본문 파싱
  - `cookie-parser` : 쿠키 파싱
- 검색 엔진
  - `meilisearch` : 검색 기능 구현
- API 문서화
  - `swagger-jsdoc` : Swagger 문서 생성
  - `swagger-ui-express` : Swagger UI를 Express에서 제공
- 환경 변수 관리
  - `dotenv` : 환경 변수 관리
- 클라우드 서비스
  - `aws-sdk` : AWS 서비스와 상호작용
- HTTP 요청 처리
  - `axios` : HTTP 클라이언트 라이브러리

</details>

### 2. 개발 환경

```
- Node.js : v20.17.0
- npm : v10.8.2
- git : v2.45.2
- OS : Windows_NT x64
- IDE : VSCode v1.90.2
```

### 3. 배포 환경

```
- 서버(WAS) : AWS EC2 (Express API 서버)
- 검색 서버 : AWS EC2 (MeiliSearch)
- 데이터베이스 : AWS RDS (MySQL)
- 스토리지 및 CDN : AWS S3, CloudFront
```

## 개발 문서

[설치 및 실행](/docs/installation.md)

[WBS](https://docs.google.com/spreadsheets/d/10T6W1k2AkRwmw0QwMH2H5F0rfvRBhQ6vu44VWWv_7-U/edit?usp=sharing)

[테이블 정의서](https://docs.google.com/spreadsheets/d/1abxsR-jKPNRI4qfe9dXE0NrXWX4AAo1sC5M0-JlBaVM/edit?gid=629411476#gid=629411476)

[API 명세서](http://43.203.213.200/api-docs/)

[팀 노션](https://www.notion.so/adapterz/3-8675874bc9ea4b4bb8e6964eda02a429?pvs=4)

## 개발 규칙

### 1. 코드 컨벤션

- 텍스트 작성 기본 설정: VSCode Prettier Extension 사용

#### Front-end

- 변수, 함수 camelCase 사용, Class는 PascalCase 사용
- 문자열에선 기본적으로 `""`를 씀 (특수한 경우 제외)

#### Back-end

- 변수, 함수 camelCase 사용, Class는 PascalCase 사용
- 파일 구조는 MVC 패턴 따름
- 문자열에선 기본적으로 `""`를 씀 (특수한 경우 제외)

### 2. Branch 전략(GitFlow)

- **main**: 제품으로 출시되는 브랜치
- **develop**: 개발 브랜치로 개발자들이 이 브랜치를 기준으로 각자 작업한 기능들을 merge
- **feature**: 단위 기능을 개발하는 브랜치로 기능 개발이 완료되면 develop 브랜치에 merge
- **release**: 배포를 위해 main 브랜치로 보내기 전 먼저 QA(품질검사)를 하기 위한 브랜치
- **hotfix**: main 브랜치로 배포를 했는데 버그가 생겼을 때 긴급 수정하는 브랜치

<details>
<summary>GitFlow 과정</summary>

```
- master 브랜치에서 develop 브랜치를 분기합니다.
- 개발자들은 develop 브랜치에 자유롭게 커밋을 합니다.
- 기능 구현이 있는 경우 develop 브랜치에서 feature-* 브랜치를 분기합니다.
- 배포를 준비하기 위해 develop 브랜치에서 release-* 브랜치를 분기합니다.
- 테스트를 진행하면서 발생하는 버그 수정은 release-* 브랜치에 직접 반영합니다.
- 테스트가 완료되면 release 브랜치를 master와 develop에 merge합니다.
```

</details>

### 3. 커밋 메시지

- `type(타입): title(제목)`
- 제목 첫글자는 대문자로(EN)
- 제목 끝에 마침표 등 특수문자 X
- 제목은 명령문으로 사용, 과거형 X
- `type`은 아래 명시된 형태로

| Type 키워드  | 사용 시점                                                              |
| ------------ | ---------------------------------------------------------------------- |
| **feat**     | 새로운 기능 추가                                                       |
| **fix**      | 버그 수정                                                              |
| **test**     | 기능 테스트                                                            |
| **docs**     | 문서 수정                                                              |
| **style**    | 코드 스타일 변경 (코드 포매팅, 세미콜론 누락 등) 기능 수정이 없는 경우 |
| **design**   | 사용자 UI 디자인 변경 (CSS 등)                                         |
| **test**     | 테스트 코드, 리팩토링 테스트 코드 추가                                 |
| **refactor** | 코드 리팩토링                                                          |
| **build**    | 빌드 파일 수정                                                         |
| **perf**     | 성능 개선                                                              |
| **chore**    | 빌드 업무 수정, 패키지 매니저 수정 (gitignore 수정 등)                 |
| **rename**   | 파일 혹은 폴더명을 수정만 한 경우                                      |
| **remove**   | 파일을 삭제만 한 경우                                                  |

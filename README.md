# Snippet-Front (스니펫 프론트엔드)

✨ **Snippet** 프로젝트의 사용자 인터페이스를 제공하는 프론트엔드 웹 애플리케이션입니다.
시각적으로 돋보이는 디자인과 유려한 애니메이션으로 사용자에게 직관적인 스니펫 탐색 경험을 제공합니다.

## ✨ 주요 기능

*   **인터랙티브 스와이프 UI**: Framer Motion을 활용한 부드러운 카드 스와이프 제스처 인터페이스.
*   **반응형 웹 디자인**: 모바일과 데스크톱 환경 모두에 최적화된 레이아웃.
*   **Server-Side Rendering (SSR)**: Next.js 기반으로 빠른 초기 로딩과 향상된 SEO 경험 제공.

## 🛠️ 기술 스택 (Tech Stack)

*   **언어**: TypeScript
*   **프레임워크**: Next.js 16.1 (App Router 기반)
*   **라이브러리**: React 19
*   **스타일링**: Tailwind CSS 4
*   **애니메이션**: Framer Motion
*   **HTTP 클라이언트**: Axios

## 🚀 시작하기 (Getting Started)

### 요구 사항

*   Node.js 20 버전 이상
*   패키지 관리자 (npm 등)

### 로컬 환경에서 실행

1.  **의존성 설치**:
    ```bash
    # 저장소 클론 후 front 디렉토리로 이동
    cd front

    # 패키지 설치
    npm install
    ```
2.  **환경 변수 설정**: 루트 경로에 `.env.local` 파일을 생성하고 서버 API URL(`NEXT_PUBLIC_API_URL`) 등 필요한 환경 변수를 세팅합니다.
3.  **개발 서버 시작**:
    ```bash
    npm run dev
    ```
4.  브라우저에서 `http://localhost:3000`에 접속하여 확인할 수 있습니다.

## 📂 프로젝트 구조

*   `src/components/`: 재사용 가능한 UI 컴포넌트 (`SwipeCard` 등)
*   `src/app/`: Next.js 라우팅용 페이지
*   `src/types/`: 백엔드 DTO와 연동되는 TypeScript 타입 정의
*   `src/lib/`: API 호출용 유틸리티 및 Axios 설정

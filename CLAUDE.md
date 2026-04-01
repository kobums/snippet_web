# Snippet Web Frontend (Next.js)

## 기술 스택
- **Next.js 16.1.6** (App Router) / React 19.2.3 / TypeScript 5
- **Tailwind CSS 4** + Liquid Glass 디자인 시스템
- **Framer Motion 12.34.3** 스와이프 제스처
- **Zustand 5.0.11** 상태 관리
- **Axios 1.13.6** HTTP 클라이언트
- **Recharts 3.7.0** 차트 시각화
- **react-hot-toast 2.6.0** 토스트 알림

## 디렉토리 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (AuthProvider)
│   ├── page.tsx            # 랜딩 페이지
│   ├── globals.css         # Liquid Glass 디자인 시스템
│   ├── snippet/            # /snippet - 스와이프
│   ├── archive/            # /archive - 아카이브
│   ├── dashboard/          # /dashboard, /dashboard/stats
│   ├── books/              # /books/have, /books/borrow, /books/wishlist
│   ├── record/             # /record/snippet, /record/diary, /record/review
│   ├── login/, register/   # 인증
│   ├── mypage/             # 마이페이지
│   └── privacy/            # 개인정보처리방침
├── components/
│   ├── auth/               # AuthProvider, LoginForm, RegisterForm
│   ├── layout/             # AppShell, Sidebar, BottomNav
│   ├── swipe/              # SwipeCard, SwipeStack
│   ├── modal/              # BookSearchModal, BookRecordModal
│   ├── dashboard/          # 대시보드 관련 (stats/, record/ 하위)
│   ├── library/            # BookLibrary, ReadingBooks, WishlistBooks 등
│   ├── pages/              # OwnedBooksPage, BorrowedBooksPage 등
│   ├── common/             # SwipeableTabs
│   └── ui/                 # 공통 UI (EmptyState, skeleton/ 등)
├── stores/
│   ├── useBookStore.ts     # 도서 상태 (Optimistic UI, 임시 ID)
│   └── useUIStore.ts       # UI 상태 (모달 제어)
├── types/
│   ├── snippet.ts          # SnippetCard, SnippetArchive
│   ├── library.ts          # UserBookDto, BookSearchDto
│   ├── record.ts           # RecordDto, RecordAddRequestDto
│   ├── stats.ts            # MonthlyStatsDto, YearlyStatsDto 등
│   └── auth.ts             # LoginParams, RegisterParams
├── lib/
│   ├── api.ts              # Axios 인스턴스 + snippet API
│   ├── bookApi.ts          # /books/* API
│   ├── userBookApi.ts      # /userbooks/* API
│   ├── recordApi.ts        # /records/* API
│   ├── statsApi.ts         # /userbooks/stats/* API
│   ├── constants.ts        # STATUS_LABELS, TYPE_LABELS
│   └── util.ts             # formatDate, calcProgress 등
├── hooks/
│   ├── useArchive.ts       # localStorage 기반 아카이브
│   └── useMediaQuery.ts    # 반응형 breakpoint
├── core/                   # Clean Architecture (Auth)
│   ├── domain/             # User 엔티티, AuthRepository 인터페이스
│   ├── usecases/           # LoginUseCase, RegisterUseCase
│   └── di/                 # 의존성 주입
├── data/                   # Auth 데이터 레이어
│   ├── datasources/        # AuthDataSource
│   └── repositories/       # AuthRepositoryImpl
└── middleware.ts           # 인증 미들웨어
```

## 디자인 시스템 (Liquid Glass)
`globals.css`에 정의된 CSS 변수 기반 디자인 시스템:
- `.liquid-card` - 스와이프 카드 (specular highlight)
- `.liquid-panel` - 범용 글래스 패널
- `.liquid-nav` - 탭 바
- `.liquid-badge` - 배지
- `.liquid-button` - 버튼
- `.bg-liquid` - 애니메이션 그라데이션 배경

## 주요 패턴
- **Optimistic UI**: useBookStore에서 임시 ID로 즉각 반영
- **Infinite Scroll**: BookSearchModal에서 IntersectionObserver 사용
- **Clean Architecture**: Auth 레이어에 domain/data/di 분리
- **localStorage**: 스니펫 아카이브 (likedIds, seenIds) 저장

## 환경변수
- `NEXT_PUBLIC_API_URL` - API 베이스 URL

## 컨벤션
- Path alias: `@/*` → `./src/*`
- API URL에 하이픈(-) 사용 금지
- 서버 포트: 9008 (Docker)

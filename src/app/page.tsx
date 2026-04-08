"use client"

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-dvh flex flex-col content-layer">
      {/* 배경 컬러 오브 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #e8e8e8 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
            animation: "drift 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #dedede 0%, transparent 70%)",
            bottom: "10%",
            right: "-5%",
            animation: "drift 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #e8e8e8 0%, transparent 70%)",
            top: "40%",
            left: "50%",
            animation: "drift 18s ease-in-out infinite 3s",
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 content-layer relative z-10">
        <h1
          className="text-4xl md:text-6xl font-light tracking-[0.3em] uppercase mb-4"
          style={{ color: "var(--lg-text-primary)" }}
        >
          snippet
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-light mb-2">
          블라인드 북 큐레이션
        </p>
        <p className="text-sm text-gray-400 text-center max-w-md leading-relaxed mb-12">
          표지, 제목, 작가 이름 — 모든 편견을 가리고<br />
          오직 <span className="text-gray-600 font-medium">책 속의 한 문장</span>만으로 책을 만나보세요.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full mb-12">
          <div className="liquid-panel p-5 text-center">
            <div className="text-2xl mb-2">👆</div>
            <p className="text-sm font-medium text-gray-800 mb-1">스와이프</p>
            <p className="text-xs text-gray-500">마음에 드는 문장을<br />오른쪽으로 넘기세요</p>
          </div>
          <div className="liquid-panel p-5 text-center">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm font-medium text-gray-800 mb-1">발견</p>
            <p className="text-xs text-gray-500">숨겨진 책의 정체를<br />확인해보세요</p>
          </div>
          <div className="liquid-panel p-5 text-center">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-gray-800 mb-1">기록</p>
            <p className="text-xs text-gray-500">나만의 서재에<br />독서 기록을 남기세요</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/snippet"
            className="px-8 py-3 rounded-2xl text-sm font-medium text-white transition-all hover:scale-[1.02]"
            style={{ background: "var(--color-primary)" }}
          >
            문장 스와이프 시작하기
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-2xl liquid-panel text-sm font-medium text-gray-700 text-center transition-all hover:scale-[1.02]"
          >
            내 서재 바로가기
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="pb-8 flex flex-col items-center gap-3 content-layer relative z-10">
        <div className="flex gap-4 text-xs text-gray-400">
          <Link href="/login" className="hover:text-gray-600 transition-colors">로그인</Link>
          <Link href="/register" className="hover:text-gray-600 transition-colors">회원가입</Link>
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">개인정보 처리 방침</Link>
        </div>
      </footer>
    </main>
  );
}

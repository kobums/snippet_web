import SwipeStack from "@/components/SwipeStack";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col content-layer">
      {/* 배경 컬러 오브 (애니메이션) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #c8b6ff 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
            animation: "drift 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #a8d8ea 0%, transparent 70%)",
            bottom: "10%",
            right: "-5%",
            animation: "drift 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #ffc8dd 0%, transparent 70%)",
            top: "40%",
            left: "50%",
            animation: "drift 18s ease-in-out infinite 3s",
          }}
        />
      </div>

      {/* 헤더 */}
      <header className="flex items-center justify-center pt-12 pb-4 content-layer">
        <h1
          className="text-xl font-light tracking-[0.25em] uppercase"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          snippet
        </h1>
      </header>

      {/* 스와이프 영역 */}
      <section className="flex-1 flex items-center justify-center px-4 content-layer">
        <SwipeStack />
      </section>

      {/* 하단 힌트 (BottomNav 위에 여백 확보) */}
      <footer
        className="pb-20 flex justify-center gap-12 text-sm content-layer"
        style={{ color: "var(--lg-text-tertiary)" }}
      >
        <span>&larr; Pass</span>
        <span>Like &rarr;</span>
      </footer>
    </main>
  );
}

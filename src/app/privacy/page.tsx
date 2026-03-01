import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh flex flex-col content-layer pb-32">
      {/* 배경 컬러 오브 (메인 페이지와 통일감 유지) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #c8b6ff 0%, transparent 70%)",
            top: "-5%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #a8d8ea 0%, transparent 70%)",
            bottom: "20%",
            left: "-5%",
          }}
        />
      </div>

      {/* 헤더 */}
      <header className="flex items-center px-6 pt-12 pb-8 content-layer">
        <Link href="/" className="text-2xl mr-4" style={{ color: "var(--lg-text-secondary)" }}>
          &larr;
        </Link>
        <h1
          className="text-xl font-light tracking-tight"
          style={{ color: "var(--lg-text-primary)" }}
        >
          개인정보 처리 방침
        </h1>
      </header>

      {/* 컨텐츠 영역 */}
      <section className="flex-1 px-6 content-layer max-w-2xl mx-auto w-full">
        <div className="liquid-panel p-8 space-y-8 mb-12">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--lg-accent)" }}>
              1. 수집하는 개인정보 항목
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--lg-text-secondary)" }}>
              Snippet 서비스는 회원가입 없이 이용 가능하며, 서비스 제공을 위해 최소한의 정보만을 수집합니다.
              <br />- 수집 항목: 기기 식별 정보, 서비스 이용 기록
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--lg-accent)" }}>
              2. 개인정보의 수집 및 이용 목적
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--lg-text-secondary)" }}>
              수집된 정보는 다음과 같은 목적을 위해 활용됩니다.
              <br />- 맞춤형 콘텐츠(문장) 제공 및 추천
              <br />- 서비스 이용 통계 분석 및 품질 개선
              <br />- 보관함 기능 제공
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--lg-accent)" }}>
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--lg-text-secondary)" }}>
              사용자의 정보는 서비스 이용 종료 시 혹은 앱 삭제 시까지 보유하며, 법령에서 정한 기간이 있는 경우 해당 기간까지 보관합니다.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold" style={{ color: "var(--lg-accent)" }}>
              4. 사용자의 권리
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--lg-text-secondary)" }}>
              사용자는 언제든지 자신의 정보를 열람하거나 서비스 이용을 중단할 권리가 있습니다. 보관된 북마크 정보는 사용자에 의해 직접 관리될 수 있습니다.
            </p>
          </div>

          <div className="pt-8 border-t border-white/20">
            <p className="text-xs" style={{ color: "var(--lg-text-tertiary)" }}>
              시행 일자: 2026년 2월 25일
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

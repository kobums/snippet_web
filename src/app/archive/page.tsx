"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SnippetArchive } from "@/types/snippet";
import { fetchArchive } from "@/lib/api";
import { useArchive } from "@/hooks/useArchive";
import Link from "next/link";
import { SnippetArchiveSkeleton } from "@/components/ui/skeleton";

export default function ArchivePage() {
  const { likedIds } = useArchive();
  const [snippets, setSnippets] = useState<SnippetArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedId, setRevealedId] = useState<number | null>(null);

  useEffect(() => {
    if (likedIds.length === 0) {
      setLoading(false);
      return;
    }
    fetchArchive(likedIds)
      .then(setSnippets)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [likedIds]);

  // 로딩 상태
  if (loading) {
    return (
      <main className="min-h-dvh flex flex-col content-layer">
        <header className="flex items-center justify-center pt-8 sm:pt-12 pb-4 sm:pb-6">
          <h1
            className="text-base sm:text-xl font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase"
            style={{ color: "var(--lg-text-secondary)" }}
          >
            보관함
          </h1>
        </header>
        <div className="flex-1 px-4 sm:px-6 pb-20 sm:pb-24 space-y-3 sm:space-y-4 max-w-2xl mx-auto w-full">
          <SnippetArchiveSkeleton count={3} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col content-layer">
      {/* 헤더 */}
      <header className="flex items-center justify-center pt-8 sm:pt-12 pb-4 sm:pb-6">
        <h1
          className="text-base sm:text-xl font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          보관함
        </h1>
      </header>

      {/* 빈 보관함 */}
      {snippets.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="text-6xl float-effect">📖</div>
          <p
            className="text-lg font-light"
            style={{ color: "var(--lg-text-secondary)" }}
          >
            아직 모은 문장이 없어요
          </p>
          <p
            className="text-sm text-center"
            style={{ color: "var(--lg-text-tertiary)" }}
          >
            마음에 드는 문장을 오른쪽으로 스와이프하면
            <br />
            여기에 모을 수 있어요
          </p>
          <Link href="/" className="liquid-button mt-4 px-6 py-2.5 text-sm">
            스와이프 하러 가기
          </Link>
        </div>
      ) : (
        /* 보관함 목록 */}
        <div className="flex-1 px-4 sm:px-6 pb-20 sm:pb-24 space-y-3 sm:space-y-4 max-w-2xl mx-auto w-full">
          {snippets.map((snippet) => (
            <div key={snippet.id}>
              {/* 문장 카드 */}
              <button
                onClick={() =>
                  setRevealedId(revealedId === snippet.id ? null : snippet.id)
                }
                className="liquid-panel w-full text-left p-4 sm:p-6 cursor-pointer"
              >
                <span
                  className="liquid-badge inline-block mb-3 px-4 py-1.5 text-xs font-medium"
                  style={{ color: "var(--lg-text-secondary)" }}
                >
                  {snippet.tag}
                </span>
                <p
                  className="leading-relaxed font-light"
                  style={{ color: "var(--lg-text-primary)" }}
                >
                  &ldquo;{snippet.text}&rdquo;
                </p>
                <p className="mt-3 text-xs" style={{ color: "var(--lg-text-tertiary)" }}>
                  {revealedId === snippet.id
                    ? "탭하여 닫기"
                    : "탭하여 책 정보 보기"}
                </p>
              </button>

              {/* 책 정보 Reveal */}
              <AnimatePresence>
                {revealedId === snippet.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-2 rounded-2xl p-5 flex gap-4"
                      style={{
                        background: "rgba(255, 255, 255, 0.25)",
                        border: "1px solid rgba(255, 255, 255, 0.35)",
                        boxShadow: "var(--lg-shadow-sm)",
                      }}
                    >
                      <img
                        src={snippet.coverUrl}
                        alt={snippet.bookTitle}
                        className="w-16 h-24 object-cover rounded-xl"
                        style={{
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3
                            className="font-medium"
                            style={{ color: "var(--lg-text-primary)" }}
                          >
                            {snippet.bookTitle}
                          </h3>
                          <p
                            className="text-sm mt-1"
                            style={{ color: "var(--lg-text-secondary)" }}
                          >
                            {snippet.bookAuthor}
                          </p>
                        </div>
                        <a
                          href={snippet.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="liquid-button mt-3 inline-flex items-center justify-center px-4 py-2 text-sm"
                        >
                          이 책 구매하기
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

"use client"

import AppShell from "@/components/layout/AppShell";
import SwipeStack from "@/components/swipe/SwipeStack";

export default function SnippetPage() {
  return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center px-4">
        <SwipeStack />
      </div>

      <footer className="pb-24 flex flex-col items-center gap-6 content-layer relative z-10 shrink-0">
        <div
          className="flex justify-center gap-12 text-sm"
          style={{ color: "var(--lg-text-tertiary)" }}
        >
          <span>&larr; Pass</span>
          <span>Like &rarr;</span>
        </div>

        <div className="flex gap-3 text-[10px]" style={{ color: "var(--lg-text-tertiary)" }}>
          <a
            href="https://gowoobro.com/ko/app/14/terms"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            이용약관
          </a>
          <a
            href="https://gowoobro.com/ko/app/14/privacy"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            개인정보 처리방침
          </a>
        </div>
      </footer>
    </AppShell>
  );
}

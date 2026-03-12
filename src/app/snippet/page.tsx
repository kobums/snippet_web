"use client"

import Link from "next/link";
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

        <Link
          href="/privacy"
          className="text-[10px] opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: "var(--lg-text-tertiary)" }}
        >
          개인정보 처리 방침
        </Link>
      </footer>
    </AppShell>
  );
}

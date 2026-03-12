"use client"

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import BookSearchModal from '../modal/BookSearchModal';
import BookRecordModal from '../modal/BookRecordModal';
import { useUIStore } from '@/stores/useUIStore';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const {
    selectedBook, closeBookRecord,
    isSearchModalOpen, searchModalConfig, openSearchModal, closeSearchModal,
  } = useUIStore();

  return (
    <main className="min-h-dvh flex flex-col content-layer">
      {/* 배경 컬러 오브 */}
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

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath={pathname}
      />

      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 content-layer relative z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          style={{ color: "var(--lg-text-secondary)" }}
          aria-label="메뉴 열기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h1
          className="text-xl font-light tracking-[0.25em] uppercase"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          snippet
        </h1>

        <button
          onClick={() => openSearchModal()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          style={{ color: "var(--lg-text-secondary)" }}
          aria-label="도서 검색"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <section className="flex-1 flex flex-col content-layer relative z-10 h-[calc(100vh-140px)]">
        {children}
      </section>

      {/* 공용 모달 */}
      <BookRecordModal isOpen={!!selectedBook} onClose={closeBookRecord} book={selectedBook} />
      <BookSearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        allowedActions={searchModalConfig.allowedActions}
        defaultStatus={searchModalConfig.defaultStatus}
        onSuccess={() => {
          closeSearchModal();
        }}
      />
    </main>
  );
}

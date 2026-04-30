"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import BookSearchModal from '../modal/BookSearchModal';
import BookRecordModal from '../modal/BookRecordModal';
import { useUIStore } from '@/stores/useUIStore';
import { useThemeStore } from '@/stores/useThemeStore';

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
  const { theme, setTheme, effectiveDark } = useThemeStore();

  // 스토어를 localStorage 저장값으로 초기화
  useEffect(() => {
    try {
      const saved = localStorage.getItem('snippet-theme') as 'light' | 'dark' | 'system' | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        useThemeStore.setState({ theme: saved });
      }
    } catch {}
  }, []);

  const isDark = effectiveDark();

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

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

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath={pathname}
      />

      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 sm:px-6 pt-8 sm:pt-12 pb-4 content-layer relative z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          style={{ color: "var(--lg-text-secondary)" }}
          aria-label="메뉴 열기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h1
          className="text-base sm:text-xl font-light tracking-[0.2em] sm:tracking-[0.25em] uppercase"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          snippet
        </h1>

        <div className="flex items-center gap-2">
          {/* 테마 토글 (light → dark → system 순환) */}
          <button
            onClick={cycleTheme}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
            style={{ color: "var(--lg-text-secondary)" }}
            aria-label={`테마: ${theme}`}
            title={`현재: ${theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'}`}
          >
            {theme === 'dark' ? (
              /* 달 아이콘 */
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : theme === 'system' ? (
              /* 모니터 아이콘 */
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            ) : (
              /* 태양 아이콘 */
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" className="sm:w-[15px] sm:h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          <button
            onClick={() => openSearchModal()}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
            style={{ color: "var(--lg-text-secondary)" }}
            aria-label="도서 검색"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
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
        onSuccess={searchModalConfig.onSuccess}
      />

      {/* Toast 알림 */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1c1c1e' : '#ffffff',
            color: isDark ? '#f0f0f0' : '#1f2937',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: isDark
              ? '0 4px 16px rgba(0,0,0,0.4)'
              : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          },
          success: {
            iconTheme: {
              primary: '#30d158',
              secondary: isDark ? '#1c1c1e' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff453a',
              secondary: isDark ? '#1c1c1e' : '#ffffff',
            },
          },
        }}
      />
    </main>
  );
}

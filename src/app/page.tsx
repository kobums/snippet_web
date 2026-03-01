"use client"

import Link from "next/link";
import { useState } from "react";
import SwipeStack from "@/components/SwipeStack";
import BookSearchModal from "@/components/BookSearchModal";
import Sidebar from "@/components/Sidebar";
import DashboardLayout from "@/components/DashboardLayout";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'swipe' | 'dashboard'>('dashboard');

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

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={(view: 'swipe' | 'dashboard') => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        currentView={currentView}
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
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <h1
          className="text-xl font-light tracking-[0.25em] uppercase"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          snippet
        </h1>
        
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          style={{ color: "var(--lg-text-secondary)" }}
          aria-label="도서 검색"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </header>

      {/* 검색 모달 */}
      <BookSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSuccess={() => {
          alert("책이 서재에 성공적으로 추가되었습니다.");
        }}
      />

      {/* 메인 콘텐츠 영역: Swipe View or Dashboard View */}
      <section className="flex-1 flex flex-col content-layer relative z-10 h-[calc(100vh-140px)]">
        {currentView === 'swipe' ? (
          <div className="flex-1 flex items-center justify-center px-4">
            <SwipeStack />
          </div>
        ) : (
          <DashboardLayout />
        )}
      </section>

      {/* 하단 힌트 및 링크 (BottomNav 위에 여백 확보), Swipe 모드에서만 표시 - TODO: 하단 탭으로 교체 가능 */}
      {currentView === 'swipe' && (
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
      )}
    </main>
  );
}

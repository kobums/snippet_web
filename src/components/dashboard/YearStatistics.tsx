"use client"

import React, { useState, useMemo } from 'react';
import { UserBookDto } from '@/types/library';
import { formatDate } from '@/lib/util';

type StatTab = 'yearly' | 'read' | 'monthly';

const tabConfig: { key: StatTab; label: string; icon: React.ReactNode }[] = [
  { 
    key: 'yearly',  
    label: '올해의 독서',   
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> 
  },
  { 
    key: 'read',    
    label: '올해 읽은 책',   
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> 
  },
  { 
    key: 'monthly', 
    label: '월별 완료한 책', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> 
  },
];

interface YearStatisticsProps {
  books: UserBookDto[];
}

export default function YearStatistics({ books }: YearStatisticsProps) {
  const [activeTab,       setActiveTab]       = useState<StatTab>('yearly');
  const [readingExpanded, setReadingExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);

  const currentYear = new Date().getFullYear();

  /** 올해 연도 기준 필터링 */
  const yearlyBooks = useMemo(() => {
    return books.filter(b => {
      const d = b.startDate ? new Date(b.startDate) : null;
      return d && d.getFullYear() === currentYear;
    });
  }, [books, currentYear]);

  const readingBooks   = yearlyBooks.filter(b => b.status === 'reading');
  const completedBooks = yearlyBooks.filter(b => b.status === 'completed');

  /** 월별 완료 집계 */
  const monthlyStats = useMemo(() => {
    const map: Record<number, number> = {};
    for (let m = 1; m <= 12; m++) map[m] = 0;
    books.forEach(b => {
      if (b.status !== 'completed' || !b.endDate) return;
      const d = new Date(b.endDate);
      if (d.getFullYear() === currentYear) map[d.getMonth() + 1]++;
    });
    return map;
  }, [books, currentYear]);

  const maxMonthly = Math.max(...Object.values(monthlyStats), 1);

  return (
    <div className="liquid-panel p-6 flex flex-col gap-0 overflow-hidden">

      {/* 헤더 */}
      <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2 mb-5 shrink-0">
        <span>📊</span> 연간 통계
      </h3>

      {/* 툴바 */}
      <div className="flex items-center justify-between mb-5 shrink-0 gap-3 flex-wrap">
        {/* 탭 */}
        <div className="flex items-center gap-1.5">
          {tabConfig.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key 
                  ? 'liquid-badge text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title="필터">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title="정렬">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
            </svg>
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title="검색">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title="확장">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
          <button className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title="설정">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          </button>
          <div className="flex items-stretch ml-1">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20 border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              새로 만들기
            </button>
            <div className="relative">
              <button
                className="px-2 py-1.5 rounded-r-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20 h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 올해의 독서 탭 ── */}
      {activeTab === 'yearly' && (
        <div className="flex flex-col gap-6 overflow-y-auto hide-scrollbar max-h-[420px]">

          {/* 진행중 섹션 */}
          <div>
            <button onClick={() => setReadingExpanded(p => !p)}
              className="flex items-center gap-2 mb-3 text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform ${readingExpanded ? 'rotate-90' : ''}`}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">진행중</span>
              <span className="text-gray-400">{readingBooks.length}</span>
            </button>

            {readingExpanded && (
              <div className="flex flex-col gap-1.5 pl-1">
                {readingBooks.length === 0 ? (
                  <p className="text-xs text-gray-400 pl-2">진행 중인 책이 없습니다.</p>
                ) : (
                  readingBooks.map(b => (
                    <BookRow key={b.id} book={b} status="reading" />
                  ))
                )}
                <AddRow />
              </div>
            )}
          </div>

          {/* 완료 섹션 */}
          <div>
            <button onClick={() => setCompletedExpanded(p => !p)}
              className="flex items-center gap-2 mb-3 text-xs text-gray-500 hover:text-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform ${completedExpanded ? 'rotate-90' : ''}`}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span className="bg-[#5ebd8a] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">완료</span>
              <span className="text-gray-400">{completedBooks.length}</span>
            </button>

            {completedExpanded && (
              <div className="flex flex-col gap-1.5 pl-1">
                {completedBooks.length === 0 ? (
                  <p className="text-xs text-gray-400 pl-2">완료된 책이 없습니다.</p>
                ) : (
                  completedBooks.map(b => (
                    <BookRow key={b.id} book={b} status="completed" />
                  ))
                )}
                <AddRow />
              </div>
            )}
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 flex gap-2">
              <span>💡</span>
              <span>'올해 읽은 책'은 올해 중에 책 읽기를 완료했거나 중단한 책을 표시합니다.</span>
            </p>
            <p className="text-[11px] text-gray-400 flex gap-2">
              <span>💡</span>
              <span>'월별 완료한 책'은 올 한 해 동안 월별로 읽기 완료했거나 중단한 책의 권수를 표시합니다.</span>
            </p>
          </div>
        </div>
      )}

      {/* ── 올해 읽은 책 탭 ── */}
      {activeTab === 'read' && (
        <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar max-h-[420px]">
          {completedBooks.length === 0 ? (
            <p className="text-xs text-gray-400 py-4">올해 읽은 책이 없습니다.</p>
          ) : (
            completedBooks.map(b => <BookRow key={b.id} book={b} status="completed" />)
          )}
        </div>
      )}

      {/* ── 월별 완료한 책 탭 ── */}
      {activeTab === 'monthly' && (
        <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar max-h-[420px]">
          <div className="grid grid-cols-12 gap-1 mb-2">
            {Object.entries(monthlyStats).map(([month, count]) => (
              <div key={month} className="flex flex-col items-center gap-1">
                <div className="w-full rounded-sm bg-[#5ebd8a]"
                  style={{ height: `${Math.max((count / maxMonthly) * 60, count > 0 ? 4 : 1)}px`, opacity: count > 0 ? 1 : 0.15 }} />
                <span className="text-[9px] text-gray-400">{month}월</span>
                <span className="text-[10px] font-medium text-gray-700">{count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5">
            {Object.entries(monthlyStats)
              .filter(([, count]) => count > 0)
              .map(([month, count]) => (
                <div key={month} className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400 w-10 shrink-0">{month}월</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="h-full rounded-full bg-[#5ebd8a] transition-all"
                      style={{ width: `${(count / maxMonthly) * 100}%` }} />
                  </div>
                  <span className="text-gray-700 font-medium w-6 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 책 행 서브 컴포넌트 ── */
function BookRow({ book, status }: { book: UserBookDto; status: string }) {
  const isCompleted = status === 'completed';
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-white/40 rounded-lg px-2 py-1 transition-all cursor-pointer group">
      <span className="shrink-0">{isCompleted ? '✅' : '😊'}</span>
      <span className="text-gray-400 shrink-0 tabular-nums">
        {formatDate(book.startDate)} ~ {isCompleted ? formatDate(book.endDate) : ''}
      </span>
      <span className="text-gray-500 shrink-0">
        《<span className="text-gray-800 group-hover:text-purple-600 transition-colors">{book.title}</span>》
      </span>
      <span className="text-gray-400">읽기</span>
    </div>
  );
}

/* ── 새 페이지 추가 행 ── */
function AddRow() {
  return (
    <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 px-2 py-2 w-full transition-colors border-t border-transparent hover:border-gray-50">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      새 페이지
    </button>
  );
}

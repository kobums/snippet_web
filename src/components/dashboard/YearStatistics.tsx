"use client"

import React, { useState, useMemo } from 'react';
import { UserBookDto } from '@/types/library';
import YearlyReadingTab from './stats/YearlyReadingTab';
import MonthlyCompletedTab from './stats/MonthlyCompletedTab';

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
  const [activeTab, setActiveTab] = useState<StatTab>('yearly');
  const currentYear = new Date().getFullYear();

  const yearlyBooks = useMemo(() => {
    return books.filter(b => {
      const d = b.startDate ? new Date(b.startDate) : null;
      return d && d.getFullYear() === currentYear;
    });
  }, [books, currentYear]);

  const readingBooks = yearlyBooks.filter(b => b.status === 'reading');
  const completedBooks = yearlyBooks.filter(b => b.status === 'completed');

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
    <div className="liquid-panel p-4 sm:p-5 md:p-6 flex flex-col gap-0 overflow-hidden">
      <h3 className="text-gray-900 font-semibold text-base sm:text-lg flex items-center gap-2 mb-4 sm:mb-5 shrink-0">
        연간 통계
      </h3>

      {/* 툴바 */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 shrink-0 gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          {tabConfig.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                activeTab === tab.key
                  ? 'liquid-badge text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 border border-transparent'
              }`}
            >
              <span className="hidden sm:inline-block">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'yearly' && (
        <YearlyReadingTab readingBooks={readingBooks} completedBooks={completedBooks} />
      )}

      {activeTab === 'read' && (
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {completedBooks.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-400 py-3 sm:py-4">올해 읽은 책이 없습니다.</p>
          ) : (
            completedBooks.map(b => (
              <div key={b.id} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-white/40 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 transition-all cursor-pointer group">
                <span className="shrink-0">✅</span>
                <span className="text-gray-500 shrink-0">
                  《<span className="text-gray-800 group-hover:text-accent transition-colors">{b.title}</span>》
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'monthly' && (
        <MonthlyCompletedTab monthlyStats={monthlyStats} maxMonthly={maxMonthly} />
      )}
    </div>
  );
}

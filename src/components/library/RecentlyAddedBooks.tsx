"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';

type PeriodFilter = '1week' | '1month' | 'all';

interface RecentlyAddedBooksProps {
  books: UserBookDto[];
  onBookClick: (book: UserBookDto) => void;
  onNewClick: () => void;
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  wish: { text: '갖고싶은', color: 'bg-pink-500/20 text-pink-300' },
  waiting: { text: '대기중', color: 'bg-yellow-500/20 text-yellow-300' },
  reading: { text: '읽는중', color: 'bg-blue-500/20 text-blue-300' },
  completed: { text: '완독', color: 'bg-green-500/20 text-green-300' },
  dropped: { text: '중단', color: 'bg-white/10 text-white/50' },
};

const PERIOD_CONFIG: { key: PeriodFilter; label: string; days: number | null }[] = [
  { key: '1week', label: '최근 1주', days: 7 },
  { key: '1month', label: '최근 1달', days: 30 },
  { key: 'all', label: '전체', days: null },
];

export default function RecentlyAddedBooks({ books, onBookClick, onNewClick }: RecentlyAddedBooksProps) {
  const [period, setPeriod] = useState<PeriodFilter>('1week');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const currentPeriod = PERIOD_CONFIG.find(p => p.key === period)!;

  const filteredBooks = (() => {
    if (currentPeriod.days === null) return books;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - currentPeriod.days);
    return books.filter(b => {
      if (!b.createDate) return true;
      return new Date(b.createDate) >= cutoff;
    });
  })();

  const recentBooks = [...filteredBooks].sort((a, b) => {
    if (!a.createDate || !b.createDate) return 0;
    return new Date(b.createDate).getTime() - new Date(a.createDate).getTime();
  });

  return (
    <div className="liquid-panel p-5">
      <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">최근 추가한 책</span>
      </h3>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-2">
        {/* Period Filter */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg liquid-badge text-gray-900 text-xs font-medium hover:bg-white/50 transition-all border border-gray-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {currentPeriod.label}
          </button>
          {showPeriodMenu && (
            <div className="absolute left-0 top-full mt-1 bg-white/95 border border-gray-200 rounded-xl p-1 min-w-[110px] z-50 backdrop-blur-xl shadow-xl">
              {PERIOD_CONFIG.map(p => (
                <button
                  key={p.key}
                  onClick={() => { setPeriod(p.key); setShowPeriodMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    period === p.key ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onNewClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20"
          >
            새로 만들기
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      {/* Book List */}
      <div className="space-y-1.5">
        {recentBooks.length === 0 ? (
          <div className="text-xs text-gray-400 py-4 text-center">최근 추가한 책이 없습니다.</div>
        ) : (
          recentBooks.map(book => {
            const statusInfo = STATUS_LABELS[book.status] || STATUS_LABELS.wish;
            return (
              <div
                key={book.id}
                onClick={() => onBookClick(book)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-gray-200 hover:bg-white transition-colors cursor-pointer group shadow-sm"
              >
                <div className="w-7 h-7 rounded border border-gray-200 bg-gray-50 shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500 group-hover:border-purple-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <span className="text-sm text-gray-800 truncate flex-1 group-hover:text-purple-600 transition-colors">
                  {book.title}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Page */}
      <button
        onClick={onNewClick}
        className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

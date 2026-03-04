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
    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">최근 추가한 책</span>
      </h3>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-2">
        {/* Period Filter */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {currentPeriod.label}
          </button>
          {showPeriodMenu && (
            <div className="absolute left-0 top-full mt-1 bg-[#1a1a2e]/95 border border-white/10 rounded-xl p-1 min-w-[110px] z-50 backdrop-blur-xl shadow-xl">
              {PERIOD_CONFIG.map(p => (
                <button
                  key={p.key}
                  onClick={() => { setPeriod(p.key); setShowPeriodMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    period === p.key ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/80'
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
          <div className="text-xs text-white/30 py-4 text-center">최근 추가한 책이 없습니다.</div>
        ) : (
          recentBooks.map(book => {
            const statusInfo = STATUS_LABELS[book.status] || STATUS_LABELS.wish;
            return (
              <div
                key={book.id}
                onClick={() => onBookClick(book)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="w-5 h-5 rounded border border-white/15 bg-white/5 shrink-0" />
                <span className="text-sm text-white/80 truncate flex-1 group-hover:text-white transition-colors">
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
        className="mt-3 flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

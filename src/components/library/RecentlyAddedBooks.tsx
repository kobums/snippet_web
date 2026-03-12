"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import { useUIStore } from '@/stores/useUIStore';
import PanelToolbar, { TabItem } from '@/components/ui/PanelToolbar';

type PeriodFilter = '1week' | '1month' | 'all';

interface RecentlyAddedBooksProps {
  books: UserBookDto[];
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  wish: { text: '갖고싶은', color: 'bg-pink-500/20 text-pink-300' },
  waiting: { text: '대기중', color: 'bg-yellow-500/20 text-yellow-300' },
  reading: { text: '읽는중', color: 'bg-blue-500/20 text-blue-300' },
  completed: { text: '완독', color: 'bg-green-500/20 text-green-300' },
  dropped: { text: '중단', color: 'bg-white/10 text-white/50' },
};

const periodTabs: TabItem<PeriodFilter>[] = [
  { key: '1week', label: '최근 1주' },
  { key: '1month', label: '최근 1달' },
  { key: 'all', label: '전체' },
];

const PERIOD_DAYS: Record<PeriodFilter, number | null> = {
  '1week': 7,
  '1month': 30,
  'all': null,
};

export default function RecentlyAddedBooks({ books }: RecentlyAddedBooksProps) {
  const [period, setPeriod] = useState<PeriodFilter>('1week');
  const { openBookRecord, openSearchModal } = useUIStore();

  const filteredBooks = (() => {
    const days = PERIOD_DAYS[period];
    if (days === null) return books;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
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

      <PanelToolbar<PeriodFilter>
        tabs={periodTabs}
        activeTab={period}
        onTabChange={setPeriod}
        onNew={() => openSearchModal({ defaultStatus: 'reading' })}
      />

      <div className="space-y-1.5">
        {recentBooks.length === 0 ? (
          <div className="text-xs text-gray-400 py-4 text-center">최근 추가한 책이 없습니다.</div>
        ) : (
          recentBooks.map(book => {
            const statusInfo = STATUS_LABELS[book.status] || STATUS_LABELS.wish;
            return (
              <div
                key={book.id}
                onClick={() => openBookRecord(book)}
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

      <button
        onClick={() => openSearchModal({ defaultStatus: 'reading' })}
        className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

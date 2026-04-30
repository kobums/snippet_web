"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import { useUIStore } from '@/stores/useUIStore';
import { useBookStore } from '@/stores/useBookStore';
import PanelToolbar, { TabItem } from '@/components/ui/PanelToolbar';
import { LibraryListSkeleton } from '@/components/ui/skeleton';

type PeriodFilter = '1week' | '1month' | 'all';

interface RecentlyAddedBooksProps {
  books: UserBookDto[];
  loading: boolean;
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  wish: { text: '갖고싶은', color: 'bg-accent/20 text-accent' },
  waiting: { text: '대기중', color: 'bg-warning/20 text-warning' },
  reading: { text: '읽는중', color: 'bg-info/20 text-info' },
  completed: { text: '완독', color: 'bg-secondary/20 text-secondary' },
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

export default function RecentlyAddedBooks({ books, loading }: RecentlyAddedBooksProps) {
  const [period, setPeriod] = useState<PeriodFilter>('1week');
  const { openBookRecord, openSearchModal } = useUIStore();
  const { loadDashboard } = useBookStore();

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
      <h3 className="text-gray-900 dark:text-[#f0f0f0] font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">최근 추가한 책</span>
      </h3>

      <PanelToolbar<PeriodFilter>
        tabs={periodTabs}
        activeTab={period}
        onTabChange={setPeriod}
        onNew={() => openSearchModal({ defaultStatus: 'reading', onSuccess: loadDashboard })}
      />

      <div className="space-y-1.5">
        {loading ? (
          <LibraryListSkeleton count={3} />
        ) : recentBooks.length === 0 ? (
          <div className="text-xs text-gray-400 dark:text-[#666] py-4 text-center">최근 추가한 책이 없습니다.</div>
        ) : (
          recentBooks.map(book => {
            const statusInfo = STATUS_LABELS[book.status] || STATUS_LABELS.wish;
            return (
              <div
                key={book.id}
                onClick={() => openBookRecord(book)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer group shadow-sm"
              >
                <div className="w-7 h-7 rounded border border-gray-200 bg-gray-50 shrink-0 flex items-center justify-center text-gray-400 dark:text-[#666] group-hover:bg-accent/5 group-hover:text-accent group-hover:border-accent/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                </div>
                <span className="text-sm text-gray-800 dark:text-[#d0d0d0] truncate flex-1 group-hover:text-accent transition-colors">
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
        onClick={() => openSearchModal({ defaultStatus: 'reading', onSuccess: loadDashboard })}
        className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-[#666] hover:text-gray-600 dark:text-[#a0a0a0] transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

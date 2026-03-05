"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';

interface DashboardStatsProps {
  stats: StatsDto | null;
  completedBooks: UserBookDto[];
  loading: boolean;
  onBookClick: (book: UserBookDto) => void;
}

export default function DashboardStats({ stats, completedBooks, loading, onBookClick }: DashboardStatsProps) {
  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-6 shrink-0 lg:overflow-y-auto hide-scrollbar">
      <div className="liquid-panel p-6">
        <h3 className="text-gray-900 font-medium mb-4">이번 달 읽기 현황</h3>
        <div className="flex justify-center items-center py-8 relative">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200 border-t-purple-500 border-r-purple-500 flex flex-col items-center justify-center transform -rotate-45">
            <div className="transform rotate-45 flex flex-col items-center">
              <span className="text-gray-900 text-3xl font-light">{stats ? stats.monthlyCompletedCount : 0}</span>
              <span className="text-gray-500 text-xs">완독</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-xs text-purple-700 bg-purple-500/10 px-2 py-1 rounded-full">
            진행 중 {stats ? stats.currentlyReadingCount : 0}
          </div>
        </div>
      </div>

      <div className="flex-1 liquid-panel p-6 flex flex-col">
        <h3 className="text-gray-900 font-medium mb-4 shrink-0">총 읽은 책 ({stats ? stats.totalCompletedCount : 0})</h3>
        <div className="space-y-3 flex-1 overflow-y-auto hide-scrollbar">
          {loading ? (
            <div className="text-gray-500 text-sm py-4 text-center">로딩 중...</div>
          ) : completedBooks.length === 0 ? (
            <div className="text-gray-400 text-sm py-4 text-center border border-dashed border-gray-300 rounded-xl">아직 다 읽은 책이 없습니다.</div>
          ) : (
            completedBooks.map(book => (
              <div key={book.id} onClick={() => onBookClick(book)} className="bg-white/60 border border-white/40 rounded-xl flex items-center p-3 gap-3 hover:bg-white transition-colors cursor-pointer group shadow-sm">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                ) : (
                  <div className="w-12 h-16 bg-gray-100 rounded-md flex items-center justify-center text-[10px] text-gray-400 text-center">No Img</div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-gray-900 text-sm font-medium truncate group-hover:text-purple-600 transition-colors">{book.title}</p>
                  <p className="text-gray-500 text-xs truncate mt-1">{book.author}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

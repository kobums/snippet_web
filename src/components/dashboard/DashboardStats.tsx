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
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <h3 className="text-white font-medium mb-4">이번 달 읽기 현황</h3>
        <div className="flex justify-center items-center py-8 relative">
          <div className="w-32 h-32 rounded-full border-8 border-white/10 border-t-blue-400 border-r-blue-400 flex flex-col items-center justify-center transform -rotate-45">
            <div className="transform rotate-45 flex flex-col items-center">
              <span className="text-white text-3xl font-light">{stats ? stats.monthlyCompletedCount : 0}</span>
              <span className="text-white/50 text-xs">완독</span>
            </div>
          </div>
          <div className="absolute top-4 right-4 text-xs text-blue-200 bg-blue-500/20 px-2 py-1 rounded-full">
            진행 중 {stats ? stats.currentlyReadingCount : 0}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md flex flex-col">
        <h3 className="text-white font-medium mb-4 shrink-0">총 읽은 책 ({stats ? stats.totalCompletedCount : 0})</h3>
        <div className="space-y-3 flex-1 overflow-y-auto hide-scrollbar">
          {loading ? (
            <div className="text-white/50 text-sm py-4 text-center">로딩 중...</div>
          ) : completedBooks.length === 0 ? (
            <div className="text-white/40 text-sm py-4 text-center border border-dashed border-white/20 rounded-xl">아직 다 읽은 책이 없습니다.</div>
          ) : (
            completedBooks.map(book => (
              <div key={book.id} onClick={() => onBookClick(book)} className="bg-white/5 rounded-xl flex items-center p-3 gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                ) : (
                  <div className="w-12 h-16 bg-white/10 rounded-md flex items-center justify-center text-[10px] text-white/30 text-center">No Img</div>
                )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-white text-sm font-medium truncate group-hover:text-blue-300 transition-colors">{book.title}</p>
                  <p className="text-white/50 text-xs truncate mt-1">{book.author}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

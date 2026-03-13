"use client"

import React, { useEffect } from 'react';
import { useBookStore } from '@/stores/useBookStore';
import DashboardStats from './DashboardStats';
import ReadingProgress from './ReadingProgress';
import BookLibrary from '../library/BookLibrary';


export default function DashboardLayout() {
  const { books, loading, loadDashboard, selectedYear, selectedMonth, setSelectedMonth } = useBookStore();

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const completedBooks = books.filter(b => b.status === 'completed');

  /* 이전/다음 월 이동 */
  const goToPrevMonth = () => {
    if (selectedMonth === 1) setSelectedMonth(selectedYear - 1, 12);
    else setSelectedMonth(selectedYear, selectedMonth - 1);
  };
  const goToNextMonth = () => {
    const now = new Date();
    const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
    if (isCurrentMonth) return; // 현재 달 이후로는 이동 불가
    if (selectedMonth === 12) setSelectedMonth(selectedYear + 1, 1);
    else setSelectedMonth(selectedYear, selectedMonth + 1);
  };
  const isCurrentMonth = (() => {
    const now = new Date();
    return selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
  })();

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8 max-w-[2000px] mx-auto overflow-y-auto hide-scrollbar">

      {/* 모바일/태블릿: 상단 Stats + Library */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:hidden">
        <div className="w-full md:w-2/5">
          <DashboardStats books={books} completedBooks={completedBooks} loading={loading}
            selectedYear={selectedYear} selectedMonth={selectedMonth}
            isCurrentMonth={isCurrentMonth} onPrevMonth={goToPrevMonth} onNextMonth={goToNextMonth} />
        </div>
        <div className="w-full md:w-3/5">
          <BookLibrary books={books} loading={loading} />
        </div>
      </div>

      {/* 모바일/태블릿: 하단 Progress */}
      <div className="flex-1 lg:hidden">
        <ReadingProgress books={books} loading={loading} />
      </div>

      {/* 데스크톱: 원래 3열 레이아웃 */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-8 h-full">
        <div className="col-span-1">
          <DashboardStats books={books} completedBooks={completedBooks} loading={loading}
            selectedYear={selectedYear} selectedMonth={selectedMonth}
            isCurrentMonth={isCurrentMonth} onPrevMonth={goToPrevMonth} onNextMonth={goToNextMonth} />
        </div>
        <div className="col-span-2">
          <ReadingProgress books={books} loading={loading} />
        </div>
        <div className="col-span-1">
          <BookLibrary books={books} loading={loading} />
        </div>
      </div>
    </div>
  );
}


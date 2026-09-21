"use client"

import React, { useEffect } from 'react';
import { useBookStore } from '@/stores/useBookStore';
import DashboardStats from './DashboardStats';
import ReadingProgress from './ReadingProgress';
import BookLibrary from '../library/BookLibrary';
import SwipeableTabs from '../common/SwipeableTabs';


export default function DashboardLayout() {
  const { books, progressBooks, loading, loadDashboard, selectedYear, selectedMonth, setSelectedMonth } = useBookStore();

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

  const mobileTabs = [
    {
      label: '통계',
      icon: '📊',
      content: (
        <div className="p-1">
          <DashboardStats books={books} completedBooks={completedBooks} loading={loading}
            selectedYear={selectedYear} selectedMonth={selectedMonth}
            isCurrentMonth={isCurrentMonth} onPrevMonth={goToPrevMonth} onNextMonth={goToNextMonth} />
        </div>
      ),
    },
    {
      label: '진행',
      icon: '📖',
      content: (
        <div className="p-1">
          <ReadingProgress books={books} progressBooks={progressBooks} loading={loading} />
        </div>
      ),
    },
    {
      label: '서재',
      icon: '📚',
      content: (
        <div className="p-1">
          <BookLibrary books={books} loading={loading} />
        </div>
      ),
    },
  ];

  return (
    // 좁은 화면(lg 미만)에서는 탭 내용이 절대 위치라 부모 높이를 그대로 물려받아야 한다.
    // 퍼센트 높이(h-full)는 부모가 min-height만 가진 flex 컨테이너라 계산되지 않으므로,
    // flex-1 + min-h-0 로 섹션 높이를 채운다. (데스크톱은 기존 스크롤 동작 유지)
    <div className="w-full h-full max-lg:flex-1 max-lg:min-h-0 p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8 max-w-[2000px] mx-auto overflow-y-auto hide-scrollbar">

      {/* 모바일/태블릿: SwipeableTabs — 래퍼도 flex 컨테이너여야 탭 컴포넌트가 높이를 채운다 */}
      <div className="flex-1 min-h-0 flex flex-col lg:hidden">
        <SwipeableTabs tabs={mobileTabs} />
      </div>

      {/* 데스크톱: 원래 3열 레이아웃 */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-8 h-full">
        <div className="col-span-1">
          <DashboardStats books={books} completedBooks={completedBooks} loading={loading}
            selectedYear={selectedYear} selectedMonth={selectedMonth}
            isCurrentMonth={isCurrentMonth} onPrevMonth={goToPrevMonth} onNextMonth={goToNextMonth} />
        </div>
        <div className="col-span-2">
          <ReadingProgress books={books} progressBooks={progressBooks} loading={loading} />
        </div>
        <div className="col-span-1">
          <BookLibrary books={books} loading={loading} />
        </div>
      </div>
    </div>
  );
}


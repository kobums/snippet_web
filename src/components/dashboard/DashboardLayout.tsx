"use client"

import React, { useEffect } from 'react';
import { useBookStore } from '@/stores/useBookStore';
import { useUIStore } from '@/stores/useUIStore';
import BookRecordModal from '../modal/BookRecordModal';
import BookSearchModal from '../modal/BookSearchModal';
import DashboardStats from './DashboardStats';
import ReadingProgress from './ReadingProgress';
import BookLibrary from '../library/BookLibrary';


export default function DashboardLayout() {
  const { books, loading, loadDashboard, refreshBooks, selectedYear, selectedMonth, setSelectedMonth } = useBookStore();
  const { selectedBook, closeBookRecord, isSearchModalOpen, searchModalConfig, closeSearchModal } = useUIStore();

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
    <div className="w-full h-full p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-[2000px] mx-auto overflow-y-auto lg:overflow-hidden hide-scrollbar">
      <DashboardStats books={books} completedBooks={completedBooks} loading={loading}
        selectedYear={selectedYear} selectedMonth={selectedMonth}
        isCurrentMonth={isCurrentMonth} onPrevMonth={goToPrevMonth} onNextMonth={goToNextMonth} />
      <ReadingProgress books={books} loading={loading} />
      <BookLibrary books={books} />

      <BookRecordModal isOpen={!!selectedBook} onClose={closeBookRecord} book={selectedBook} />
      <BookSearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        allowedActions={searchModalConfig.allowedActions}
        defaultStatus={searchModalConfig.defaultStatus}
        onSuccess={() => { closeSearchModal(); refreshBooks(); }}
      />
    </div>
  );
}


"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import ReadingStatus from './ReadingStatus';
import ReadingCalendar from './ReadingCalendar';
import CompletedBooksList from './CompletedBooksList';
import MonthNavigator from './MonthNavigator';

interface DashboardStatsProps {
  books: UserBookDto[];
  completedBooks: UserBookDto[];
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;
  isCurrentMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function DashboardStats({ books, completedBooks, loading, selectedYear, selectedMonth, isCurrentMonth, onPrevMonth, onNextMonth }: DashboardStatsProps) {
  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto hide-scrollbar">
      {/* 월 네비게이터 */}
      <MonthNavigator
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        isCurrentMonth={isCurrentMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <ReadingStatus books={books} />
      <ReadingCalendar completedBooks={completedBooks} />
      <CompletedBooksList completedBooks={completedBooks} loading={loading} />
    </div>
  );
}

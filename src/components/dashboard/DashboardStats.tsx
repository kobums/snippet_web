"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';
import ReadingStatus from './ReadingStatus';
import ReadingCalendar from './ReadingCalendar';
import CompletedBooksList from './CompletedBooksList';

interface DashboardStatsProps {
  stats: StatsDto | null;
  books: UserBookDto[];
  completedBooks: UserBookDto[];
  loading: boolean;
}

export default function DashboardStats({ stats, books, completedBooks, loading }: DashboardStatsProps) {
  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-5 shrink-0 lg:overflow-y-auto hide-scrollbar">
      <ReadingStatus stats={stats} books={books} />
      <ReadingCalendar completedBooks={completedBooks} />
      <CompletedBooksList completedBooks={completedBooks} loading={loading} />
    </div>
  );
}

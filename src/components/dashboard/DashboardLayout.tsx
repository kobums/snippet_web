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
  const { books, stats, loading, loadDashboard, refreshBooks } = useBookStore();
  const { selectedBook, closeBookRecord, isSearchModalOpen, searchModalConfig, closeSearchModal } = useUIStore();

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const completedBooks = books.filter(b => b.status === 'completed');

  return (
    <div className="w-full h-full p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-[2000px] mx-auto overflow-y-auto lg:overflow-hidden hide-scrollbar">
      <DashboardStats stats={stats} books={books} completedBooks={completedBooks} loading={loading} />
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


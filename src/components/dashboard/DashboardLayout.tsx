"use client"

import React, { useEffect, useState } from 'react';
import { getUserBooks, updateBookStatus, updateBookProgress } from '@/lib/libraryApi';
import { getUserStats } from '@/lib/statsApi';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';
import BookRecordModal from '../modal/BookRecordModal';
import BookSearchModal from '../modal/BookSearchModal';
import DashboardStats from './DashboardStats';
import ReadingProgress from './ReadingProgress';
import BookLibrary from '../library/BookLibrary';

export default function DashboardLayout() {
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookForRecord, setSelectedBookForRecord] = useState<UserBookDto | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchModalActions, setSearchModalActions] = useState<('wish' | 'have' | 'borrow')[] | undefined>(undefined);
  const [searchModalStatus, setSearchModalStatus] = useState<'waiting' | 'reading' | 'completed' | 'dropped'>('reading');

  const openSearchModal = (actions?: ('wish' | 'have' | 'borrow')[], status?: 'waiting' | 'reading' | 'completed' | 'dropped') => {
    setSearchModalActions(actions);
    setSearchModalStatus(status || 'reading');
    setShowSearchModal(true);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [booksData, statsData] = await Promise.all([
          getUserBooks(),
          getUserStats()
        ]);
        setBooks(booksData);
        setStats(statsData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = async (id: number, status: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if (status === 'completed') {
        const todayStr = new Date().toISOString().split('T')[0];
        await Promise.all([
          updateBookStatus(id, status),
          import('@/lib/libraryApi').then(({ updateBookEndDate }) => updateBookEndDate(id, todayStr))
        ]);
        setBooks(prev => prev.map(b => b.id === id ? { ...b, status: status as any, endDate: todayStr } : b));
      } else {
        await updateBookStatus(id, status);
        setBooks(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
      }
    } catch (e) {
      console.error("Failed to update status", e);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleTypeChange = async (id: number, type: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      import('@/lib/libraryApi').then(({ updateBookType }) => {
        updateBookType(id, type).then(() => {
          setBooks(prev => prev.map(b => b.id === id ? { ...b, type: type as any } : b));
        });
      });
    } catch (e) {
      console.error("Failed to update type", e);
      alert("분류 변경에 실패했습니다.");
    }
  };

  const handleProgressChange = async (id: number, current: number, max: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextProgress = Math.min(current + 10, max);
    try {
      await updateBookProgress(id, nextProgress);
      setBooks(prev => prev.map(b => b.id === id ? { ...b, readPage: nextProgress } : b));
    } catch (e) {
      console.error("Failed to update progress", e);
    }
  };

  const completedBooks = books.filter(b => b.status === 'completed');

  return (
    <div className="w-full h-full p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-[2000px] mx-auto overflow-y-auto lg:overflow-hidden hide-scrollbar">

      {/* 1. Left Column: Stats & Read Books */}
      <DashboardStats
        stats={stats}
        books={books}
        completedBooks={completedBooks}
        loading={loading}
        onBookClick={setSelectedBookForRecord}
      />

      {/* 2. Center Column: Reading Progress & Logs */}
      <ReadingProgress
        books={books}
        loading={loading}
        onBookClick={setSelectedBookForRecord}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onProgressChange={handleProgressChange}
        onNewClick={(actions, status) => openSearchModal(actions, status)}
      />

      {/* 3. Right Column: Book Library */}
      <BookLibrary
        books={books}
        onBookClick={setSelectedBookForRecord}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onNewClick={(actions, status) => openSearchModal(actions, status)}
      />

      <BookRecordModal
        isOpen={!!selectedBookForRecord}
        onClose={() => setSelectedBookForRecord(null)}
        book={selectedBookForRecord}
        onUpdateProgress={(id, page) => {
          setBooks(prev => prev.map(b => b.id === id ? { ...b, readPage: page } : b));
          if (selectedBookForRecord?.id === id) {
            setSelectedBookForRecord({ ...selectedBookForRecord, readPage: page });
          }
        }}
      />

      <BookSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        allowedActions={searchModalActions}
        defaultStatus={searchModalStatus}
        onSuccess={() => {
          setShowSearchModal(false);
          getUserBooks().then(setBooks).catch(console.error);
        }}
      />
    </div>
  );
}

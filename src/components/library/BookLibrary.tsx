"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import RecentlyAddedBooks from './RecentlyAddedBooks';
import ReadingBooks from './ReadingBooks';
import BorrowedBooks from './BorrowedBooks';
import WishlistBooks from './WishlistBooks';
import BookSearchInput from './BookSearchInput';

interface BookLibraryProps {
  books: UserBookDto[];
  onBookClick: (book: UserBookDto) => void;
  onStatusChange: (id: number, status: string, e?: React.MouseEvent) => void;
  onTypeChange?: (id: number, type: string, e?: React.MouseEvent) => void;
  onNewClick: (allowedActions?: ('wish' | 'have' | 'borrow')[], defaultStatus?: 'waiting' | 'reading' | 'completed' | 'dropped') => void;
}

export default function BookLibrary({ books, onBookClick, onStatusChange, onTypeChange, onNewClick }: BookLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(b => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(lowerQ) || b.author.toLowerCase().includes(lowerQ);
  });

  const readingBooks = filteredBooks.filter(b => b.status === 'reading');
  const borrowedBooks = filteredBooks.filter(b => b.type === 'borrow');
  const wishBooks = filteredBooks.filter(b => b.type === 'wish');

  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-5 shrink-0 lg:overflow-y-auto hide-scrollbar">

      {/* 검색창 컴포넌트 분리 */}
      <BookSearchInput value={searchQuery} onChange={setSearchQuery} />

      {/* 1. 최근 추가한 책 (모든 액션 허용) */}
      <RecentlyAddedBooks
        books={filteredBooks}
        onBookClick={onBookClick}
        onNewClick={() => onNewClick(undefined, 'reading')}
      />

      {/* 2. 읽고 있는 책 (소장만) */}
      <ReadingBooks
        books={readingBooks}
        onBookClick={onBookClick}
        onNewClick={() => onNewClick(['have'], 'reading')}
      />

      {/* 3. 빌린 책 (대여만) */}
      <BorrowedBooks
        books={borrowedBooks}
        onBookClick={onBookClick}
        onNewClick={() => onNewClick(['borrow'], 'reading')}
      />

      {/* 4. 갖고 싶은 책 (위시만) */}
      <WishlistBooks
        books={wishBooks}
        onBookClick={onBookClick}
        onStatusChange={onStatusChange}
        onTypeChange={onTypeChange}
        onNewClick={() => onNewClick(['wish'], 'waiting')}
      />
    </div>
  );
}

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
}

export default function BookLibrary({ books }: BookLibraryProps) {
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
      <RecentlyAddedBooks books={filteredBooks} />

      {/* 2. 읽고 있는 책 (소장만) */}
      <ReadingBooks books={readingBooks} />

      {/* 3. 빌린 책 (대여만) */}
      <BorrowedBooks books={borrowedBooks} />

      {/* 4. 갖고 싶은 책 (위시만) */}
      <WishlistBooks books={wishBooks} />
    </div>
  );
}

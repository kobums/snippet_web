"use client"

import { UserBookDto } from '@/types/library';
import RecentlyAddedBooks from './library/RecentlyAddedBooks';
import ReadingBooks from './library/ReadingBooks';
import BorrowedBooks from './library/BorrowedBooks';
import WishlistBooks from './library/WishlistBooks';

interface BookLibraryProps {
  books: UserBookDto[];
  onBookClick: (book: UserBookDto) => void;
  onStatusChange: (id: number, status: string, e?: React.MouseEvent) => void;
  onNewClick: () => void;
}

export default function BookLibrary({ books, onBookClick, onStatusChange, onNewClick }: BookLibraryProps) {
  const readingBooks = books.filter(b => b.status === 'reading' && (b.type === 'have' || b.type === 'borrow'));
  const borrowedBooks = books.filter(b => b.type === 'borrow');
  const wishBooks = books.filter(b => b.type === 'wish');

  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-5 shrink-0 lg:overflow-y-auto hide-scrollbar">

      {/* 1. 최근 추가한 책 */}
      <RecentlyAddedBooks
        books={books}
        onBookClick={onBookClick}
        onNewClick={onNewClick}
      />

      {/* 2. 읽고 있는 책 */}
      <ReadingBooks
        books={readingBooks}
        onBookClick={onBookClick}
        onNewClick={onNewClick}
      />

      {/* 3. 빌린 책 */}
      <BorrowedBooks
        books={borrowedBooks}
        onBookClick={onBookClick}
        onNewClick={onNewClick}
      />

      {/* 4. 갖고 싶은 책 */}
      <WishlistBooks
        books={wishBooks}
        onBookClick={onBookClick}
        onStatusChange={onStatusChange}
        onNewClick={onNewClick}
      />
    </div>
  );
}

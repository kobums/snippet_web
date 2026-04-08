"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { useUIStore } from '@/stores/useUIStore';
import { useBookStore } from '@/stores/useBookStore';
import { patchUserBook } from '@/lib/userBookApi';
import PanelToolbar from '@/components/ui/PanelToolbar';
import { LibraryCardSkeleton } from '@/components/ui/skeleton';

interface BorrowedBooksProps {
  books: UserBookDto[];
  loading: boolean;
}

export default function BorrowedBooks({ books, loading }: BorrowedBooksProps) {
  const { openBookRecord, openSearchModal } = useUIStore();
  const { updateBookLocally, loadDashboard } = useBookStore();

  const handleReturn = async (e: React.MouseEvent, book: UserBookDto) => {
    e.stopPropagation();
    await patchUserBook(book.id, { type: 'return' });
    updateBookLocally(book.id, { type: 'return', status: 'completed' });
  };

  return (
    <div className="liquid-panel p-5">
      <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">빌린 책</span>
      </h3>

      <PanelToolbar
        expandUrl="/books/borrow"
        onNew={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadDashboard })}
      />

      <div className="space-y-3">
        {loading ? (
          <LibraryCardSkeleton count={2} />
        ) : books.length === 0 ? (
          <div className="text-xs text-gray-400 py-4 text-center">빌린 책이 없습니다.</div>
        ) : (
          books.map(book => (
            <div
              key={book.id}
              onClick={() => openBookRecord(book)}
              className="bg-white/60 border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-white transition-colors group shadow-sm"
            >
              {book.coverUrl && (
                <div className="w-full flex justify-center py-4 px-6 bg-gray-50/50">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-36 object-contain rounded-md shadow-lg group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}
              <div className="px-4 py-3 space-y-1.5">
                <p className="text-sm text-gray-900 font-medium leading-snug group-hover:text-accent transition-colors">
                  {book.title}
                </p>
                <p className="text-[11px] text-gray-500">{book.author}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                    book.status === 'reading' ? 'bg-info/20 text-info' :
                    book.status === 'waiting' ? 'bg-warning/20 text-warning' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {book.status === 'reading' ? '읽는 중' : book.status === 'waiting' ? '대기 중' : book.status}
                  </span>
                  <button
                    onClick={(e) => handleReturn(e, book)}
                    className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors"
                  >
                    반납 완료
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadDashboard })}
        className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

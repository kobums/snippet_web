"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { formatDate } from '@/lib/util';
import { useUIStore } from '@/stores/useUIStore';
import { CompletedBookCardSkeleton } from '@/components/ui/skeleton';

interface CompletedBooksListProps {
  completedBooks: UserBookDto[];
  loading: boolean;
}

export default function CompletedBooksList({ completedBooks, loading }: CompletedBooksListProps) {
  const openBookRecord = useUIStore(s => s.openBookRecord);

  return (
    <div className="liquid-panel p-4 sm:p-5 md:p-6 flex flex-col shrink-0">
      <div className="flex items-center justify-between mb-4 sm:mb-5 shrink-0">
        <div className="flex items-center gap-2 liquid-badge px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          읽은 책
        </div>
        <span className="text-xs sm:text-sm text-gray-400">{completedBooks.length}권</span>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto hide-scrollbar flex-1">
        {loading ? (
          <CompletedBookCardSkeleton count={3} />
        ) : completedBooks.length === 0 ? (
          <div className="text-gray-400 text-sm sm:text-base py-6 sm:py-8 text-center border border-dashed border-gray-200 rounded-2xl">
            아직 다 읽은 책이 없습니다.
          </div>
        ) : (
          completedBooks.map(book => (
            <div
              key={book.id}
              onClick={() => openBookRecord(book)}
              className="bg-white/60 border border-white/60 rounded-2xl overflow-hidden cursor-pointer hover:bg-white transition-colors shadow-sm group"
            >
              <div className="w-full h-[180px] sm:h-[200px] bg-gray-50 flex items-center justify-center p-3 sm:p-4">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full object-contain drop-shadow-md group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                )}
              </div>
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-1.5">
                <h4 className="flex items-center gap-2 text-gray-900 font-medium text-sm sm:text-base leading-snug group-hover:text-purple-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span className="truncate">{book.title}</span>
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 pl-5">{book.author}</p>
                <div className="flex items-center gap-1.5 pl-5 mt-1">
                  <div className="flex items-center justify-center w-[14px] h-[14px] rounded-[3px] bg-[#34c759] shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-400">{formatDate(book.startDate)} ~ {formatDate(book.endDate)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';

interface BorrowedBooksProps {
  books: UserBookDto[];
  onBookClick: (book: UserBookDto) => void;
  onNewClick: () => void;
}

export default function BorrowedBooks({ books, onBookClick, onNewClick }: BorrowedBooksProps) {
  return (
    <div className="liquid-panel p-5">
      <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">빌린 책</span>
      </h3>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg liquid-badge text-gray-900 text-xs font-medium border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          대여한 책
        </div>

        <button
          onClick={onNewClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20"
        >
          새로 만들기
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      {/* Book Cards */}
      <div className="space-y-3">
        {books.length === 0 ? (
          <div className="text-xs text-gray-400 py-4 text-center">빌린 책이 없습니다.</div>
        ) : (
          books.map(book => (
            <div
              key={book.id}
              onClick={() => onBookClick(book)}
              className="bg-white/60 border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:bg-white transition-colors group shadow-sm"
            >
              {/* Cover Image */}
              {book.coverUrl && (
                <div className="w-full flex justify-center py-4 px-6 bg-gray-50/50">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-36 object-contain rounded-md shadow-lg group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}

              {/* Book Info */}
              <div className="px-4 py-3 space-y-1.5">
                <p className="text-sm text-gray-900 font-medium leading-snug group-hover:text-purple-600 transition-colors">
                  {book.title}
                </p>
                <p className="text-[11px] text-gray-500">{book.author}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-green-500/20 text-green-300">
                    반납완료
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Page */}
      <>
        <button
          onClick={onNewClick}
          className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새 페이지
        </button>
      </>
    </div>
  );
}

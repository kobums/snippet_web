"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';

interface ReadingBooksProps {
  books: UserBookDto[];
  onBookClick: (book: UserBookDto) => void;
  onNewClick: () => void;
}

export default function ReadingBooks({ books, onBookClick, onNewClick }: ReadingBooksProps) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
      <h3 className="text-white font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">읽고 있는 책</span>
      </h3>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-2">
        {/* Left: Status Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          읽는중
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-all" title="확장">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
          <button className="p-2 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-all" title="설정">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          </button>
          <button
            onClick={onNewClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20"
          >
            새로 만들기
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      {/* Book List */}
      <div className="space-y-1.5">
        {books.length === 0 ? (
          <button
            onClick={onNewClick}
            className="w-full py-4 border border-dashed border-white/15 rounded-xl text-sm text-white/30 hover:text-white/50 hover:border-white/25 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            새 페이지
          </button>
        ) : (
          <>
            {books.map(book => {
              const progressPercent = book.totalPage > 0 ? Math.round((book.readPage / book.totalPage) * 100) : 0;
              return (
                <div
                  key={book.id}
                  onClick={() => onBookClick(book)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-8 h-11 object-cover rounded-md shadow-sm shrink-0" />
                  ) : (
                    <div className="w-8 h-11 bg-white/10 rounded-md shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors">{book.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <span className="text-[10px] text-white/40 shrink-0">{progressPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={onNewClick}
              className="mt-1 flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors px-3 py-2 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              새 페이지
            </button>
          </>
        )}
      </div>
    </div>
  );
}

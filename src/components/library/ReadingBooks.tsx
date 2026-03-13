"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { useUIStore } from '@/stores/useUIStore';
import { useBookStore } from '@/stores/useBookStore';
import PanelToolbar from '@/components/ui/PanelToolbar';
import { LibraryListSkeleton } from '@/components/ui/skeleton';

interface ReadingBooksProps {
  books: UserBookDto[];
  loading: boolean;
}

export default function ReadingBooks({ books, loading }: ReadingBooksProps) {
  const { openBookRecord, openSearchModal } = useUIStore();
  const { loadDashboard } = useBookStore();

  return (
    <div className="liquid-panel p-5">
      <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">읽고 있는 책</span>
      </h3>

      <PanelToolbar
        expandUrl="/books/have"
        onNew={() => openSearchModal({ allowedActions: ['have'], defaultStatus: 'reading', onSuccess: loadDashboard })}
      />

      <div className="space-y-1.5">
        {loading ? (
          <LibraryListSkeleton count={3} />
        ) : books.length === 0 ? (
          <button
            onClick={() => openSearchModal({ allowedActions: ['have'], defaultStatus: 'reading', onSuccess: loadDashboard })}
            className="w-full py-4 border border-dashed border-gray-300 rounded-xl text-sm text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
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
                  onClick={() => openBookRecord(book)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-gray-200 hover:bg-white transition-colors cursor-pointer group shadow-sm"
                >
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-8 h-11 object-cover rounded-md shadow-sm shrink-0" />
                  ) : (
                    <div className="w-8 h-11 bg-gray-100 rounded-md shrink-0 border border-gray-200" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate group-hover:text-purple-600 transition-colors">{book.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{progressPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => openSearchModal({ allowedActions: ['have'], defaultStatus: 'reading', onSuccess: loadDashboard })}
              className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
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

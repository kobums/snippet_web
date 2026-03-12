"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { useBookStore } from '@/stores/useBookStore';
import { useUIStore } from '@/stores/useUIStore';
import { patchUserBook } from '@/lib/userBookApi';
import PanelToolbar from '@/components/ui/PanelToolbar';

interface WishlistBooksProps {
  books: UserBookDto[];
}

export default function WishlistBooks({ books }: WishlistBooksProps) {
  const { updateBookLocally } = useBookStore();
  const { openBookRecord, openSearchModal } = useUIStore();

  return (
    <div className="liquid-panel p-5">
      <h3 className="text-gray-900 font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">갖고 싶은 책</span>
      </h3>

      <PanelToolbar
        expandUrl="/books/wishlist"
        onNew={() => openSearchModal({ allowedActions: ['wish'], defaultStatus: 'waiting' })}
      />

      <div className="space-y-3">
        {books.length === 0 ? (
          <div className="text-xs text-gray-400 py-4 text-center">갖고 싶은 책이 없습니다.</div>
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
                    className="h-40 object-contain rounded-md shadow-lg group-hover:scale-[1.02] transition-transform"
                  />
                </div>
              )}
              <div className="px-4 py-3 space-y-2">
                <p className="text-sm text-gray-900 font-medium leading-snug group-hover:text-purple-600 transition-colors">
                  {book.title}
                </p>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await patchUserBook(book.id, { type: 'have', status: 'reading' });
                      updateBookLocally(book.id, { type: 'have', status: 'reading' });
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    소장/읽기시작
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await patchUserBook(book.id, { type: 'borrow', status: 'reading' });
                      updateBookLocally(book.id, { type: 'borrow', status: 'reading' });
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    대여/읽기시작
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => openSearchModal({ allowedActions: ['wish'], defaultStatus: 'waiting' })}
        className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

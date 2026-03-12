"use client"

import React, { useEffect, useState } from 'react';
import { UserBookDto } from '@/types/library';
import { getUserBooks, patchUserBook } from '@/lib/userBookApi';
import { useUIStore } from '@/stores/useUIStore';
import { handleApiError } from '@/lib/errorHandler';

export default function WishlistBooksPage() {
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { openBookRecord, openSearchModal } = useUIStore();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await getUserBooks();
      setBooks(allBooks.filter(b => b.type === 'wish'));
    } catch (e) {
      handleApiError(e, '갖고 싶은 책을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (e: React.MouseEvent, book: UserBookDto, type: 'have' | 'borrow') => {
    e.stopPropagation();
    try {
      await patchUserBook(book.id, { type, status: 'reading' });
      setBooks(prev => prev.filter(b => b.id !== book.id));
    } catch (err) {
      handleApiError(err, '변경에 실패했습니다.');
    }
  };

  const filteredBooks = books.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">갖고 싶은 책</h2>
          <p className="text-sm text-gray-500 mt-1">{books.length}권</p>
        </div>
        <button
          onClick={() => openSearchModal({ allowedActions: ['wish'], defaultStatus: 'waiting' })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl liquid-button text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          추가하기
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="제목이나 저자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
          />
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="liquid-spinner" />
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p className="text-sm">갖고 싶은 책이 없습니다</p>
          <button
            onClick={() => openSearchModal({ allowedActions: ['wish'], defaultStatus: 'waiting' })}
            className="mt-4 text-sm text-purple-500 hover:text-purple-700 transition-colors"
          >
            첫 번째 책을 추가해보세요
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => openBookRecord(book)}
              className="liquid-panel p-3 cursor-pointer hover:scale-[1.02] transition-transform group"
            >
              {book.coverUrl ? (
                <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-gray-50">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2/3] rounded-lg mb-3 bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
              )}
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600 transition-colors">{book.title}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
              <div className="flex flex-col gap-1.5 mt-2">
                <button
                  onClick={(e) => handleConvert(e, book, 'have')}
                  className="w-full text-[11px] font-medium py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  소장/읽기시작
                </button>
                <button
                  onClick={(e) => handleConvert(e, book, 'borrow')}
                  className="w-full text-[11px] font-medium py-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                >
                  대여/읽기시작
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client"

import React, { useEffect, useState } from 'react';
import { UserBookDto } from '@/types/library';
import { getUserBooks } from '@/lib/userBookApi';
import { useUIStore } from '@/stores/useUIStore';
import { handleApiError } from '@/lib/errorHandler';
import { BookGridSkeleton } from '@/components/ui/skeleton';

export default function WaitingBooksPage() {
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { openBookRecord } = useUIStore();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const allBooks = await getUserBooks();
      setBooks(allBooks.filter(b => b.status === 'waiting'));
    } catch (e) {
      handleApiError(e, '읽을 예정인 책을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">읽을 예정</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{books.length}권</p>
        </div>
      </div>

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

      {loading ? (
        <BookGridSkeleton count={6} />
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <p className="text-sm">{searchQuery ? '검색 결과가 없습니다' : '읽을 예정인 책이 없습니다'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              onClick={() => openBookRecord(book)}
              className="liquid-panel p-3 cursor-pointer hover:scale-[1.02] transition-transform group"
            >
              {book.coverUrl ? (
                <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-gray-50">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
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
              <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-600">대기중</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

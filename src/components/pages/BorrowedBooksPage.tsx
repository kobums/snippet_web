"use client"

import React, { useEffect, useState } from 'react';
import { UserBookDto } from '@/types/library';
import { getUserBooks, patchUserBook } from '@/lib/userBookApi';
import { useUIStore } from '@/stores/useUIStore';
import { handleApiError } from '@/lib/errorHandler';
import { BookGridSkeleton } from '@/components/ui/skeleton';

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  waiting:   { text: '대기중', color: 'bg-yellow-100 text-yellow-600' },
  reading:   { text: '읽는중', color: 'bg-blue-100 text-blue-600' },
  completed: { text: '완독',   color: 'bg-green-100 text-green-600' },
  dropped:   { text: '중단',   color: 'bg-gray-100 text-gray-500' },
  none:      { text: '미정',   color: 'bg-gray-100 text-gray-400' },
};

export default function BorrowedBooksPage() {
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
      setBooks(allBooks.filter(b => b.type === 'borrow'));
    } catch (e) {
      handleApiError(e, '빌린 책을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (e: React.MouseEvent, book: UserBookDto) => {
    e.stopPropagation();
    try {
      await patchUserBook(book.id, { type: 'return' });
      setBooks(prev => prev.filter(b => b.id !== book.id));
    } catch (err) {
      handleApiError(err, '반납 처리에 실패했습니다.');
    }
  };

  const filteredBooks = books.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">빌린 책</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{books.length}권</p>
        </div>
        <button
          onClick={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadBooks })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl liquid-button text-sm w-full sm:w-auto justify-center"
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
        <BookGridSkeleton count={6} />
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <p className="text-sm">빌린 책이 없습니다</p>
          <button
            onClick={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadBooks })}
            className="mt-4 text-sm text-purple-500 hover:text-purple-700 transition-colors"
          >
            첫 번째 책을 추가해보세요
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredBooks.map(book => {
            const statusInfo = STATUS_LABELS[book.status] || STATUS_LABELS.none;
            const progressPercent = book.totalPage > 0 ? Math.round((book.readPage / book.totalPage) * 100) : 0;
            return (
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
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                  {book.status === 'reading' && (
                    <span className="text-[10px] text-gray-400">{progressPercent}%</span>
                  )}
                </div>
                <button
                  onClick={(e) => handleReturn(e, book)}
                  className="mt-2 w-full text-[11px] font-medium py-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                >
                  반납 완료
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

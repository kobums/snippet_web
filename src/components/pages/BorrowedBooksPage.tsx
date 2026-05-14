"use client"

import React, { useEffect, useState } from 'react';
import { UserBookDto } from '@/types/library';
import { getUserBooks, patchUserBook } from '@/lib/userBookApi';
import { useUIStore } from '@/stores/useUIStore';
import { handleApiError } from '@/lib/errorHandler';
import { BookGridSkeleton } from '@/components/ui/skeleton';

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  waiting:   { text: '대기중', color: 'bg-warning/15 text-amber-700' },
  reading:   { text: '읽는중', color: 'bg-info/15 text-info' },
  completed: { text: '완독',   color: 'bg-secondary/15 text-secondary' },
  dropped:   { text: '중단',   color: 'bg-gray-100 text-gray-500 dark:text-[#a0a0a0]' },
  none:      { text: '미정',   color: 'bg-gray-100 text-gray-400 dark:text-[#666]' },
};

function getDDayInfo(returnDate: string | null | undefined) {
  if (!returnDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(returnDate); due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: `연체 ${-diff}일`, cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' };
  if (diff === 0) return { label: '오늘 반납', cls: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' };
  if (diff <= 3) return { label: `D-${diff}`, cls: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' };
  return { label: `D-${diff}`, cls: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function BorrowedBooksPage() {
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dateInput, setDateInput] = useState('');
  const { openBookRecord, openSearchModal } = useUIStore();

  useEffect(() => { loadBooks(); }, []);

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

  const handleSaveReturnDate = async (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation();
    try {
      await patchUserBook(bookId, { returnDate: dateInput || null });
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, returnDate: dateInput || null } : b));
      setEditingId(null);
    } catch (err) {
      handleApiError(err, '반납 기한 설정에 실패했습니다.');
    }
  };

  const overdueCount = books.filter(b => {
    if (!b.returnDate) return false;
    const due = new Date(b.returnDate); due.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const filteredBooks = books.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f0f0f0] flex items-center gap-2">
            빌린 책
            {overdueCount > 0 && (
              <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                연체 {overdueCount}권
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a0a0a0] mt-1">{books.length}권</p>
        </div>
        <button
          onClick={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadBooks })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl liquid-button text-sm w-full sm:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          추가하기
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#666]">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="제목이나 저자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 text-sm text-gray-800 dark:text-[#d0d0d0] placeholder-gray-400 dark:placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <BookGridSkeleton count={6} />
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-[#666]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 opacity-50">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <p className="text-sm">빌린 책이 없습니다</p>
          <button onClick={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadBooks })} className="mt-4 text-sm text-accent hover:text-accent/80 transition-colors">
            첫 번째 책을 추가해보세요
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredBooks.map(book => {
            const statusInfo = STATUS_LABELS[book.status] || STATUS_LABELS.none;
            const progressPercent = book.totalPage > 0 ? Math.round((book.readPage / book.totalPage) * 100) : 0;
            const dday = getDDayInfo(book.returnDate);
            return (
              <div
                key={book.id}
                onClick={() => openBookRecord(book)}
                className="liquid-panel p-3 cursor-pointer hover:scale-[1.02] transition-transform group"
              >
                {book.coverUrl ? (
                  <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-gray-50 dark:bg-white/5">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-[2/3] rounded-lg mb-3 bg-gray-100 dark:bg-white/8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-[#444]">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-900 dark:text-[#f0f0f0] truncate group-hover:text-accent transition-colors">{book.title}</p>
                <p className="text-xs text-gray-500 dark:text-[#a0a0a0] truncate mt-0.5">{book.author}</p>

                {/* 반납 기한 */}
                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  {editingId === book.id ? (
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="w-full text-xs border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 bg-white dark:bg-white/5 text-gray-900 dark:text-[#f0f0f0]"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button onClick={(e) => handleSaveReturnDate(e, book.id)} className="flex-1 text-[10px] font-medium py-1 rounded-md bg-primary/10 text-primary transition-colors">저장</button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="flex-1 text-[10px] py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-[#a0a0a0] transition-colors">취소</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(book.id); setDateInput(book.returnDate ? book.returnDate.split('T')[0] : ''); }}
                      className={`w-full text-[10px] font-medium px-2 py-1 rounded-md border transition-colors text-left ${dday ? `${dday.cls}` : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10 dark:text-[#666]'}`}
                    >
                      {book.returnDate ? `${formatDate(book.returnDate)}${dday ? ` (${dday.label})` : ''}` : '반납 기한 설정'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${statusInfo.color}`}>{statusInfo.text}</span>
                  {book.status === 'reading' && <span className="text-[10px] text-gray-400 dark:text-[#666]">{progressPercent}%</span>}
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

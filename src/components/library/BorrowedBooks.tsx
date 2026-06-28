"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import { useUIStore } from '@/stores/useUIStore';
import { useBookStore } from '@/stores/useBookStore';
import { patchUserBook } from '@/lib/userBookApi';
import { handleApiError } from '@/lib/errorHandler';
import PanelToolbar from '@/components/ui/PanelToolbar';
import { LibraryCardSkeleton } from '@/components/ui/skeleton';
import { DatePicker } from '@/components/ui/DatePicker';

interface BorrowedBooksProps {
  books: UserBookDto[];
  loading: boolean;
}

function getDDayInfo(returnDate: string | null | undefined): { label: string; color: string; bg: string } | null {
  if (!returnDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(returnDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: `연체 ${-diff}일`, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20' };
  if (diff === 0) return { label: '오늘 반납', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' };
  if (diff <= 3) return { label: `D-${diff}`, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' };
  return { label: `D-${diff}`, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20' };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function BorrowedBooks({ books, loading }: BorrowedBooksProps) {
  const { openBookRecord, openSearchModal } = useUIStore();
  const { updateBookLocally, loadDashboard } = useBookStore();
  const [editingReturnDate, setEditingReturnDate] = useState<number | null>(null);

  const handleReturn = async (e: React.MouseEvent, book: UserBookDto) => {
    e.stopPropagation();
    await patchUserBook(book.id, { type: 'return' });
    updateBookLocally(book.id, { type: 'return', status: 'completed' });
  };

  const handleSaveReturnDate = async (bookId: number, date: string | null) => {
    try {
      await patchUserBook(bookId, { returnDate: date });
      updateBookLocally(bookId, { returnDate: date });
      setEditingReturnDate(null);
    } catch (err) {
      handleApiError(err, '반납 기한 설정에 실패했습니다.');
    }
  };

  const openReturnDateEdit = (e: React.MouseEvent, book: UserBookDto) => {
    e.stopPropagation();
    setEditingReturnDate(book.id);
  };

  const overdueCount = books.filter(b => {
    if (!b.returnDate) return false;
    const due = new Date(b.returnDate);
    due.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  return (
    <div className="liquid-panel p-5">
      <h3 className="text-gray-900 dark:text-[#f0f0f0] font-medium mb-4 flex items-center gap-2">
        <span className="text-lg">빌린 책</span>
        {overdueCount > 0 && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
            연체 {overdueCount}권
          </span>
        )}
      </h3>

      <PanelToolbar
        expandUrl="/books/borrow"
        onNew={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadDashboard })}
      />

      <div className="space-y-3">
        {loading ? (
          <LibraryCardSkeleton count={2} />
        ) : books.length === 0 ? (
          <div className="text-xs text-gray-400 dark:text-[#666] py-4 text-center">빌린 책이 없습니다.</div>
        ) : (
          books.map(book => {
            const dday = getDDayInfo(book.returnDate);
            return (
              <div
                key={book.id}
                onClick={() => openBookRecord(book)}
                className="bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors group shadow-sm"
              >
                {book.coverUrl && (
                  <div className="w-full flex justify-center py-4 px-6 bg-gray-50/50 dark:bg-white/2">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="h-36 object-contain rounded-md shadow-lg group-hover:scale-[1.02] transition-transform"
                    />
                  </div>
                )}
                <div className="px-4 py-3 space-y-1.5">
                  <p className="text-sm text-gray-900 dark:text-[#f0f0f0] font-medium leading-snug group-hover:text-accent transition-colors">
                    {book.title}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-[#a0a0a0]">{book.author}</p>

                  {/* 반납 기한 */}
                  <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        onClick={(e) => openReturnDateEdit(e, book)}
                        className={`flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                          dday
                            ? `${dday.bg} ${dday.color}`
                            : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10 dark:text-[#666] hover:text-gray-600'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {book.returnDate
                          ? <>{formatDate(book.returnDate)} {dday && <span className="font-semibold">({dday.label})</span>}</>
                          : '반납 기한 설정'
                        }
                      </button>
                      {editingReturnDate === book.id && (
                        <DatePicker
                          value={book.returnDate ? book.returnDate.split('T')[0] : null}
                          onChange={(date) => handleSaveReturnDate(book.id, date)}
                          onClose={() => setEditingReturnDate(null)}
                        />
                      )}
                    </div>

                    <button
                      onClick={(e) => handleReturn(e, book)}
                      className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:bg-white/10 dark:text-[#f0f0f0] hover:bg-primary/15 dark:hover:bg-white/15 transition-colors shrink-0"
                    >
                      반납 완료
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      book.status === 'reading' ? 'bg-info/20 text-info' :
                      book.status === 'waiting' ? 'bg-warning/20 text-warning' :
                      'bg-gray-500/20 text-gray-400 dark:text-[#666]'
                    }`}>
                      {book.status === 'reading' ? '읽는 중' : book.status === 'waiting' ? '대기 중' : book.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={() => openSearchModal({ allowedActions: ['borrow'], defaultStatus: 'reading', onSuccess: loadDashboard })}
        className="mt-1 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-[#666] hover:text-gray-600 dark:text-[#a0a0a0] transition-colors px-3 py-2 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        새 페이지
      </button>
    </div>
  );
}

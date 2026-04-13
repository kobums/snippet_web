'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { PopularBookDto } from '@/types/popular';
import { getPopularBooks } from '@/lib/popularBookApi';
import { addUserBook } from '@/lib/userBookApi';
import { LibraryAddRequestDto } from '@/types/library';
import toast from 'react-hot-toast';

// ============================================================================
// Filter definitions
// ============================================================================
type PeriodKey = '1month' | '3months' | '1year';

const PERIODS: { key: PeriodKey; label: string; days: number }[] = [
  { key: '1month', label: '1개월', days: 30 },
  { key: '3months', label: '3개월', days: 90 },
  { key: '1year', label: '1년', days: 365 },
];

const KDC_CATEGORIES = [
  { code: '', label: '전체' },
  { code: '8', label: '문학' },
  { code: '3', label: '사회' },
  { code: '9', label: '역사' },
  { code: '1', label: '철학' },
  { code: '4', label: '자연과학' },
  { code: '5', label: '기술/공학' },
  { code: '6', label: '예술' },
  { code: '7', label: '언어' },
];

const AGE_FILTERS = [
  { code: '', label: '전체' },
  { code: '6', label: '영유아' },
  { code: '8', label: '초등' },
  { code: '14', label: '청소년' },
  { code: '20', label: '20대' },
  { code: '30', label: '30대' },
  { code: '40', label: '40대' },
  { code: '50', label: '50대' },
  { code: '60', label: '60대+' },
];

const GENDER_FILTERS = [
  { code: '', label: '전체' },
  { code: '1', label: '남성' },
  { code: '2', label: '여성' },
];

// ============================================================================
// Helpers
// ============================================================================
function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function getRankStyle(rank: number): string {
  if (rank === 1) return 'text-yellow-500 font-bold';
  if (rank === 2) return 'text-gray-400 font-bold';
  if (rank === 3) return 'text-amber-600 font-bold';
  return 'text-gray-400';
}

// ============================================================================
// Main component
// ============================================================================
export default function PopularBooks() {
  const [books, setBooks] = useState<PopularBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<PeriodKey>('1month');
  const [kdc, setKdc] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const fetchBooks = useCallback(
    async (pageNo: number) => {
      const currentPeriod = PERIODS.find((p) => p.key === period)!;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - currentPeriod.days);

      if (pageNo === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const data = await getPopularBooks({
          startDt: formatDate(startDate),
          endDt: formatDate(endDate),
          kdc: kdc || undefined,
          age: age || undefined,
          gender: gender || undefined,
          pageNo,
          pageSize: 20,
        });

        if (pageNo === 1) {
          setBooks(data);
        } else {
          setBooks((prev) => [...prev, ...data]);
        }
        setPage(pageNo);
        setHasMore(data.length >= 20);
      } catch {
        // 에러 시 빈 상태 유지
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [period, kdc, age, gender]
  );

  useEffect(() => {
    fetchBooks(1);
  }, [fetchBooks]);

  const handleAddToLibrary = async (
    book: PopularBookDto,
    type: 'have' | 'borrow' | 'wish'
  ) => {
    try {
      const now = new Date().toISOString();
      const payload: LibraryAddRequestDto = {
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        pubDate: '',
        isbn: book.isbn13,
        coverUrl: book.coverUrl,
        totalPage: null,
        type,
        status: type === 'wish' ? 'none' : 'waiting',
        readPage: 0,
        startDate: now,
        endDate: now,
        createDate: now,
      };
      await addUserBook(payload);
      toast.success('서재에 추가되었습니다');
    } catch {
      toast.error('추가에 실패했습니다');
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBooks(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-semibold text-gray-900">인기 도서</h1>
          <p className="text-sm text-gray-500 mt-0.5">전국 공공도서관 인기 대출 도서</p>
        </div>

        {/* 기간 필터 */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 장르 필터 */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {KDC_CATEGORIES.map((cat) => (
            <button
              key={cat.code}
              onClick={() => setKdc(cat.code)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                kdc === cat.code
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 연령 필터 */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {AGE_FILTERS.map((a) => (
            <button
              key={a.code}
              onClick={() => setAge(a.code)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                age === a.code
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* 성별 필터 */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {GENDER_FILTERS.map((g) => (
            <button
              key={g.code}
              onClick={() => setGender(g.code)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                gender === g.code
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Book list */}
      <div className="py-2">
        {loading ? (
          <BookListSkeleton />
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {books.map((book) => (
              <PopularBookRow
                key={`${book.rank}-${book.isbn13}`}
                book={book}
                onAdd={(type) => handleAddToLibrary(book, type)}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center py-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  {loadingMore ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================
function PopularBookRow({
  book,
  onAdd,
}: {
  book: PopularBookDto;
  onAdd: (type: 'have' | 'borrow' | 'wish') => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      {/* 순위 */}
      <div className={`w-8 text-center text-sm ${getRankStyle(book.rank)}`}>
        {book.rank <= 3 && <span className="block text-xs">🏆</span>}
        <span>{book.rank}위</span>
      </div>

      {/* 표지 */}
      <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden bg-gray-100">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{book.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{book.author}</p>
        <p className="text-xs text-gray-400 truncate">{book.publisher}</p>
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-xs text-gray-400">대출 {formatCount(book.loanCount)}회</span>
        </div>
      </div>

      {/* 추가 버튼 + 드롭다운 */}
      <div className="relative shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="서재에 추가"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[100px]">
              {(['have', 'borrow', 'wish'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { onAdd(type); setOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {type === 'have' ? '소장' : type === 'borrow' ? '대출' : '위시'}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BookListSkeleton() {
  return (
    <div className="divide-y divide-gray-50">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-100 rounded" />
          <div className="w-12 h-16 bg-gray-100 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <svg
        className="w-16 h-16 text-gray-200 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
      <p className="text-gray-400 text-sm">인기 도서 정보를 불러올 수 없습니다</p>
    </div>
  );
}

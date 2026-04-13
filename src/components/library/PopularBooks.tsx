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

function getRankColor(rank: number): string {
  if (rank === 1) return '#f59e0b';
  if (rank === 2) return '#9ca3af';
  if (rank === 3) return '#b45309';
  return 'var(--lg-text-tertiary)';
}

// ============================================================================
// FilterChip
// ============================================================================
function FilterChip({
  label,
  selected,
  onTap,
}: {
  label: string;
  selected: boolean;
  onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
      style={
        selected
          ? {
              background: 'linear-gradient(135deg, rgba(66,66,66,0.92), rgba(26,26,26,0.96))',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }
          : {
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(12px)',
              color: 'var(--lg-text-secondary)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }
      }
    >
      {label}
    </button>
  );
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
        // silent
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

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-48 lg:px-64 py-4 sm:py-6">

      {/* Page title */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--lg-text-primary)' }}>
          인기 도서
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--lg-text-secondary)' }}>
          전국 공공도서관 인기 대출 도서
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-2 mb-5">
        {/* 기간 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {PERIODS.map((p) => (
            <FilterChip
              key={p.key}
              label={p.label}
              selected={period === p.key}
              onTap={() => setPeriod(p.key)}
            />
          ))}
        </div>
        {/* 장르 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {KDC_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.code}
              label={cat.label}
              selected={kdc === cat.code}
              onTap={() => setKdc(cat.code)}
            />
          ))}
        </div>
        {/* 연령 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {AGE_FILTERS.map((a) => (
            <FilterChip
              key={a.code}
              label={a.label}
              selected={age === a.code}
              onTap={() => setAge(a.code)}
            />
          ))}
        </div>
        {/* 성별 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {GENDER_FILTERS.map((g) => (
            <FilterChip
              key={g.code}
              label={g.label}
              selected={gender === g.code}
              onTap={() => setGender(g.code)}
            />
          ))}
        </div>
      </div>

      {/* Book list */}
      {loading ? (
        <BookListSkeleton />
      ) : books.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {books.map((book) => (
            <PopularBookRow
              key={`${book.rank}-${book.isbn13}`}
              book={book}
              onAdd={(type) => handleAddToLibrary(book, type)}
            />
          ))}

          {hasMore && (
            <div className="flex justify-center pt-4 pb-2">
              <button
                onClick={() => !loadingMore && fetchBooks(page + 1)}
                disabled={loadingMore}
                className="px-6 py-2 text-sm rounded-full liquid-button disabled:opacity-50"
              >
                {loadingMore ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </div>
      )}
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
    <div
      className="liquid-panel flex items-center gap-3 px-4 py-3 cursor-default"
      style={{ borderRadius: '16px' }}
    >
      {/* 순위 */}
      <div className="w-8 shrink-0 text-center">
        <span
          className="text-xs font-bold"
          style={{ color: getRankColor(book.rank) }}
        >
          {book.rank}
        </span>
      </div>

      {/* 표지 */}
      <div className="relative w-10 h-14 shrink-0 rounded-lg overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.06)' }}>
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ color: 'var(--lg-text-tertiary)' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold line-clamp-1 leading-snug"
          style={{ color: 'var(--lg-text-primary)' }}>
          {book.title}
        </p>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--lg-text-secondary)' }}>
          {book.author}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          {book.kdcName && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md liquid-badge"
              style={{ color: 'var(--lg-text-secondary)' }}
            >
              {book.kdcName.split(' > ').pop()}
            </span>
          )}
          <span className="text-[10px]" style={{ color: 'var(--lg-text-tertiary)' }}>
            대출 {formatCount(book.loanCount)}회
          </span>
        </div>
      </div>

      {/* 추가 버튼 */}
      <div className="relative shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-8 h-8 flex items-center justify-center rounded-full liquid-button"
          aria-label="서재에 추가"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              className="absolute right-0 top-10 z-20 liquid-panel py-1 min-w-[96px]"
              style={{ borderRadius: '14px' }}
            >
              {(['have', 'borrow', 'wish'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { onAdd(type); setOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/30 first:rounded-t-[13px] last:rounded-b-[13px]"
                  style={{ color: 'var(--lg-text-primary)' }}
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
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="liquid-panel flex items-center gap-3 px-4 py-3 animate-pulse"
          style={{ borderRadius: '16px' }}>
          <div className="w-8 h-4 rounded" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <div className="w-10 h-14 rounded-lg" style={{ background: 'rgba(0,0,0,0.06)' }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded-md w-3/4" style={{ background: 'rgba(0,0,0,0.06)' }} />
            <div className="h-3 rounded-md w-1/2" style={{ background: 'rgba(0,0,0,0.06)' }} />
            <div className="h-3 rounded-md w-1/3" style={{ background: 'rgba(0,0,0,0.06)' }} />
          </div>
          <div className="w-8 h-8 rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="liquid-panel w-20 h-20 flex items-center justify-center mb-4" style={{ borderRadius: '24px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          style={{ color: 'var(--lg-text-tertiary)' }}>
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--lg-text-secondary)' }}>
        인기 도서 정보를 불러올 수 없습니다
      </p>
      <p className="text-xs mt-1" style={{ color: 'var(--lg-text-tertiary)' }}>
        잠시 후 다시 시도해주세요
      </p>
    </div>
  );
}

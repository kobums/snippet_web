"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { searchBooks } from '@/lib/bookApi';
import { addUserBook } from '@/lib/userBookApi';
import { BookSearchDto } from '@/types/library';
import { useBookStore } from '@/stores/useBookStore';
import { SearchResultSkeleton } from '@/components/ui/skeleton';

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  allowedActions?: ('wish' | 'have' | 'borrow')[];
  defaultStatus?: 'none' | 'waiting' | 'reading' | 'completed' | 'dropped';
}

export default function BookSearchModal({ isOpen, onClose, onSuccess, allowedActions, defaultStatus }: BookSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savingIsbn, setSavingIsbn] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      // 모달이 닫힐 때 검색어와 결과 초기화
      setQuery('');
      setResults([]);
      setPage(1);
      setHasMore(true);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Debounce search (first page)
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setPage(1);
      setHasMore(true);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setPage(1);
      try {
        const data = await searchBooks(query, 1);
        setResults(data);
        setHasMore(data.length === 10); // 10개 미만이면 더 이상 없음
      } catch (error) {
        console.error("Failed to search books:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Infinite scroll - load more when observer target is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore && query.trim().length >= 2) {
          loadMoreResults();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, loadingMore, query, page]);

  const loadMoreResults = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await searchBooks(query, nextPage);
      setResults((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === 10); // 10개 미만이면 더 이상 없음
    } catch (error) {
      console.error("Failed to load more books:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddBook = async (
    book: BookSearchDto,
    type: 'wish' | 'borrow' | 'have',
    status: 'none' | 'waiting' | 'reading' | 'completed' | 'dropped' = 'waiting'
  ) => {
    const { addBookLocally, removeBookLocally, updateBookId } = useBookStore.getState();

    // 1️⃣ 즉시 UI에 추가 (임시 ID)
    const newBook = {
      bookId: 0, // 임시값
      ...book,
      totalPage: book.totalPage || 0, // null을 0으로 변환
      type,
      status,
      readPage: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      createDate: new Date().toISOString()
    };
    const tempId = addBookLocally(newBook);

    // 2️⃣ 모달 즉시 닫기 (사용자 경험 개선)
    onClose();

    try {
      // 3️⃣ 백그라운드 API 호출
      const now = new Date().toISOString();
      const realId = await addUserBook({
        ...book,
        type,
        status,
        readPage: 0,
        startDate: now,
        endDate: now,
        createDate: now,
      });

      // 4️⃣ 성공: 임시 ID → 실제 ID 교체
      updateBookId(tempId, realId);

      // 5️⃣ 성공 콜백 호출 (페이지 목록 갱신)
      onSuccess?.();

      // 6️⃣ 성공 토스트
      toast.success(`"${book.title}" 책이 추가되었습니다`);

    } catch (e) {
      // 6️⃣ 실패: 롤백 + 에러 토스트
      removeBookLocally(tempId);
      toast.error('책 추가에 실패했습니다. 다시 시도해주세요.');
      console.error("Failed to add book", e);
    }
  };

  if (!isOpen) return null;

  const showWish = !allowedActions || allowedActions.includes('wish');
  const showHave = !allowedActions || allowedActions.includes('have');
  const showBorrow = !allowedActions || allowedActions.includes('borrow');
  const effectiveStatus = defaultStatus || 'reading';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="w-full max-w-md bg-white/95 border border-gray-200 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header & Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4 text-gray-900">
              <h2 className="text-xl font-bold">도서 검색 및 추가</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                ✕
              </button>
            </div>
            <input 
              type="text" 
              placeholder="책 제목이나 저자를 입력하세요" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all font-light"
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && <SearchResultSkeleton count={3} />}

            {!loading && query.length > 1 && results.length === 0 && (
              <div className="text-center text-gray-500 py-4">검색 결과가 없습니다.</div>
            )}

            {results.map((book, index) => (
              <div key={book.isbn || `book-${index}`} className="flex gap-4 p-3 rounded-2xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
                ) : (
                  <div className="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}

                <div className="flex-1 flex flex-col">
                  <h3 className="text-gray-900 font-medium line-clamp-2 leading-tight">{book.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{book.author}</p>
                  <p className="text-gray-400 text-xs">{book.publisher} · {book.pubDate}</p>

                  <div className="mt-auto pt-2 flex gap-2">
                    {showWish && (
                      <button
                        onClick={() => handleAddBook(book, 'wish', 'none')}
                        disabled={savingIsbn === book.isbn}
                        className="flex-1 py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        {savingIsbn === book.isbn ? '저장 중...' : '위시리스트'}
                      </button>
                    )}
                    {showHave && (
                      <>
                        <button
                          onClick={() => handleAddBook(book, 'have', 'waiting')}
                          disabled={savingIsbn === book.isbn}
                          className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          {savingIsbn === book.isbn ? '저장 중...' : '소장/대기중'}
                        </button>
                        <button
                          onClick={() => handleAddBook(book, 'have', 'reading')}
                          disabled={savingIsbn === book.isbn}
                          className="flex-1 py-1.5 px-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          {savingIsbn === book.isbn ? '저장 중...' : '소장/읽기시작'}
                        </button>
                      </>
                    )}
                    {showBorrow && (
                      <>
                        <button
                          onClick={() => handleAddBook(book, 'borrow', 'waiting')}
                          disabled={savingIsbn === book.isbn}
                          className="flex-1 py-1.5 px-2 bg-green-50 hover:bg-green-100 text-green-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          {savingIsbn === book.isbn ? '저장 중...' : '대여/대기중'}
                        </button>
                        <button
                          onClick={() => handleAddBook(book, 'borrow', 'reading')}
                          disabled={savingIsbn === book.isbn}
                          className="flex-1 py-1.5 px-2 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          {savingIsbn === book.isbn ? '저장 중...' : '대여/읽기시작'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Infinite scroll observer target */}
            {!loading && results.length > 0 && (
              <div ref={observerTarget} className="py-2">
                {loadingMore && (
                  <div className="text-center text-gray-400 text-sm">더 많은 책 불러오는 중...</div>
                )}
                {!loadingMore && !hasMore && (
                  <div className="text-center text-gray-400 text-sm">모든 검색 결과를 확인했습니다.</div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

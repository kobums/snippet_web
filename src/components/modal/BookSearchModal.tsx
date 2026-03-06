"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchBooks, addBookToLibrary } from '@/lib/libraryApi';
import { BookSearchDto } from '@/types/library';

interface BookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BookSearchModal({ isOpen, onClose, onSuccess }: BookSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingIsbn, setSavingIsbn] = useState<string | null>(null);

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Debounce search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchBooks(query);
        setResults(data);
      } catch (error) {
        console.error("Failed to search books:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddBook = async (
    book: BookSearchDto, 
    type: 'wish' | 'borrow' | 'have', 
    status: 'waiting' | 'reading' | 'completed' | 'dropped' = 'waiting'
  ) => {
    setSavingIsbn(book.isbn);
    try {
      const now = new Date().toISOString();
      await addBookToLibrary({ 
        ...book, 
        type, 
        status, 
        startDate: now, 
        endDate: now 
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      console.error("Failed to add book", e);
      alert("책 추가에 실패했습니다.");
    } finally {
      setSavingIsbn(null);
    }
  };

  if (!isOpen) return null;

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
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-light"
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && <div className="text-center text-gray-500 py-4">검색 중...</div>}
            
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
                    <button 
                      onClick={() => handleAddBook(book, 'wish', 'waiting')}
                      disabled={savingIsbn === book.isbn}
                      className="flex-1 py-1.5 px-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingIsbn === book.isbn ? '저장 중...' : '위시리스트'}
                    </button>
                    <button 
                      onClick={() => handleAddBook(book, 'have', 'reading')}
                      disabled={savingIsbn === book.isbn}
                      className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingIsbn === book.isbn ? '저장 중...' : '소장/읽기시작'}
                    </button>
                    <button 
                      onClick={() => handleAddBook(book, 'borrow', 'reading')}
                      disabled={savingIsbn === book.isbn}
                      className="flex-1 py-1.5 px-2 bg-green-50 hover:bg-green-100 text-green-600 text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      {savingIsbn === book.isbn ? '저장 중...' : '대여/읽기시작'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

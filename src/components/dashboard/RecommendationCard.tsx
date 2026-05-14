"use client"

import React, { useEffect, useState } from 'react';
import { getRecommendations } from '@/lib/recommendApi';
import type { BookRecommendDto } from '@/types/recommend';
import { useUIStore } from '@/stores/useUIStore';

export default function RecommendationCard() {
  const [books, setBooks] = useState<BookRecommendDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { openSearchModal } = useUIStore();

  useEffect(() => {
    getRecommendations(6).then(setBooks).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (!loading && books.length === 0) return null;

  return (
    <div className="liquid-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 dark:text-[#f0f0f0] font-medium text-base flex items-center gap-2">
          ✨ 추천 도서
        </h3>
        <button
          onClick={() => getRecommendations(6).then(setBooks).catch(() => {})}
          className="text-xs text-gray-400 dark:text-[#666] hover:text-accent transition-colors"
        >
          새로고침
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-gray-100 dark:bg-white/8 mb-2" />
              <div className="h-2.5 bg-gray-100 dark:bg-white/8 rounded w-full mb-1" />
              <div className="h-2 bg-gray-100 dark:bg-white/8 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {books.map(book => (
            <div key={book.id} className="group">
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-50 dark:bg-white/5 mb-2">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-[#444]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-[#f0f0f0] truncate leading-tight">{book.title}</p>
              <p className="text-[10px] text-gray-400 dark:text-[#666] truncate mt-0.5">{book.author}</p>
              {book.reason && (
                <p className="text-[9px] text-accent/70 truncate mt-0.5">{book.reason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

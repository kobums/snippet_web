"use client"

import { useState } from 'react';

interface RatingModalProps {
  bookTitle: string;
  initialRating?: number | null;
  onSubmit: (rating: number | null) => void;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: '별로였어요',
  2: '조금 아쉬웠어요',
  3: '괜찮았어요',
  4: '좋았어요',
  5: '최고였어요!',
};

export default function RatingModal({ bookTitle, initialRating, onSubmit, onClose }: RatingModalProps) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating ?? 0);

  const displayRating = hovered || selected;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-96 liquid-panel rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 mx-0 sm:mx-4">
        <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="text-center mb-6">
          <div className="text-2xl mb-2">🎉</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f0f0f0] mb-1">독서 완료!</h2>
          <p className="text-sm text-gray-500 dark:text-[#a0a0a0] line-clamp-2">{bookTitle}</p>
          <p className="text-xs text-gray-400 dark:text-[#666] mt-2">이 책은 어떠셨나요?</p>
        </div>

        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(selected === star ? 0 : star)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <svg
                className={`w-10 h-10 transition-colors ${
                  star <= displayRating ? 'text-yellow-400' : 'text-gray-200 dark:text-white/15'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="h-5 text-center mb-6">
          {displayRating > 0 && (
            <span className="text-sm text-primary font-medium">{RATING_LABELS[displayRating]}</span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { onSubmit(null); onClose(); }}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-[#a0a0a0] text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            건너뛰기
          </button>
          <button
            onClick={() => { onSubmit(selected || null); onClose(); }}
            disabled={selected === 0}
            className="flex-1 py-3 rounded-xl liquid-button text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

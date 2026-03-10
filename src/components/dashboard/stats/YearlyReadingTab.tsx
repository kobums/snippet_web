"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import { formatDate } from '@/lib/util';

interface YearlyReadingTabProps {
  readingBooks: UserBookDto[];
  completedBooks: UserBookDto[];
}

export default function YearlyReadingTab({ readingBooks, completedBooks }: YearlyReadingTabProps) {
  const [readingExpanded, setReadingExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-6">

      {/* 진행중 섹션 */}
      <div>
        <button onClick={() => setReadingExpanded(p => !p)}
          className="flex items-center gap-2 mb-3 text-xs text-gray-500 hover:text-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${readingExpanded ? 'rotate-90' : ''}`}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">진행중</span>
          <span className="text-gray-400">{readingBooks.length}</span>
        </button>

        {readingExpanded && (
          <div className="flex flex-col gap-1.5 pl-1">
            {readingBooks.length === 0 ? (
              <p className="text-xs text-gray-400 pl-2">진행 중인 책이 없습니다.</p>
            ) : (
              readingBooks.map(b => (
                <BookRow key={b.id} book={b} status="reading" />
              ))
            )}
            <AddRow />
          </div>
        )}
      </div>

      {/* 완료 섹션 */}
      <div>
        <button onClick={() => setCompletedExpanded(p => !p)}
          className="flex items-center gap-2 mb-3 text-xs text-gray-500 hover:text-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform ${completedExpanded ? 'rotate-90' : ''}`}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span className="bg-[#5ebd8a] text-white text-[10px] px-2 py-0.5 rounded-full font-medium">완료</span>
          <span className="text-gray-400">{completedBooks.length}</span>
        </button>

        {completedExpanded && (
          <div className="flex flex-col gap-1.5 pl-1">
            {completedBooks.length === 0 ? (
              <p className="text-xs text-gray-400 pl-2">완료된 책이 없습니다.</p>
            ) : (
              completedBooks.map(b => (
                <BookRow key={b.id} book={b} status="completed" />
              ))
            )}
            <AddRow />
          </div>
        )}
      </div>

      {/* 설명 */}
      <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 flex gap-2">
          <span>💡</span>
          <span>'올해 읽은 책'은 올해 중에 책 읽기를 완료했거나 중단한 책을 표시합니다.</span>
        </p>
        <p className="text-[11px] text-gray-400 flex gap-2">
          <span>💡</span>
          <span>'월별 완료한 책'은 올 한 해 동안 월별로 읽기 완료했거나 중단한 책의 권수를 표시합니다.</span>
        </p>
      </div>
    </div>
  );
}

function BookRow({ book, status }: { book: UserBookDto; status: string }) {
  const isCompleted = status === 'completed';
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-white/40 rounded-lg px-2 py-1 transition-all cursor-pointer group">
      <span className="shrink-0">{isCompleted ? '✅' : '😊'}</span>
      <span className="text-gray-400 shrink-0 tabular-nums">
        {formatDate(book.startDate)} ~ {isCompleted ? formatDate(book.endDate) : ''}
      </span>
      <span className="text-gray-500 shrink-0">
        《<span className="text-gray-800 group-hover:text-purple-600 transition-colors">{book.title}</span>》
      </span>
      <span className="text-gray-400">읽기</span>
    </div>
  );
}

function AddRow() {
  return (
    <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 px-2 py-2 w-full transition-colors border-t border-transparent hover:border-gray-50">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      새 페이지
    </button>
  );
}

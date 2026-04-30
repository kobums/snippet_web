"use client"

import React from 'react';
import { RecordDto } from '@/types/record';
import { formatDate } from '@/lib/util';
import { RecordCardSkeleton } from '@/components/ui/skeleton';

interface RecordListProps {
  records: RecordDto[];
  loading: boolean;
  onOpenForm: () => void;
  onRecordClick?: (bookId: number) => void;
}

export default function RecordList({ records, loading, onOpenForm, onRecordClick }: RecordListProps) {
  if (loading) {
    return <RecordCardSkeleton count={3} />;
  }

  if (records.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-10">
        <div className="w-16 h-16 bg-gray-50 dark:bg-white/6 rounded-full flex items-center justify-center text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
        </div>
        <div className="text-center">
          <p className="text-gray-400 dark:text-[#666] text-sm sm:text-base">작성된 기록이 없습니다.</p>
          <button
            onClick={onOpenForm}
            className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-blue-500 hover:text-blue-600 font-medium bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all border border-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            첫 기록 작성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
      {records.map(record => (
        <div key={record.id} onClick={() => onRecordClick?.(record.bookId)} className="bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 rounded-2xl px-3 sm:px-3.5 py-2.5 sm:py-3 flex flex-col shadow-sm hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer group">
          {/* 헤더: 태그 (제목) + 날짜 */}
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-[#666] shrink-0"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-[#f0f0f0] truncate">
              {record.tag ? `@${record.tag}` : record.type === 'diary' ? '일기' : record.type === 'review' ? '리뷰' : '밑줄'}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 dark:text-[#666] ml-auto tabular-nums shrink-0">{formatDate(record.createDate)}</span>
          </div>

          <div className="border-t border-gray-100 dark:border-white/8 pt-2 flex flex-col gap-1.5">
            {/* 책 제목 */}
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-[#666] shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-[#a0a0a0] truncate">{record.bookTitle}</span>
            </div>

            {/* 읽은 부분 */}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a0a0a0]">p.{record.relatedPage}</p>

            {/* 본문 */}
            <p className="text-xs sm:text-sm text-gray-700 dark:text-[#d0d0d0] leading-relaxed whitespace-pre-wrap line-clamp-2">{record.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

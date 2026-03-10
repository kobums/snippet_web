"use client"

import React from 'react';
import { RecordDto } from '@/types/record';
import { formatDate } from '@/lib/util';

interface RecordListProps {
  records: RecordDto[];
  loading: boolean;
  onOpenForm: () => void;
  onRecordClick?: (bookId: number) => void;
}

export default function RecordList({ records, loading, onOpenForm, onRecordClick }: RecordListProps) {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400">기록을 불러오는 중...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">작성된 기록이 없습니다.</p>
          <button
            onClick={onOpenForm}
            className="mt-4 flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            첫 기록 작성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {records.map(record => (
        <div key={record.id} onClick={() => onRecordClick?.(record.bookId)} className="bg-white/60 border border-gray-200 rounded-2xl px-3 py-2.5 flex flex-col shadow-sm hover:bg-white transition-colors cursor-pointer group">
          {/* 헤더: 태그 (제목) + 날짜 */}
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
            <span className="text-xs font-semibold text-gray-900 truncate">
              {record.tag ? `@${record.tag}` : record.type === 'diary' ? '일기' : record.type === 'review' ? '리뷰' : '밑줄'}
            </span>
            <span className="text-[10px] text-gray-400 ml-auto tabular-nums shrink-0">{formatDate(record.createDate)}</span>
          </div>

          <div className="border-t border-gray-100 pt-2 flex flex-col gap-1.5">
            {/* 책 제목 */}
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span className="text-xs text-gray-500 truncate">{record.bookTitle}</span>
            </div>

            {/* 읽은 부분 */}
            <p className="text-xs text-gray-500">p.{record.relatedPage}</p>

            {/* 본문 */}
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-2">{record.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

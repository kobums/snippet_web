"use client"

import React from 'react';
import { RecordDto } from '@/types/record';
import { formatDate } from '@/lib/util';

interface RecordListProps {
  records: RecordDto[];
  loading: boolean;
  onOpenForm: () => void;
}

export default function RecordList({ records, loading, onOpenForm }: RecordListProps) {
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
    <>
      {records.map(record => (
        <div key={record.id} className="bg-white/60 border border-gray-100 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm hover:bg-white transition-all cursor-default group">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{record.text}</p>
          <div className="flex items-center gap-2 mt-1">
            {record.tag && (
              <span className="flex items-center gap-1 text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-0.5 rounded-full font-medium">
                <span className="opacity-50">#</span>{record.tag}
              </span>
            )}
            {record.relatedPage && (
              <span className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100">
                p.{record.relatedPage}
              </span>
            )}
            <span className="text-[10px] text-gray-400 ml-auto tabular-nums">{formatDate(record.createDate)}</span>
          </div>
        </div>
      ))}
    </>
  );
}

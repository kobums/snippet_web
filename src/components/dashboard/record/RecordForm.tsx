"use client"

import React, { useRef, useEffect } from 'react';
import { UserBookDto } from '@/types/library';
import { tabConfig, type RecordTab } from './RecordToolbar';

interface RecordFormProps {
  formType: RecordTab;
  formBook: number | '';
  setFormBook: (v: number | '') => void;
  formText: string;
  setFormText: (v: string) => void;
  formPage: number | '';
  setFormPage: (v: number | '') => void;
  formTag: string;
  setFormTag: (v: string) => void;
  submitting: boolean;
  recordableBooks: UserBookDto[];
  onSubmit: () => void;
  onCancel: () => void;
}

export default function RecordForm({
  formType, formBook, setFormBook,
  formText, setFormText, formPage, setFormPage,
  formTag, setFormTag, submitting,
  recordableBooks, onSubmit, onCancel,
}: RecordFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  return (
    <div className="mb-4 shrink-0 bg-white/70 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          <span className="text-blue-500 scale-90">{tabConfig.find(t => t.key === formType)?.icon}</span>
          {tabConfig.find(t => t.key === formType)?.label.replace('이달의 ', '')} 작성
        </span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* 책 선택 */}
      <select value={formBook} onChange={e => setFormBook(e.target.value ? Number(e.target.value) : '')}
        className="text-xs bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-blue-400 transition-colors cursor-pointer">
        <option value="">책 선택...</option>
        {recordableBooks.map(b => (
          <option key={b.id} value={b.id}>{b.title}</option>
        ))}
      </select>

      {/* 내용 입력 */}
      <textarea ref={textareaRef} value={formText} onChange={e => setFormText(e.target.value)}
        placeholder="내용을 입력하세요..." rows={4}
        className="text-sm bg-white/80 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none focus:border-blue-400 resize-none transition-colors placeholder-gray-400 leading-relaxed" />

      {/* 태그 & 페이지 */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input type="text" value={formTag} onChange={e => setFormTag(e.target.value)}
            placeholder="태그 (선택)"
            className="w-full text-xs bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400" />
        </div>
        <div>
          <input type="number" value={formPage} onChange={e => setFormPage(e.target.value ? Number(e.target.value) : '')}
            placeholder="페이지"
            className="w-24 text-xs bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400" />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-2 justify-end mt-1">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium">취소</button>
        <button onClick={onSubmit} disabled={submitting || !formText.trim()}
          className="px-5 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {submitting ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
}

"use client"

import React, { useState, useEffect } from 'react';
import { UserBookDto } from '@/types/library';
import { RecordDto, RecordAddRequestDto } from '@/types/record';
import { addRecordToBook, getMonthlyRecords } from '@/lib/recordApi';
import { handleApiError } from '@/lib/errorHandler';
import RecordToolbar, { type RecordTab, type SortOption } from './record/RecordToolbar';
import RecordForm from './record/RecordForm';
import RecordList from './record/RecordList';

/* 탭 → API type 매핑 */
const tabToApiType: Record<RecordTab, RecordAddRequestDto['type']> = {
  diary: 'diary',
  underline: 'snippet',
  review: 'review',
};

interface BookRecordPanelProps {
  books: UserBookDto[];
}

export default function BookRecordPanel({ books }: BookRecordPanelProps) {
  const [activeTab, setActiveTab] = useState<RecordTab>('diary');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  /* 기록 작성 폼 상태 */
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<RecordTab>('diary');
  const [formBook, setFormBook] = useState<number | ''>('');
  const [formText, setFormText] = useState('');
  const [formPage, setFormPage] = useState<number | ''>('');
  const [formTag, setFormTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* 기록 목록 상태 */
  const [records, setRecords] = useState<RecordDto[]>([]);
  const [recordLoading, setRecordLoading] = useState(false);

  /* 탭 변경 시 이번 달 기록 불러오기 */
  useEffect(() => {
    setRecordLoading(true);
    getMonthlyRecords(tabToApiType[activeTab])
      .then(setRecords)
      .catch(e => handleApiError(e, '기록 불러오기 실패'))
      .finally(() => setRecordLoading(false));
  }, [activeTab]);

  const openForm = (tab: RecordTab = activeTab) => {
    setFormType(tab);
    setActiveTab(tab);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formText.trim()) return;
    if (formBook === '') { alert('책을 선택해 주세요.'); return; }
    setSubmitting(true);
    try {
      const payload: RecordAddRequestDto = {
        type: tabToApiType[formType],
        text: formText.trim(),
        tag: formTag.trim() || undefined,
        relatedPage: formPage !== '' ? Number(formPage) : undefined,
      };
      await addRecordToBook(Number(formBook), payload);
      setFormText(''); setFormTag(''); setFormPage(''); setShowForm(false);
      const updated = await getMonthlyRecords(tabToApiType[activeTab]);
      setRecords(updated);
    } catch (e) {
      handleApiError(e, '기록 저장에 실패했습니다.', 'alert');
    } finally {
      setSubmitting(false);
    }
  };

  const recordableBooks = books.filter(b => b.status === 'reading' || b.status === 'completed');

  const displayRecords = [...records]
    .filter(r => !searchQuery || r.text.includes(searchQuery) || (r.tag ?? '').includes(searchQuery))
    .sort((a, b) => sortOption === 'newest'
      ? new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      : new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
    );

  return (
    <div className={`liquid-panel p-6 relative z-10 flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[460px]'}`}>
      <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2 mb-5 shrink-0">독서 기록</h3>

      <RecordToolbar
        activeTab={activeTab} setActiveTab={setActiveTab}
        sortOption={sortOption} setSortOption={setSortOption}
        showSearch={showSearch} setShowSearch={setShowSearch}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        isExpanded={isExpanded} setIsExpanded={setIsExpanded}
        onOpenForm={openForm}
      />

      {showForm && (
        <RecordForm
          formType={formType}
          formBook={formBook} setFormBook={setFormBook}
          formText={formText} setFormText={setFormText}
          formPage={formPage} setFormPage={setFormPage}
          formTag={formTag} setFormTag={setFormTag}
          submitting={submitting}
          recordableBooks={recordableBooks}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto hide-scrollbar">
        <RecordList records={displayRecords} loading={recordLoading} onOpenForm={() => openForm()} />
      </div>

      {!showForm && displayRecords.length > 0 && (
        <button onClick={() => openForm()}
          className="mt-4 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full border-t border-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새 페이지
        </button>
      )}
    </div>
  );
}

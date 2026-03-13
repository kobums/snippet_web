"use client"

import React, { useState, useEffect } from 'react';
import { UserBookDto } from '@/types/library';
import { RecordDto, RecordAddRequestDto } from '@/types/record';
import { createRecord, getMonthlyRecords } from '@/lib/recordApi';
import { handleApiError } from '@/lib/errorHandler';
import { useBookStore } from '@/stores/useBookStore';
import PanelToolbar, { TabItem, SortItem, NewMenuItem } from '@/components/ui/PanelToolbar';
import RecordForm from './record/RecordForm';
import RecordList from './record/RecordList';
import BookRecordModal from '@/components/modal/BookRecordModal';

type RecordTab = 'diary' | 'underline' | 'review';
type SortOption = 'newest' | 'oldest';

const tabs: TabItem<RecordTab>[] = [
  {
    key: 'diary',
    label: '이달의 일기',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    key: 'underline',
    label: '이달의 밑줄',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a3 3 0 1 1 1.32-1.32L7 12V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8l2.34 5.68a3 3 0 1 1-1.32 1.32L12 14Z"/></svg>,
  },
  {
    key: 'review',
    label: '이달의 리뷰',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
];

const sortOpts: SortItem<SortOption>[] = [
  { key: 'newest', label: '최신순' },
  { key: 'oldest', label: '오래된순' },
];

const newMenuItems: NewMenuItem[] = tabs.map(t => ({
  key: t.key,
  label: t.label.replace('이달의 ', '') + ' 작성',
  icon: t.icon,
}));

/* 탭 → API type 매핑 */
const tabToApiType: Record<RecordTab, RecordAddRequestDto['type']> = {
  diary: 'diary',
  underline: 'snippet',
  review: 'review',
};

/* 탭 → 전용 페이지 URL */
const tabToUrl: Record<RecordTab, string> = {
  diary: '/record/diary',
  underline: '/record/snippet',
  review: '/record/review',
};

interface BookRecordPanelProps {
  books: UserBookDto[];
}

export default function BookRecordPanel({ books }: BookRecordPanelProps) {
  const [activeTab, setActiveTab] = useState<RecordTab>('diary');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

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

  /* 모달 상태 */
  const [modalBook, setModalBook] = useState<UserBookDto | null>(null);

  const { selectedYear, selectedMonth } = useBookStore();

  /* 탭 변경 또는 월 변경 시 해당 월 기록 불러오기 */
  useEffect(() => {
    setRecordLoading(true);
    getMonthlyRecords(tabToApiType[activeTab], selectedYear, selectedMonth)
      .then(setRecords)
      .catch(e => handleApiError(e, '기록 불러오기 실패'))
      .finally(() => setRecordLoading(false));
  }, [activeTab, selectedYear, selectedMonth]);

  const openForm = (tab: RecordTab = activeTab) => {
    setFormType(tab);
    setActiveTab(tab);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formText.trim()) return;
    if (formBook === '') { alert('책을 선택해 주세요.'); return; }
    if (formPage === '' && !formTag.trim()) {
      alert('페이지 또는 태그를 입력해 주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const payload: RecordAddRequestDto = {
        type: tabToApiType[formType],
        text: formText.trim(),
        tag: formTag.trim() || undefined,
        relatedPage: formPage !== '' ? Number(formPage) : undefined,
      };
      await createRecord(Number(formBook), payload);
      setFormText(''); setFormTag(''); setFormPage(''); setShowForm(false);
      const updated = await getMonthlyRecords(tabToApiType[activeTab], selectedYear, selectedMonth);
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
    <div className="liquid-panel p-4 sm:p-5 md:p-6 relative z-10 flex flex-col">
      <h3 className="text-gray-900 font-semibold text-base sm:text-lg flex items-center gap-2 mb-4 sm:mb-5 shrink-0">독서 기록</h3>

      <PanelToolbar<RecordTab, SortOption>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sortOptions={sortOpts}
        activeSort={sortOption}
        onSortChange={setSortOption}
        searchEnabled
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="기록 내용 검색..."
        expandUrl={tabToUrl[activeTab]}
        onNew={() => openForm()}
        newMenuItems={newMenuItems}
        onNewMenuItem={(key) => openForm(key as RecordTab)}
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

      <div>
        <RecordList records={displayRecords} loading={recordLoading} onOpenForm={() => openForm()} onRecordClick={(bookId) => {
          const found = books.find(b => b.bookId === bookId);
          if (found) setModalBook(found);
        }} />
      </div>

      <BookRecordModal
        isOpen={!!modalBook}
        onClose={() => setModalBook(null)}
        book={modalBook}
      />

      {!showForm && displayRecords.length > 0 && (
        <button onClick={() => openForm()}
          className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-gray-600 transition-colors px-3 sm:px-4 py-2 sm:py-2.5 w-full border-t border-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새 페이지
        </button>
      )}
    </div>
  );
}

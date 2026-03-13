"use client"

import React, { useState, useEffect } from 'react';
import { RecordDto, RecordAddRequestDto } from '@/types/record';
import { UserBookDto } from '@/types/library';
import { getRecords, createRecord } from '@/lib/recordApi';
import { getUserBooks } from '@/lib/userBookApi';
import { handleApiError } from '@/lib/errorHandler';
import { formatDate } from '@/lib/util';
import { useUIStore } from '@/stores/useUIStore';
import RecordForm from '@/components/dashboard/record/RecordForm';
import { RecordCardSkeleton } from '@/components/ui/skeleton';

type RecordType = 'diary' | 'snippet' | 'review';
type SortOption = 'newest' | 'oldest';

/* RecordForm 내부에서 쓰는 RecordTab 타입과 매핑 */
type FormTab = 'diary' | 'underline' | 'review';
const apiTypeToFormTab: Record<RecordType, FormTab> = {
  diary: 'diary',
  snippet: 'underline',
  review: 'review',
};

interface RecordListPageProps {
  type: RecordType;
  title: string;
  description: string;
}

export default function RecordListPage({ type, title, description }: RecordListPageProps) {
  const [records, setRecords] = useState<RecordDto[]>([]);
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  /* 작성 폼 */
  const [showForm, setShowForm] = useState(false);
  const [formBook, setFormBook] = useState<number | ''>('');
  const [formText, setFormText] = useState('');
  const [formPage, setFormPage] = useState<number | ''>('');
  const [formTag, setFormTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { openBookRecord } = useUIStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRecords, allBooks] = await Promise.all([getRecords(), getUserBooks()]);
      setRecords(allRecords.filter(r => r.type === type));
      setBooks(allBooks);
    } catch (e) {
      handleApiError(e, '기록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formText.trim()) return;
    if (formBook === '') { alert('책을 선택해 주세요.'); return; }
    setSubmitting(true);
    try {
      const payload: RecordAddRequestDto = {
        type,
        text: formText.trim(),
        tag: formTag.trim() || undefined,
        relatedPage: formPage !== '' ? Number(formPage) : undefined,
      };
      await createRecord(Number(formBook), payload);
      setFormText(''); setFormTag(''); setFormPage(''); setShowForm(false);
      const allRecords = await getRecords();
      setRecords(allRecords.filter(r => r.type === type));
    } catch (e) {
      handleApiError(e, '기록 저장에 실패했습니다.', 'alert');
    } finally {
      setSubmitting(false);
    }
  };

  const recordableBooks = books.filter(b => b.status === 'reading' || b.status === 'completed');

  const filteredRecords = [...records]
    .filter(r => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return r.text.toLowerCase().includes(q) || (r.tag ?? '').toLowerCase().includes(q) || r.bookTitle.toLowerCase().includes(q);
    })
    .sort((a, b) => sortOption === 'newest'
      ? new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      : new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
    );

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{description} · {records.length}개</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl liquid-button text-sm w-full sm:w-auto justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새로 작성
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="내용, 태그, 책 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
          />
        </div>
        <div className="relative sm:w-auto">
          <button
            onClick={() => setShowSortMenu(p => !p)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/60 border border-gray-200 text-sm text-gray-600 hover:bg-white transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
            </svg>
            {sortOption === 'newest' ? '최신순' : '오래된순'}
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-1 min-w-[120px] z-50 shadow-xl">
              {([['newest', '최신순'], ['oldest', '오래된순']] as const).map(([key, label]) => (
                <button key={key} onClick={() => { setSortOption(key); setShowSortMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${sortOption === key ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >{label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Record Form */}
      {showForm && (
        <div className="mb-6">
          <RecordForm
            formType={apiTypeToFormTab[type]}
            formBook={formBook} setFormBook={setFormBook}
            formText={formText} setFormText={setFormText}
            formPage={formPage} setFormPage={setFormPage}
            formTag={formTag} setFormTag={setFormTag}
            submitting={submitting}
            recordableBooks={recordableBooks}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Record List */}
      {loading ? (
        <RecordCardSkeleton count={3} />
      ) : filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/>
          </svg>
          <p className="text-sm">{searchQuery ? '검색 결과가 없습니다' : '작성된 기록이 없습니다'}</p>
          {!searchQuery && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-sm text-purple-500 hover:text-purple-700 transition-colors"
            >
              첫 기록을 작성해보세요
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredRecords.map(record => (
            <div
              key={record.id}
              onClick={() => {
                const found = books.find(b => b.bookId === record.bookId);
                if (found) openBookRecord(found);
              }}
              className="liquid-panel p-4 cursor-pointer hover:scale-[1.01] transition-transform group"
            >
              {/* 헤더 */}
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/>
                </svg>
                <span className="text-xs font-semibold text-gray-900 truncate">
                  {record.tag ? `@${record.tag}` : title}
                </span>
                <span className="text-[10px] text-gray-400 ml-auto tabular-nums shrink-0">{formatDate(record.createDate)}</span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                {/* 책 제목 */}
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span className="text-xs text-gray-500 truncate group-hover:text-purple-600 transition-colors">{record.bookTitle}</span>
                </div>

                {/* 페이지 */}
                <p className="text-xs text-gray-400">p.{record.relatedPage}</p>

                {/* 본문 */}
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">{record.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client"

import React, { useState, useRef, useEffect } from 'react';
import { UserBookDto } from '@/types/library';
import { RecordDto, RecordAddRequestDto } from '@/types/record';
import { addRecordToBook, getRecordsByBook } from '@/lib/recordApi';
import { formatDate } from '@/lib/util';

type RecordTab = 'diary' | 'underline' | 'review';
type SortOption  = 'newest' | 'oldest';

/* 탭 → API type 매핑 */
const tabToApiType: Record<RecordTab, RecordAddRequestDto['type']> = {
  diary:     'diary',
  underline: 'snippet',
  review:    'review',
};

const tabConfig: { key: RecordTab; label: string; icon: React.ReactNode }[] = [
  { 
    key: 'diary',     
    label: '이달의 일기', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> 
  },
  { 
    key: 'underline', 
    label: '이달의 밑줄', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a3 3 0 1 1 1.32-1.32L7 12V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8l2.34 5.68a3 3 0 1 1-1.32 1.32L12 14Z"/></svg> 
  },
  { 
    key: 'review',    
    label: '이달의 리뷰', 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> 
  },
];

interface BookRecordPanelProps {
  books: UserBookDto[];
}

export default function BookRecordPanel({ books }: BookRecordPanelProps) {
  const [activeTab, setActiveTab]       = useState<RecordTab>('diary');
  const [sortOption, setSortOption]     = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showNewMenu, setShowNewMenu]   = useState(false);
  const [showSearch, setShowSearch]     = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [isExpanded, setIsExpanded]     = useState(false);

  /* 기록 작성 폼 상태 */
  const [showForm, setShowForm]         = useState(false);
  const [formType, setFormType]         = useState<RecordTab>('diary');
  const [formBook, setFormBook]         = useState<number | ''>('');
  const [formText, setFormText]         = useState('');
  const [formPage, setFormPage]         = useState<number | ''>('');
  const [formTag,  setFormTag]          = useState('');
  const [submitting, setSubmitting]     = useState(false);

  /* 기록 목록 상태 */
  const [records, setRecords]           = useState<RecordDto[]>([]);
  const [recordLoading, setRecordLoading] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement>(null);
  const newMenuRef  = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* 검색창 자동 포커스 */
  useEffect(() => { if (showSearch) searchRef.current?.focus(); }, [showSearch]);

  /* 폼 오픈 시 자동 포커스 */
  useEffect(() => { if (showForm) setTimeout(() => textareaRef.current?.focus(), 50); }, [showForm]);

  /* 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) setShowSortMenu(false);
      if (newMenuRef.current  && !newMenuRef.current.contains(e.target as Node))  setShowNewMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* 탭 변경 시 해당 책의 기록 불러오기 */
  useEffect(() => {
    if (formBook === '') return;
    setRecordLoading(true);
    getRecordsByBook(Number(formBook), tabToApiType[activeTab])
      .then(setRecords)
      .catch(console.error)
      .finally(() => setRecordLoading(false));
  }, [activeTab, formBook]);

  /* 새로 만들기 버튼 */
  const openForm = (tab: RecordTab = activeTab) => {
    setFormType(tab);
    setActiveTab(tab);
    setShowForm(true);
    setShowNewMenu(false);
  };

  /* 기록 저장 */
  const handleSubmit = async () => {
    if (!formText.trim()) return;
    if (formBook === '') { alert('책을 선택해 주세요.'); return; }
    setSubmitting(true);
    try {
      const payload: RecordAddRequestDto = {
        type:        tabToApiType[formType],
        text:        formText.trim(),
        tag:         formTag.trim() || undefined,
        relatedPage: formPage !== '' ? Number(formPage) : undefined,
      };
      await addRecordToBook(Number(formBook), payload);
      setFormText(''); setFormTag(''); setFormPage(''); setShowForm(false);
      /* 저장 후 목록 새로고침 */
      const updated = await getRecordsByBook(Number(formBook), tabToApiType[activeTab]);
      setRecords(updated);
    } catch (e) {
      console.error(e);
      alert('기록 저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  /* 표시할 책 목록 (reading + completed 만 기록 가능) */
  const recordableBooks = books.filter(b => b.status === 'reading' || b.status === 'completed');

  /* 검색 + 정렬 적용 */
  const displayRecords = [...records]
    .filter(r => !searchQuery || r.text.includes(searchQuery) || (r.tag ?? '').includes(searchQuery))
    .sort((a, b) => sortOption === 'newest'
      ? new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
      : new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
    );

  return (
    <div className={`liquid-panel p-6 relative z-10 flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[460px]'}`}>

      {/* 헤더 */}
      <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2 mb-5 shrink-0">
        독서 기록
      </h3>

      {/* 툴바 */}
      <div className="flex items-center justify-between mb-5 shrink-0 gap-3 flex-wrap">
        {/* 탭 필터 */}
        <div className="flex items-center gap-1.5">
          {tabConfig.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key 
                  ? 'liquid-badge text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-2">
          {/* 정렬 */}
          <div className="relative" ref={sortMenuRef}>
            <button onClick={() => setShowSortMenu(p => !p)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title="정렬">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
              </svg>
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

          {/* 검색 */}
          <button onClick={() => { setShowSearch(p => !p); if (showSearch) setSearchQuery(''); }}
            className={`p-2 rounded-lg transition-all ${showSearch ? 'bg-white/70 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`} title="검색">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          {/* 확장 */}
          <button onClick={() => setIsExpanded(p => !p)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all" title={isExpanded ? '축소' : '확장'}>
            {isExpanded
              ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            }
          </button>

          {/* 새로 만들기 */}
          <div className="flex items-stretch ml-1" ref={newMenuRef}>
            <button onClick={() => openForm()} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20 border-r-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              새로 만들기
            </button>
            <div className="relative">
              <button onClick={() => setShowNewMenu(p => !p)} 
                className="px-2 py-1.5 rounded-r-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20 h-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {showNewMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-1 min-w-[140px] z-50 shadow-xl">
                  {tabConfig.map(opt => (
                    <button key={opt.key} onClick={() => openForm(opt.key)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2">
                      <span className="opacity-70 scale-90">{opt.icon}</span>{opt.label.replace('이달의 ', '')} 작성
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 검색창 */}
      {showSearch && (
        <div className="mb-4 shrink-0">
          <div className="flex items-center gap-2 bg-white/60 border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="기록 내용 검색..." className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 기록 작성 인라인 폼 */}
      {showForm && (
        <div className="mb-4 shrink-0 bg-white/70 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <span className="text-blue-500 scale-90">{tabConfig.find(t => t.key === formType)?.icon}</span>
              {tabConfig.find(t => t.key === formType)?.label.replace('이달의 ', '')} 작성
            </span>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
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
            <div className="flex-1 relative">
              <input type="text" value={formTag} onChange={e => setFormTag(e.target.value)}
                placeholder="태그 (선택)"
                className="w-full text-xs bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400" />
            </div>
            <div className="relative">
              <input type="number" value={formPage} onChange={e => setFormPage(e.target.value ? Number(e.target.value) : '')}
                placeholder="페이지"
                className="w-24 text-xs bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 outline-none focus:border-blue-400 transition-colors placeholder-gray-400" />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex gap-2 justify-end mt-1">
            <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium">취소</button>
            <button onClick={handleSubmit} disabled={submitting || !formText.trim()}
              className="px-5 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {submitting ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      )}

      {/* 기록 목록 영역 */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto hide-scrollbar">
        {recordLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
             <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
             <p className="text-xs text-gray-400">기록을 불러오는 중...</p>
          </div>
        ) : displayRecords.length > 0 ? (
          displayRecords.map(record => (
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
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/></svg>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">작성된 기록이 없습니다.</p>
              <button 
                onClick={() => openForm()} 
                className="mt-4 flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                첫 기록 작성하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 새 페이지 버튼 (하단) */}
      {!showForm && displayRecords.length > 0 && (
        <button
          onClick={() => openForm()}
          className="mt-4 flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-2 w-full border-t border-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새 페이지
        </button>
      )}
    </div>
  );
}

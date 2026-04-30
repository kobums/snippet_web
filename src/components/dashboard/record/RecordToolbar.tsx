"use client"

import React, { useRef, useEffect } from 'react';

type RecordTab = 'diary' | 'underline' | 'review';
type SortOption = 'newest' | 'oldest';

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

export { tabConfig };
export type { RecordTab, SortOption };

interface RecordToolbarProps {
  activeTab: RecordTab;
  setActiveTab: (tab: RecordTab) => void;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  onOpenForm: (tab?: RecordTab) => void;
}

export default function RecordToolbar({
  activeTab, setActiveTab,
  sortOption, setSortOption,
  showSearch, setShowSearch,
  searchQuery, setSearchQuery,
  isExpanded, setIsExpanded,
  onOpenForm,
}: RecordToolbarProps) {
  const [showSortMenu, setShowSortMenu] = React.useState(false);
  const [showNewMenu, setShowNewMenu] = React.useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (showSearch) searchRef.current?.focus(); }, [showSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) setShowSortMenu(false);
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) setShowNewMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {/* 툴바 */}
      <div className="flex items-center justify-between mb-5 shrink-0 gap-3 flex-wrap">
        {/* 탭 필터 */}
        <div className="flex items-center gap-1.5">
          {tabConfig.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'liquid-badge text-gray-900 dark:text-[#f0f0f0] shadow-sm'
                  : 'text-gray-500 dark:text-[#a0a0a0] hover:text-gray-800 dark:text-[#d0d0d0] hover:bg-white/50 border border-transparent'
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
              className="p-2 rounded-lg text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:text-[#f0f0f0] hover:bg-white/50 transition-all" title="정렬">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
              </svg>
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-1 min-w-[120px] z-50 shadow-xl">
                {([['newest', '최신순'], ['oldest', '오래된순']] as const).map(([key, label]) => (
                  <button key={key} onClick={() => { setSortOption(key); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${sortOption === key ? 'bg-gray-100 text-gray-900 dark:text-[#f0f0f0] font-medium' : 'text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-50 dark:hover:bg-white/6'}`}
                  >{label}</button>
                ))}
              </div>
            )}
          </div>

          {/* 검색 */}
          <button onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(''); }}
            className={`p-2 rounded-lg transition-all ${showSearch ? 'bg-white/70 text-gray-900 dark:text-[#f0f0f0] shadow-sm' : 'text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:text-[#f0f0f0] hover:bg-white/50'}`} title="검색">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          {/* 확장 */}
          <button onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:text-[#f0f0f0] hover:bg-white/50 transition-all" title={isExpanded ? '축소' : '확장'}>
            {isExpanded
              ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="21" y2="3"/><line x1="3" y1="21" x2="14" y2="10"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
            }
          </button>

          {/* 새로 만들기 */}
          <div className="flex items-stretch ml-1" ref={newMenuRef}>
            <button onClick={() => onOpenForm()}
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
                    <button key={opt.key} onClick={() => { onOpenForm(opt.key); setShowNewMenu(false); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-50 dark:hover:bg-white/6 hover:text-gray-900 dark:text-[#f0f0f0] transition-colors flex items-center gap-2">
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
          <div className="flex items-center gap-2 bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-[#666] shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="기록 내용 검색..." className="flex-1 text-sm bg-transparent outline-none text-gray-700 dark:text-[#d0d0d0] placeholder-gray-400 dark:placeholder-[#666]" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 dark:text-[#666] hover:text-gray-600 dark:text-[#a0a0a0] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

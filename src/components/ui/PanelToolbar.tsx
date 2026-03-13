"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ── 탭 ── */
export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  icon?: React.ReactNode;
}

/* ── 정렬 ── */
export interface SortItem<T extends string = string> {
  key: T;
  label: string;
}

/* ── 새로 만들기 드롭다운 아이템 ── */
export interface NewMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

/* ── Props ── */
interface PanelToolbarProps<TTab extends string = string, TSort extends string = string> {
  /* 탭 필터 (선택) */
  tabs?: TabItem<TTab>[];
  activeTab?: TTab;
  onTabChange?: (tab: TTab) => void;

  /* 정렬 (선택) */
  sortOptions?: SortItem<TSort>[];
  activeSort?: TSort;
  onSortChange?: (sort: TSort) => void;

  /* 검색 (선택) */
  searchEnabled?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;

  /* 확장 = 페이지 이동 (선택) */
  expandUrl?: string;

  /* 새로 만들기 (선택) */
  onNew?: () => void;
  newLabel?: string;
  /** 드롭다운이 있는 새로 만들기 */
  newMenuItems?: NewMenuItem[];
  onNewMenuItem?: (key: string) => void;
}

export default function PanelToolbar<TTab extends string = string, TSort extends string = string>({
  tabs, activeTab, onTabChange,
  sortOptions, activeSort, onSortChange,
  searchEnabled, searchQuery, onSearchChange, searchPlaceholder,
  expandUrl,
  onNew, newLabel = '새로 만들기',
  newMenuItems, onNewMenuItem,
}: PanelToolbarProps<TTab, TSort>) {
  const router = useRouter();
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
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

  const hasRightActions = sortOptions || searchEnabled || expandUrl || onNew;

  return (
    <>
      <div className="flex items-center justify-between mb-4 sm:mb-5 shrink-0 gap-2 sm:gap-3 flex-wrap">
        {/* 좌측: 탭 */}
        {tabs && tabs.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange?.(tab.key)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  activeTab === tab.key
                    ? 'liquid-badge text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 border border-transparent'
                }`}
              >
                {tab.icon && <span className="hidden sm:inline-block">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* 우측: 아이콘 액션들 */}
        {hasRightActions && (
          <div className="flex items-center gap-2 ml-auto">
            {/* 정렬 */}
            {sortOptions && sortOptions.length > 0 && (
              <div className="relative" ref={sortMenuRef}>
                <button
                  onClick={() => setShowSortMenu(p => !p)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all"
                  title="정렬"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
                  </svg>
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-1 min-w-[120px] z-50 shadow-xl">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { onSortChange?.(opt.key); setShowSortMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          activeSort === opt.key ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 검색 토글 */}
            {searchEnabled && (
              <button
                onClick={() => { setShowSearch(!showSearch); if (showSearch) onSearchChange?.(''); }}
                className={`p-2 rounded-lg transition-all ${showSearch ? 'bg-white/70 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                title="검색"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </button>
            )}

            {/* 확장 (페이지 이동) */}
            {expandUrl && (
              <button
                onClick={() => router.push(expandUrl)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all"
                title="자세히 보기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              </button>
            )}

            {/* 새로 만들기 (드롭다운 없이) */}
            {onNew && !newMenuItems && (
              <button
                onClick={onNew}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {newLabel}
              </button>
            )}

            {/* 새로 만들기 (드롭다운 포함) */}
            {onNew && newMenuItems && newMenuItems.length > 0 && (
              <div className="flex items-stretch ml-1" ref={newMenuRef}>
                <button
                  onClick={onNew}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20 border-r-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  {newLabel}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowNewMenu(p => !p)}
                    className="px-2 py-1.5 rounded-r-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20 h-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {showNewMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-1 min-w-[140px] z-50 shadow-xl">
                      {newMenuItems.map(item => (
                        <button
                          key={item.key}
                          onClick={() => { onNewMenuItem?.(item.key); setShowNewMenu(false); }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2"
                        >
                          {item.icon && <span className="opacity-70 scale-90">{item.icon}</span>}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 검색창 */}
      {searchEnabled && showSearch && (
        <div className="mb-4 shrink-0">
          <div className="flex items-center gap-2 bg-white/60 border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery ?? ''}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder ?? '검색...'}
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange?.('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

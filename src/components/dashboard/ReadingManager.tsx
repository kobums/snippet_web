"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import { calcProgress } from '@/lib/util';
import { useBookStore } from '@/stores/useBookStore';
import { useUIStore } from '@/stores/useUIStore';
import PanelToolbar, { TabItem, SortItem } from '@/components/ui/PanelToolbar';

type FilterTab = 'waiting' | 'reading' | 'done';
type SortOption = 'newest' | 'title' | 'author';

interface ReadingManagerProps {
  books: UserBookDto[];
  loading: boolean;
}

const tabs: TabItem<FilterTab>[] = [
  {
    key: 'waiting',
    label: '대기중',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    key: 'reading',
    label: '진행중',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    key: 'done',
    label: '완료/중단',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
];

const sortOptions: SortItem<SortOption>[] = [
  { key: 'newest', label: '최신순' },
  { key: 'title', label: '제목순' },
  { key: 'author', label: '작가순' },
];

function getSearchModalConfig(activeTab: FilterTab) {
  if (activeTab === 'waiting') {
    return { allowedActions: ['wish', 'have', 'borrow'] as ('wish' | 'have' | 'borrow')[], defaultStatus: 'waiting' as const };
  } else if (activeTab === 'reading') {
    return { allowedActions: ['have', 'borrow'] as ('wish' | 'have' | 'borrow')[], defaultStatus: 'reading' as const };
  }
  return { allowedActions: ['have', 'borrow'] as ('wish' | 'have' | 'borrow')[], defaultStatus: 'completed' as const };
}

function BookListSkeleton() {
  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-300 mb-3 w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/60 border border-gray-200 p-3 sm:p-4 rounded-2xl flex flex-col gap-2 sm:gap-3">
          <div className="flex gap-2 sm:gap-3">
            {/* 커버 스켈레톤 */}
            <div className="w-14 h-20 bg-gray-100 rounded-md animate-pulse"></div>

            {/* 텍스트 스켈레톤 */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>

              {/* 프로그레스 바 스켈레톤 */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-100 rounded w-8 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="flex gap-2 mt-1">
            <div className="flex-1 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="flex-1 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReadingManager({ books, loading }: ReadingManagerProps) {
  const { updateStatus, updateType, loadDashboard } = useBookStore();
  const { openBookRecord, openSearchModal } = useUIStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('reading');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = (() => {
    let filtered: UserBookDto[];
    switch (activeTab) {
      case 'waiting':
        filtered = books.filter(b => b.status === 'waiting');
        break;
      case 'reading':
        filtered = books.filter(b => b.status === 'reading');
        break;
      case 'done':
        filtered = books.filter(b => b.status === 'completed' || b.status === 'dropped');
        break;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }

    switch (sortOption) {
      case 'title':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case 'author':
        return [...filtered].sort((a, b) => a.author.localeCompare(b.author));
      default:
        return filtered;
    }
  })();

  const handleOpenSearch = () => {
    const config = getSearchModalConfig(activeTab);
    openSearchModal({ allowedActions: config.allowedActions, defaultStatus: config.defaultStatus, onSuccess: loadDashboard });
  };

  return (
    <div className="liquid-panel p-4 sm:p-5 md:p-6 relative z-10">
      <h3 className="text-gray-900 font-medium mb-3 sm:mb-4 text-base sm:text-lg">독서 진행 관리</h3>

      <PanelToolbar<FilterTab, SortOption>
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sortOptions={sortOptions}
        activeSort={sortOption}
        onSortChange={setSortOption}
        searchEnabled
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="제목이나 저자로 검색..."
        onNew={handleOpenSearch}
      />

      {loading ? (
        <BookListSkeleton />
      ) : filteredBooks.length === 0 ? (
        <div className="h-32 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center flex-col gap-2">
          <span className="text-gray-400">
            {activeTab === 'waiting' && '대기 중인 책이 없습니다.'}
            {activeTab === 'reading' && '현재 읽고 있는 책이 없습니다.'}
            {activeTab === 'done' && '완료하거나 중단한 책이 없습니다.'}
          </span>
          <button onClick={handleOpenSearch} className="text-xs liquid-button px-3 py-1.5 transition-colors mt-2">
            새로운 책 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-gray-400 mb-3">할 일 {filteredBooks.length}</div>
          {filteredBooks.map(book => {
            const progressPercent = calcProgress(book.readPage, book.totalPage);
            return (
              <div key={book.id} onClick={() => openBookRecord(book)} className="bg-white/60 border border-gray-200 p-3 sm:p-4 rounded-2xl flex flex-col gap-2 sm:gap-3 group relative overflow-hidden cursor-pointer hover:bg-white transition-colors shadow-sm">
                <div className="flex gap-2 sm:gap-3 relative z-10">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} className="w-14 h-20 object-cover rounded-md shadow-md" alt="cover"/>
                  ) : (
                    <div className="w-14 h-20 bg-gray-100 rounded-md flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-gray-900 font-medium text-sm truncate group-hover:text-purple-600 transition-colors">{book.title}</h4>
                      {activeTab === 'done' && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${book.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                          {book.status === 'completed' ? '완독' : '중단'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate mt-1">{book.author}</p>
                    {activeTab === 'reading' && (
                      <>
                        <div className="mt-4 flex justify-between text-xs text-gray-500 mb-1">
                          <span>{progressPercent}%</span>
                          <span>{book.readPage} / {book.totalPage || '?'}p</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden cursor-pointer" onClick={(e) => { e.stopPropagation(); openBookRecord(book); }}>
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {activeTab === 'reading' && (
                  <div className="flex gap-2 relative z-10 mt-1">
                    <button onClick={(e) => updateStatus(book.id, 'completed', e)} className="flex-1 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded-lg transition-colors">완독 처리</button>
                    <button onClick={(e) => updateStatus(book.id, 'dropped', e)} className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded-lg transition-colors">중단</button>
                  </div>
                )}
                {activeTab === 'waiting' && (
                  <div className="flex gap-2 relative z-10 mt-1">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      if (book.type === 'wish') { updateType(book.id, 'have', e); }
                      updateStatus(book.id, 'reading', e);
                    }} className="flex-1 py-1.5 liquid-button text-xs transition-colors">읽기 시작</button>
                  </div>
                )}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 blur-2xl rounded-full z-0 group-hover:bg-blue-400/30 transition-colors"></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

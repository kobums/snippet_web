"use client"

import React, { useState } from 'react';
import { UserBookDto } from '@/types/library';
import { calcProgress } from '@/lib/util';
import BookRecordPanel from './BookRecordPanel';
import YearStatistics from './YearStatistics';

type FilterTab = 'waiting' | 'reading' | 'done';
type SortOption = 'newest' | 'title' | 'author';

interface ReadingProgressProps {
  books: UserBookDto[];
  loading: boolean;
  onBookClick: (book: UserBookDto) => void;
  onStatusChange: (id: number, status: string, e?: React.MouseEvent) => void;
  onTypeChange?: (id: number, type: string, e?: React.MouseEvent) => void;
  onProgressChange: (id: number, current: number, max: number, e?: React.MouseEvent) => void;
  onNewClick: (allowedActions?: ('wish'|'have'|'borrow')[], defaultStatus?: 'waiting'|'reading'|'completed'|'dropped') => void;
}

const tabConfig: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
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

export default function ReadingProgress({ books, loading, onBookClick, onStatusChange, onTypeChange, onProgressChange, onNewClick }: ReadingProgressProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('waiting');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

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
    switch (sortOption) {
      case 'title':
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case 'author':
        return [...filtered].sort((a, b) => a.author.localeCompare(b.author));
      default:
        return filtered;
    }
  })();

  return (
    <div className="w-full lg:w-2/4 flex flex-col gap-6 lg:overflow-y-auto hide-scrollbar flex-1 relative">
      <div className="liquid-panel p-6 relative z-10">
        <h3 className="text-gray-900 font-medium mb-4 text-lg">독서 진행 관리</h3>

        {/* Toolbar: Filter Tabs (Left) + Actions (Right) */}
        <div className="flex items-center justify-between mb-5 gap-3">
          {/* Left: Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {tabConfig.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

          {/* Right: Sort + New */}
          <div className="flex items-center gap-2">
            {/* Sort Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(prev => !prev)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/50 transition-all"
                title="정렬"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="8" y2="18"/>
                </svg>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white/95 border border-gray-200 rounded-xl p-1 min-w-[120px] z-50 backdrop-blur-xl shadow-xl">
                  {([['newest', '최신순'], ['title', '제목순'], ['author', '작가순']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSortOption(key); setShowSortMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        sortOption === key ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Button */}
            <button
              onClick={() => {
                if (activeTab === 'waiting') {
                  onNewClick(['wish', 'have', 'borrow'], 'waiting');
                } else if (activeTab === 'reading') {
                  onNewClick(['have', 'borrow'], 'reading');
                } else {
                  onNewClick(['have', 'borrow'], 'completed');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-medium transition-all border border-blue-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              새로 만들기
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center text-gray-400">데이터를 불러오는 중입니다...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="h-32 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center flex-col gap-2">
            <span className="text-gray-400">
              {activeTab === 'waiting' && '대기 중인 책이 없습니다.'}
              {activeTab === 'reading' && '현재 읽고 있는 책이 없습니다.'}
              {activeTab === 'done' && '완료하거나 중단한 책이 없습니다.'}
            </span>
            <button 
              onClick={() => {
                if (activeTab === 'waiting') {
                  onNewClick(['wish', 'have', 'borrow'], 'waiting');
                } else if (activeTab === 'reading') {
                  onNewClick(['have', 'borrow'], 'reading');
                } else {
                  onNewClick(['have', 'borrow'], 'completed');
                }
              }} 
              className="text-xs liquid-button px-3 py-1.5 transition-colors mt-2"
            >
              새로운 책 추가하기
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 mb-3">할 일 {filteredBooks.length}</div>
            {filteredBooks.map(book => {
              const progressPercent = calcProgress(book.readPage, book.totalPage);
              return (
                <div key={book.id} onClick={() => onBookClick(book)} className="bg-white/60 border border-gray-200 p-4 rounded-2xl flex flex-col gap-3 group relative overflow-hidden cursor-pointer hover:bg-white transition-colors shadow-sm">
                  <div className="flex gap-3 relative z-10">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} className="w-14 h-20 object-cover rounded-md shadow-md" alt="cover"/>
                    ) : (
                      <div className="w-14 h-20 bg-gray-100 rounded-md flex-shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 font-medium text-sm truncate group-hover:text-purple-600 transition-colors">{book.title}</h4>
                      <p className="text-gray-500 text-xs truncate mt-1">{book.author}</p>

                      {activeTab === 'reading' && (
                        <>
                          <div className="mt-4 flex justify-between text-xs text-gray-500 mb-1">
                            <span>{progressPercent}%</span>
                            <span>{book.readPage} / {book.totalPage || '?'}p</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden cursor-pointer" onClick={(e) => onProgressChange(book.id, book.readPage, book.totalPage || 100, e)}>
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {activeTab === 'reading' && (
                    <div className="flex gap-2 relative z-10 mt-1">
                      <button onClick={(e) => onStatusChange(book.id, 'completed', e)} className="flex-1 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded-lg transition-colors">완독 처리</button>
                      <button onClick={(e) => onStatusChange(book.id, 'dropped', e)} className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs rounded-lg transition-colors">중단</button>
                    </div>
                  )}
                  {activeTab === 'waiting' && (
                    <div className="flex gap-2 relative z-10 mt-1">
                      <button onClick={(e) => {
                        e.stopPropagation();
                        if (book.type === 'wish' && onTypeChange) {
                          onTypeChange(book.id, 'have', e);
                        }
                        onStatusChange(book.id, 'reading', e);
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

      <BookRecordPanel books={books} />
      <YearStatistics books={books} />
    </div>
  );
}

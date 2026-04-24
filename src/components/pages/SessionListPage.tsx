"use client"

import React, { useState, useEffect } from 'react';
import { ReadingSessionDto } from '@/types/readingSession';
import { getAllSessions } from '@/lib/readingSessionApi';
import { handleApiError } from '@/lib/errorHandler';
import SessionDetailModal from '@/components/modal/SessionDetailModal';

type SortOption = 'newest' | 'oldest';

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${weekdays[d.getDay()]})`;
  } catch {
    return dateStr;
  }
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0) return `${m}분 ${s}초`;
  return `${s}초`;
}

function formatPace(secondsPerPage: number) {
  if (secondsPerPage <= 0) return '-';
  return `${(secondsPerPage / 60).toFixed(1)} min/p`;
}

function SessionCard({ session, onClick }: { session: ReadingSessionDto; onClick: () => void }) {
  return (
    <div className="liquid-panel p-4 flex flex-col gap-3 cursor-pointer hover:scale-[1.01] transition-transform" onClick={onClick}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 tabular-nums">{formatDate(session.sessionDate)}</span>
        <span className="text-xs font-semibold text-accent">{formatDuration(session.durationSeconds)}</span>
      </div>

      <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span className="text-xs text-gray-600 truncate font-medium">{session.bookTitle}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">{session.startPage}p</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
          <span className="text-gray-500">{session.endPage}p</span>
          <span className="ml-auto text-xs font-semibold text-emerald-600">+{session.pagesRead}p</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>페이스: {formatPace(session.secondsPerPage)}</span>
        </div>
      </div>
    </div>
  );
}

export default function SessionListPage() {
  const [sessions, setSessions] = useState<ReadingSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ReadingSessionDto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllSessions();
      setSessions(data);
    } catch (e) {
      handleApiError(e, '독서 세션을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = [...sessions]
    .filter(s => {
      if (!searchQuery) return true;
      return s.bookTitle.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) =>
      sortOption === 'newest'
        ? new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
        : new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
    );

  // Group by book title
  const grouped = filtered.reduce<Record<string, ReadingSessionDto[]>>((acc, s) => {
    (acc[s.bookTitle] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">독서 세션</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">타이머로 기록한 독서 시간 · {sessions.length}개</p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="책 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
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

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="liquid-panel p-4 h-32 animate-pulse bg-gray-100/60" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <p className="text-sm">{searchQuery ? '검색 결과가 없습니다' : '기록된 독서 세션이 없습니다'}</p>
          <p className="text-xs mt-2 text-gray-300">앱에서 타이머를 사용해 세션을 기록해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([bookTitle, bookSessions]) => (
            <div key={bookTitle}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">{bookTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {bookSessions.map(s => (
                  <SessionCard key={s.id} session={s} onClick={() => setSelectedSession(s)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
}

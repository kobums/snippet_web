"use client"

import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ReadingSessionDto } from '@/types/readingSession';

interface Props {
  session: ReadingSessionDto | null;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
    });
  } catch { return dateStr; }
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
  return `${(secondsPerPage / 60).toFixed(1)} 분/페이지`;
}

function formatSpeed(secondsPerPage: number) {
  if (secondsPerPage <= 0) return '-';
  return `시간당 약 ${Math.round(3600 / secondsPerPage)}페이지`;
}

export default function SessionDetailModal({ session, onClose }: Props) {
  if (!session) return null;

  const progress = session.endPage > session.startPage
    ? Math.min((session.pagesRead / (session.endPage - session.startPage + 1)) * 100, 100)
    : 0;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          className="w-full max-w-md bg-white/95 border border-gray-200 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {session.bookCoverUrl ? (
                  <img src={session.bookCoverUrl} alt={session.bookTitle}
                    className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0" />
                ) : (
                  <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">{session.bookTitle}</h2>
                  <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">독서 세션</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-2">✕</button>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">{formatDate(session.sessionDate)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-5">
            {/* 핵심 지표 2개 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="text-xs text-gray-500">독서 시간</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatDuration(session.durationSeconds)}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span className="text-xs text-gray-500">읽은 페이지</span>
                </div>
                <p className="text-lg font-bold text-emerald-600">+{session.pagesRead}p</p>
              </div>
            </div>

            {/* 페이지 진행 */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">페이지 진행</p>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">시작</p>
                    <p className="text-base font-bold text-gray-800">{session.startPage}<span className="text-xs font-normal text-gray-400 ml-0.5">p</span></p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">종료</p>
                    <p className="text-base font-bold text-gray-800">{session.endPage}<span className="text-xs font-normal text-gray-400 ml-0.5">p</span></p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 읽기 속도 */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">읽기 속도</p>
              <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{formatPace(session.secondsPerPage)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatSpeed(session.secondsPerPage)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

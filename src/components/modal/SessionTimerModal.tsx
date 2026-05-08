"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserBookDto } from '@/types/library';
import { getUserBooks } from '@/lib/userBookApi';
import { addSession } from '@/lib/readingSessionApi';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

type TimerState = 'idle' | 'running' | 'paused' | 'stopped';

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function SessionTimerModal({ isOpen, onClose, onSaved }: Props) {
  const [books, setBooks] = useState<UserBookDto[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | ''>('');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) {
      getUserBooks().then(data => {
        const active = data.filter(b => b.status === 'reading' || b.status === 'waiting');
        setBooks(active);
      }).catch(() => {});
    }
  }, [isOpen]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStart = () => {
    setTimerState('running');
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
  };

  const handlePause = () => {
    setTimerState('paused');
    clearTimer();
  };

  const handleResume = () => {
    setTimerState('running');
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
  };

  const handleStop = () => {
    setTimerState('stopped');
    clearTimer();
  };

  const handleReset = () => {
    clearTimer();
    setTimerState('idle');
    setElapsed(0);
    setStartPage('');
    setEndPage('');
  };

  const handleSave = async () => {
    if (!selectedBookId) { toast.error('책을 선택해주세요.'); return; }
    const sp = parseInt(startPage);
    const ep = parseInt(endPage);
    if (!startPage || isNaN(sp) || sp < 0) { toast.error('시작 페이지를 입력해주세요.'); return; }
    if (!endPage || isNaN(ep) || ep <= sp) { toast.error('종료 페이지는 시작 페이지보다 커야 합니다.'); return; }
    if (elapsed === 0) { toast.error('독서 시간이 0초입니다.'); return; }

    setSaving(true);
    try {
      await addSession({
        userBookId: selectedBookId as number,
        durationSeconds: elapsed,
        startPage: sp,
        endPage: ep,
        sessionDate: todayStr(),
      });
      toast.success('독서 세션이 저장되었습니다.');
      onSaved();
      handleClose();
    } catch {
      toast.error('세션 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    clearTimer();
    setTimerState('idle');
    setElapsed(0);
    setStartPage('');
    setEndPage('');
    setSelectedBookId('');
    onClose();
  };

  useEffect(() => () => clearTimer(), [clearTimer]);

  if (!isOpen) return null;

  const selectedBook = books.find(b => b.id === selectedBookId);
  const isActive = timerState === 'running' || timerState === 'paused';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={timerState === 'idle' ? handleClose : undefined} />
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/8">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#f0f0f0]">독서 세션 기록</h2>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-[#666]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Book selector */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1.5 block">책 선택</label>
            <select
              value={selectedBookId}
              onChange={e => setSelectedBookId(e.target.value ? Number(e.target.value) : '')}
              disabled={isActive || timerState === 'stopped'}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">독서 중인 책 선택...</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
            {selectedBook && (
              <p className="text-xs text-gray-400 dark:text-[#666] mt-1 truncate">{selectedBook.author}</p>
            )}
            {books.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-[#666] mt-1">읽는 중인 책이 없습니다. 서재에서 독서 상태를 변경해주세요.</p>
            )}
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center gap-4">
            <div className={`text-5xl font-mono font-light tabular-nums transition-colors ${timerState === 'running' ? 'text-accent' : timerState === 'paused' ? 'text-amber-500' : timerState === 'stopped' ? 'text-emerald-500' : 'text-gray-300 dark:text-[#444]'}`}>
              {formatTime(elapsed)}
            </div>

            {/* Timer controls */}
            <div className="flex items-center gap-3">
              {timerState === 'idle' && (
                <button
                  onClick={handleStart}
                  disabled={!selectedBookId}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  시작
                </button>
              )}
              {timerState === 'running' && (
                <>
                  <button onClick={handlePause} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                    </svg>
                    일시정지
                  </button>
                  <button onClick={handleStop} className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-[#d0d0d0] rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-white/15 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                    </svg>
                    완료
                  </button>
                </>
              )}
              {timerState === 'paused' && (
                <>
                  <button onClick={handleResume} className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    계속
                  </button>
                  <button onClick={handleStop} className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-[#d0d0d0] rounded-xl text-sm font-medium hover:bg-gray-300 dark:hover:bg-white/15 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                    </svg>
                    완료
                  </button>
                </>
              )}
              {timerState === 'stopped' && (
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-[#a0a0a0] rounded-xl text-xs hover:bg-gray-200 dark:hover:bg-white/12 transition-all">
                  다시 시작
                </button>
              )}
            </div>
          </div>

          {/* Page inputs - shown when stopped */}
          {timerState === 'stopped' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1.5 block">시작 페이지</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={startPage}
                  onChange={e => setStartPage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-accent/20 text-center"
                />
              </div>
              <div className="flex items-end pb-2.5 text-gray-300 dark:text-[#444]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1.5 block">종료 페이지</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={endPage}
                  onChange={e => setEndPage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-accent/20 text-center"
                />
              </div>
            </div>
          )}

          {/* Save button - shown when stopped */}
          {timerState === 'stopped' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              {saving ? '저장 중...' : '세션 저장'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

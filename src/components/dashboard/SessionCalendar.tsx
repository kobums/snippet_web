"use client"

import React, { useState } from 'react';
import { ReadingSessionDto } from '@/types/readingSession';

interface Props {
  sessions: ReadingSessionDto[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}분`;
  return `${seconds}초`;
}

export default function SessionCalendar({ sessions, selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, () => null);

  const sessionsByDay: Record<string, ReadingSessionDto[]> = {};
  sessions.forEach(s => {
    if (!s.sessionDate) return;
    const d = new Date(s.sessionDate);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      (sessionsByDay[key] ??= []).push(s);
    }
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day: number) => {
    const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (sessionsByDay[key]) {
      onSelectDate(selectedDate === key ? null : key);
    }
  };

  return (
    <div className="liquid-panel p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 liquid-badge px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-[#d0d0d0]">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          세션 달력
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-[#666]">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="text-xs text-gray-500 dark:text-[#a0a0a0] w-16 text-center">{viewYear}년 {viewMonth + 1}월</span>
          <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-[#666]">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-gray-400 dark:text-[#666] mb-1">
        <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyCells.map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const key = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const daySessions = sessionsByDay[key];
          const hasSessions = !!daySessions;
          const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && today.getDate() === day;
          const isSelected = selectedDate === key;
          const totalDuration = hasSessions ? daySessions.reduce((sum, s) => sum + s.durationSeconds, 0) : 0;

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              title={hasSessions ? `${daySessions.length}세션 · ${formatDuration(totalDuration)}` : undefined}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all relative
                ${hasSessions ? 'cursor-pointer' : ''}
                ${isSelected ? 'bg-accent text-white shadow-md shadow-accent/20' : isToday ? 'bg-accent/10 text-accent' : hasSessions ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-800/30' : 'text-gray-400 dark:text-[#555]'}
              `}
            >
              <span className={`text-[10px] sm:text-xs font-medium leading-none ${isSelected ? 'text-white' : isToday ? 'text-accent' : hasSessions ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                {day}
              </span>
              {hasSessions && !isSelected && (
                <div className="flex gap-0.5">
                  {daySessions.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-emerald-500" />
                  ))}
                </div>
              )}
              {hasSessions && isSelected && (
                <div className="flex gap-0.5">
                  {daySessions.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-white/70" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && sessionsByDay[selectedDate] && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/8 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-[#a0a0a0]">
            {selectedDate.replace(/-/g, '.')} · {sessionsByDay[selectedDate].length}세션
          </span>
          <span className="text-xs font-semibold text-emerald-600">
            {formatDuration(sessionsByDay[selectedDate].reduce((s, r) => s + r.durationSeconds, 0))}
          </span>
        </div>
      )}
    </div>
  );
}

"use client"

import React, { useRef, useEffect, useState } from 'react';

interface DatePickerProps {
  value: string | null;                      // 'YYYY-MM-DD'
  onChange: (date: string | null) => void;   // 선택/지우기 시 호출 후 닫힘
  onClose: () => void;
  anchorAlign?: 'left' | 'right';            // 기본 'left'
  quickPresets?: number[];                   // 오늘+N일, 기본 [7, 14, 30]
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 로컬 기준 'YYYY-MM-DD' (toISOString의 UTC 변환으로 인한 하루 밀림 방지) */
function toLocalISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 'YYYY-MM-DD' → 로컬 자정 Date */
function parseLocal(s: string): Date {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day);
}

export function DatePicker({ value, onChange, onClose, anchorAlign = 'left', quickPresets = [7, 14, 30] }: DatePickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = toLocalISO(today);

  const initial = value ? parseLocal(value) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth()); // 0-indexed

  // 외부 클릭 닫기 (DropdownMenu 패턴)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // ESC 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const goPrevMonth = () => shiftMonth(-1);
  const goNextMonth = () => shiftMonth(1);

  const selectPreset = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    onChange(toLocalISO(d));
  };

  const firstDayWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${anchorAlign === 'right' ? 'right-0' : 'left-0'} top-full mt-1 z-50 w-[min(16rem,calc(100vw-1.5rem))] backdrop-blur-xl rounded-2xl p-3 shadow-xl
        bg-white/95 border border-gray-200
        dark:bg-[#1c1c1e]/95 dark:border-white/10`}
    >
      {/* 빠른 선택 칩 */}
      {quickPresets.length > 0 && (
        <div className="flex gap-1.5 mb-2.5">
          {quickPresets.map(n => (
            <button
              key={n}
              onClick={() => selectPreset(n)}
              className="flex-1 text-[11px] font-medium py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              +{n}일
            </button>
          ))}
        </div>
      )}

      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={goPrevMonth}
          aria-label="이전 달"
          className="p-1 rounded-lg text-gray-500 dark:text-[#a0a0a0] hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="text-sm font-semibold text-gray-900 dark:text-[#f0f0f0] tabular-nums">
          {viewYear}.{String(viewMonth + 1).padStart(2, '0')}
        </span>
        <button
          onClick={goNextMonth}
          aria-label="다음 달"
          className="p-1 rounded-lg text-gray-500 dark:text-[#a0a0a0] hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-[10px] font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-info' : 'text-gray-400 dark:text-[#666]'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`pad-${idx}`} />;
          const cellISO = toLocalISO(new Date(viewYear, viewMonth, day));
          const isSelected = value === cellISO;
          const isToday = todayISO === cellISO;
          return (
            <button
              key={cellISO}
              onClick={() => onChange(cellISO)}
              className={`aspect-square text-xs rounded-lg flex items-center justify-center tabular-nums transition-colors ${
                isSelected
                  ? 'bg-accent text-white font-semibold'
                  : isToday
                    ? 'ring-1 ring-accent text-accent font-medium hover:bg-accent/10'
                    : 'text-gray-700 dark:text-[#d0d0d0] hover:bg-gray-100 dark:hover:bg-white/8'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 하단 액션 */}
      <div className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100 dark:border-white/8">
        <button
          onClick={() => onChange(todayISO)}
          className="flex-1 text-[11px] font-medium py-1.5 rounded-lg bg-gray-100 dark:bg-white/8 text-gray-700 dark:text-[#d0d0d0] hover:bg-gray-200 dark:hover:bg-white/12 transition-colors"
        >
          오늘
        </button>
        <button
          onClick={() => onChange(null)}
          className="flex-1 text-[11px] font-medium py-1.5 rounded-lg text-gray-400 dark:text-[#666] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          지우기
        </button>
      </div>
    </div>
  );
}

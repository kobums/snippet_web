"use client"

import React from 'react';
import { UserBookDto } from '@/types/library';
import { useUIStore } from '@/stores/useUIStore';
import { useBookStore } from '@/stores/useBookStore';

interface ReadingCalendarProps {
  completedBooks: UserBookDto[];
}

export default function ReadingCalendar({ completedBooks }: ReadingCalendarProps) {
  const openBookRecord = useUIStore(s => s.openBookRecord);
  const { selectedYear, selectedMonth } = useBookStore();

  // selectedMonth는 1-indexed, Date는 0-indexed
  const viewYear = selectedYear;
  const viewMonth = selectedMonth - 1;

  const today = new Date();
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, () => null);

  const completedBooksByDay: Record<number, UserBookDto[]> = {};
  completedBooks.forEach(book => {
    if (book.endDate) {
      const d = new Date(book.endDate);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
        const date = d.getDate();
        if (!completedBooksByDay[date]) completedBooksByDay[date] = [];
        completedBooksByDay[date].push(book);
      }
    }
  });

  return (
    <div className="liquid-panel p-4 sm:p-5 md:p-6 shrink-0">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 liquid-badge px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          독서 달력
        </div>
        <span className="text-xs sm:text-sm text-gray-400">{viewYear}년 {viewMonth + 1}월</span>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2">
        <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-[3/4] opacity-0"></div>
        ))}
        {days.map(day => {
          const dayBooks = completedBooksByDay[day];
          const hasBooks = dayBooks && dayBooks.length > 0;
          const coverUrl = hasBooks ? dayBooks[dayBooks.length - 1].coverUrl : null;
          const isToday = isCurrentMonth && today.getDate() === day;

          return (
            <div
              key={day}
              className={`aspect-[3/4] relative group rounded-md overflow-hidden border ${isToday ? 'border-accent/30 bg-accent/5' : 'border-gray-100 bg-gray-50/50'} flex items-center justify-center transition-all ${hasBooks ? 'cursor-pointer hover:border-accent/30 shadow-sm' : ''}`}
              onClick={() => hasBooks && openBookRecord(dayBooks[dayBooks.length - 1])}
            >
              {hasBooks ? (
                <>
                  {coverUrl ? (
                    <img src={coverUrl} alt="cover" className="w-full h-full object-cover scale-105 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 text-blue-500 flex items-center justify-center text-[10px] font-medium border border-blue-100">완독</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[9px] font-medium translate-y-2 group-hover:translate-y-0 transition-transform">{dayBooks.length}권</span>
                  </div>
                  <div className="absolute top-1 left-1 bg-black/40 backdrop-blur-sm text-[9px] font-medium text-white w-4 h-4 rounded flex items-center justify-center shadow-sm">
                    {day}
                  </div>
                </>
              ) : (
                <span className={`text-[10px] ${isToday ? 'text-accent font-bold' : 'text-gray-400'}`}>{day}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

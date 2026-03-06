"use client"

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';
import { formatDate } from '@/lib/util';

interface DashboardStatsProps {
  stats: StatsDto | null;
  books: UserBookDto[];
  completedBooks: UserBookDto[];
  loading: boolean;
  onBookClick: (book: UserBookDto) => void;
}


export default function DashboardStats({ stats, books, completedBooks, loading, onBookClick }: DashboardStatsProps) {
  // stats가 0이거나 없으면 books 목록에서 직접 계산 (|| 사용: 0도 falsy 처리)
  const reading  = stats?.currentlyReadingCount  || books.filter(b => b.status === 'reading').length;
  const completed = stats?.monthlyCompletedCount || books.filter(b => b.status === 'completed').length;
  const totalDisplay = reading + completed;

  const COLORS = {
    completed: '#5ebd8a',
    reading:   '#9b7ee8',
    empty:     'rgba(0,0,0,0.05)',
  };

  const chartData =
    totalDisplay === 0
      ? [{ name: '없음', value: 1, color: COLORS.empty }]
      : [
          ...(completed > 0 ? [{ name: '완료',  value: completed, color: COLORS.completed }] : []),
          ...(reading   > 0 ? [{ name: '진행중', value: reading,   color: COLORS.reading   }] : []),
        ];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => null);

  const completedBooksByDay: Record<number, UserBookDto[]> = {};
  completedBooks.forEach(book => {
    if (book.endDate) {
      const d = new Date(book.endDate);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const date = d.getDate();
        if (!completedBooksByDay[date]) {
          completedBooksByDay[date] = [];
        }
        completedBooksByDay[date].push(book);
      }
    }
  });

  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-5 shrink-0 lg:overflow-y-auto hide-scrollbar">

      {/* ── 이번 달 읽기 현황 ── */}
      <div className="liquid-panel p-6">
        <h3 className="text-gray-900 font-medium mb-4 text-lg">이번 달은</h3>

        <div className="flex items-center mb-5">
          <div className="flex items-center gap-2 liquid-badge px-3 py-1.5 text-xs font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            읽기 현황
          </div>
        </div>

        {/* Donut Chart */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <PieChart width={200} height={200}>
              {/* 배경 링 */}
              <Pie
                data={[{ value: 1 }]}
                cx={95} cy={95}
                innerRadius={64} outerRadius={76}
                startAngle={90} endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="rgba(0,0,0,0.05)" />
              </Pie>
              {/* 데이터 링 */}
              <Pie
                data={chartData}
                cx={95} cy={95}
                innerRadius={64} outerRadius={76}
                startAngle={90} endAngle={-270}
                dataKey="value"
                stroke="none"
                cornerRadius={6}
                paddingAngle={completed > 0 && reading > 0 ? 4 : 0}
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>

            {/* 중앙 수치 (absolute overlay) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[44px] font-bold text-gray-900 leading-none tracking-tight">{totalDisplay}</span>
              <span className="text-xs text-gray-400 mt-2 font-medium">합계</span>
            </div>
          </div>

          {/* 범례 */}
          <div className="flex gap-6 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#34c759]"></div>
              <span>완료 {completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#7c5cbf]"></div>
              <span>진행중 {reading}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 독서 달력 ── */}
      <div className="liquid-panel p-6 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 liquid-badge px-3 py-1.5 text-xs font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            독서 달력
          </div>
          <span className="text-sm font-semibold text-gray-700">{currentYear}년 {currentMonth + 1}월</span>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-medium text-gray-400 mb-2">
          <div className="text-red-400">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div className="text-blue-400">토</div>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {emptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="aspect-[3/4] opacity-0"></div>
          ))}
          {days.map(day => {
            const dayBooks = completedBooksByDay[day];
            const hasBooks = dayBooks && dayBooks.length > 0;
            const coverUrl = hasBooks ? dayBooks[dayBooks.length - 1].coverUrl : null;
            const isToday = today.getDate() === day;
            
            return (
              <div 
                key={day} 
                className={`aspect-[3/4] relative group rounded-md overflow-hidden border ${isToday ? 'border-purple-300 bg-purple-50/30' : 'border-gray-100 bg-gray-50/50'} flex items-center justify-center transition-all ${hasBooks ? 'cursor-pointer hover:border-purple-300 shadow-sm' : ''}`}
                onClick={() => hasBooks && onBookClick(dayBooks[dayBooks.length - 1])}
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
                    {/* Date number overlay */}
                    <div className="absolute top-1 left-1 bg-black/40 backdrop-blur-sm text-[9px] font-medium text-white w-4 h-4 rounded flex items-center justify-center shadow-sm">
                      {day}
                    </div>
                  </>
                ) : (
                  <span className={`text-[10px] ${isToday ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>{day}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 읽은 책 목록 ── */}
      <div className="liquid-panel p-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div className="flex items-center gap-2 liquid-badge px-3 py-1.5 text-xs font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            읽은 책
          </div>
          <span className="text-xs text-gray-400">{completedBooks.length}권</span>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar flex-1">
          {loading ? (
            <div className="text-gray-400 text-sm py-8 text-center">로딩 중...</div>
          ) : completedBooks.length === 0 ? (
            <div className="text-gray-400 text-sm py-8 text-center border border-dashed border-gray-200 rounded-2xl">
              아직 다 읽은 책이 없습니다.
            </div>
          ) : (
            completedBooks.map(book => (
              <div
                key={book.id}
                onClick={() => onBookClick(book)}
                className="bg-white/60 border border-white/60 rounded-2xl overflow-hidden cursor-pointer hover:bg-white transition-colors shadow-sm group"
              >
                <div className="w-full h-[200px] bg-gray-50 flex items-center justify-center p-4">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="h-full object-contain drop-shadow-md group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                  )}
                </div>
                <div className="px-4 py-3 flex flex-col gap-1.5">
                  <h4 className="flex items-center gap-2 text-gray-900 font-medium text-sm leading-snug group-hover:text-purple-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    <span className="truncate">{book.title}</span>
                  </h4>
                  <p className="text-xs text-gray-400 pl-5">{book.author}</p>
                  <div className="flex items-center gap-1.5 pl-5 mt-1">
                    <div className="flex items-center justify-center w-[14px] h-[14px] rounded-[3px] bg-[#34c759] shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span className="text-[11px] text-gray-400">{formatDate(book.startDate)} ~ {formatDate(book.endDate)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

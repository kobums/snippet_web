"use client"

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { UserBookDto } from '@/types/library';

interface ReadingStatusProps {
  books: UserBookDto[];
}

export default function ReadingStatus({ books }: ReadingStatusProps) {
  const reading = books.filter(b => b.status === 'reading').length;
  const completed = books.filter(b => b.status === 'completed').length;
  const dropped = books.filter(b => b.status === 'dropped').length;
  const totalDisplay = reading + completed + dropped;

  const COLORS = {
    completed: '#34c759', // secondary (green)
    reading:   '#b794f4', // accent (purple)
    dropped:   '#ff3b30', // error (red)
    empty:     'rgba(0,0,0,0.05)',
  };

  const chartData =
    totalDisplay === 0
      ? [{ name: '없음', value: 1, color: COLORS.empty }]
      : [
          ...(completed > 0 ? [{ name: '완료',  value: completed, color: COLORS.completed }] : []),
          ...(reading   > 0 ? [{ name: '진행중', value: reading,   color: COLORS.reading   }] : []),
          ...(dropped   > 0 ? [{ name: '중단',  value: dropped,   color: COLORS.dropped   }] : []),
        ];

  return (
    <div className="liquid-panel p-4 sm:p-5 md:p-6">
      <h3 className="text-gray-900 dark:text-[#f0f0f0] font-medium mb-3 sm:mb-4 text-base sm:text-lg">전체 현황</h3>

      <div className="flex items-center mb-4 sm:mb-5">
        <div className="flex items-center gap-2 liquid-badge px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-[#d0d0d0]">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          읽기 현황
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <PieChart width={200} height={200} style={{ outline: 'none' }}>
            {/* 배경 링 */}
            <Pie
              data={[{ value: 1 }]}
              cx={95} cy={95}
              innerRadius={64} outerRadius={76}
              startAngle={90} endAngle={-270}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
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
              paddingAngle={chartData.length > 1 ? 4 : 0}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>

          {/* 중앙 수치 (absolute overlay) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[44px] font-bold text-gray-900 dark:text-[#f0f0f0] leading-none tracking-tight">{totalDisplay}</span>
            <span className="text-xs sm:text-sm text-gray-400 dark:text-[#666] mt-2 font-medium">합계</span>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 dark:text-[#a0a0a0] justify-center w-full flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.completed }}></div>
            <span>완료 {completed}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.reading }}></div>
            <span>진행중 {reading}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS.dropped }}></div>
            <span>중단 {dropped}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

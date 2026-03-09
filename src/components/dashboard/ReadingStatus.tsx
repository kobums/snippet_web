"use client"

import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';

interface ReadingStatusProps {
  stats: StatsDto | null;
  books: UserBookDto[];
}

export default function ReadingStatus({ stats, books }: ReadingStatusProps) {
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

  return (
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
  );
}

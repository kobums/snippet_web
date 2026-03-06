"use client"

import React from 'react';

interface MonthlyCompletedTabProps {
  monthlyStats: Record<number, number>;
  maxMonthly: number;
}

export default function MonthlyCompletedTab({ monthlyStats, maxMonthly }: MonthlyCompletedTabProps) {
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar max-h-[420px]">
      <div className="grid grid-cols-12 gap-1 mb-2">
        {Object.entries(monthlyStats).map(([month, count]) => (
          <div key={month} className="flex flex-col items-center gap-1">
            <div className="w-full rounded-sm bg-[#5ebd8a]"
              style={{ height: `${Math.max((count / maxMonthly) * 60, count > 0 ? 4 : 1)}px`, opacity: count > 0 ? 1 : 0.15 }} />
            <span className="text-[9px] text-gray-400">{month}월</span>
            <span className="text-[10px] font-medium text-gray-700">{count}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 flex flex-col gap-1.5">
        {Object.entries(monthlyStats)
          .filter(([, count]) => count > 0)
          .map(([month, count]) => (
            <div key={month} className="flex items-center gap-3 text-xs">
              <span className="text-gray-400 w-10 shrink-0">{month}월</span>
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <div className="h-full rounded-full bg-[#5ebd8a] transition-all"
                  style={{ width: `${(count / maxMonthly) * 100}%` }} />
              </div>
              <span className="text-gray-700 font-medium w-6 text-right">{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

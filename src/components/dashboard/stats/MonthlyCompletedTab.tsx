"use client"

import React from 'react';

interface MonthlyCompletedTabProps {
  monthlyStats: Record<number, number>;
  maxMonthly: number;
}

export default function MonthlyCompletedTab({ monthlyStats, maxMonthly }: MonthlyCompletedTabProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 overflow-y-auto hide-scrollbar max-h-[380px] sm:max-h-[420px]">
      <div className="grid grid-cols-12 gap-0.5 sm:gap-1 mb-2">
        {Object.entries(monthlyStats).map(([month, count]) => (
          <div key={month} className="flex flex-col items-center gap-1">
            <div className="w-full rounded-sm bg-[#5ebd8a]"
              style={{ height: `${Math.max((count / maxMonthly) * 60, count > 0 ? 4 : 1)}px`, opacity: count > 0 ? 1 : 0.15 }} />
            <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-[#666]">{month}월</span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-[#d0d0d0]">{count}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 dark:border-white/8 pt-2.5 sm:pt-3 flex flex-col gap-1.5 sm:gap-2">
        {Object.entries(monthlyStats)
          .filter(([, count]) => count > 0)
          .map(([month, count]) => (
            <div key={month} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-gray-400 dark:text-[#666] w-8 sm:w-10 shrink-0">{month}월</span>
              <div className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full h-1.5">
                <div className="h-full rounded-full bg-[#5ebd8a] transition-all"
                  style={{ width: `${(count / maxMonthly) * 100}%` }} />
              </div>
              <span className="text-gray-700 dark:text-[#d0d0d0] font-medium w-5 sm:w-6 text-right">{count}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

"use client"

import React from 'react';

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

interface MonthNavigatorProps {
  selectedYear: number;
  selectedMonth: number;
  isCurrentMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthNavigator({ selectedYear, selectedMonth, isCurrentMonth, onPrevMonth, onNextMonth }: MonthNavigatorProps) {
  return (
    <div className="flex items-center justify-between px-1 sm:px-2">
      <button onClick={onPrevMonth}
        className="p-1.5 sm:p-2 rounded-lg text-gray-500 dark:text-[#a0a0a0] hover:bg-white/60 hover:text-gray-900 dark:text-[#f0f0f0] transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-[#d0d0d0]">
        {selectedYear}년 {MONTH_NAMES[selectedMonth - 1]}
      </span>
      <button onClick={onNextMonth} disabled={isCurrentMonth}
        className={`p-1.5 sm:p-2 rounded-lg transition-all ${isCurrentMonth ? 'text-gray-300 dark:text-[#444] cursor-not-allowed' : 'text-gray-500 dark:text-[#a0a0a0] hover:bg-white/60 hover:text-gray-900 dark:text-[#f0f0f0]'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}

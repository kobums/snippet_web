"use client"

import React, { useEffect, useState } from 'react';
import { getReadingGoal, setReadingGoal } from '@/lib/readingGoalApi';
import type { ReadingGoalDto } from '@/types/readingGoal';
import { handleApiError } from '@/lib/errorHandler';

export default function ReadingGoalCard() {
  const [goal, setGoal] = useState<ReadingGoalDto | null>(null);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    getReadingGoal().then(setGoal).catch(() => {});
  }, []);

  const handleSave = async () => {
    const target = parseInt(inputValue, 10);
    if (!target || target < 1 || !goal) return;
    try {
      const updated = await setReadingGoal(goal.year, target);
      setGoal(updated);
      setEditing(false);
    } catch (e) {
      handleApiError(e, '목표 설정에 실패했습니다.');
    }
  };

  if (!goal) return null;

  const progress = goal.targetBooks > 0
    ? Math.min(goal.completedBooks / goal.targetBooks, 1)
    : 0;
  const pct = Math.round(progress * 100);
  const achieved = progress >= 1;

  return (
    <div className="liquid-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-900 dark:text-[#f0f0f0] font-medium text-base">
          {goal.year}년 독서 목표
        </h3>
        <button
          onClick={() => { setEditing(true); setInputValue(goal.targetBooks > 0 ? String(goal.targetBooks) : ''); }}
          className="text-xs text-accent hover:text-accent/80 transition-colors"
        >
          {goal.targetBooks === 0 ? '목표 설정' : '수정'}
        </button>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="목표 권수"
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-accent/20"
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
          />
          <button onClick={handleSave} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">저장</button>
          <button onClick={() => setEditing(false)} className="text-xs px-2 py-1.5 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">취소</button>
        </div>
      ) : goal.targetBooks === 0 ? (
        <p className="text-sm text-gray-400 dark:text-[#666]">올해 몇 권을 읽을지 목표를 설정해보세요!</p>
      ) : (
        <>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-2xl font-bold text-accent">{goal.completedBooks}</span>
            <span className="text-sm text-gray-500 dark:text-[#a0a0a0] mb-0.5">/ {goal.targetBooks}권</span>
            <span className={`ml-auto text-sm font-medium ${achieved ? 'text-green-500' : 'text-gray-500 dark:text-[#a0a0a0]'}`}>{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${achieved ? 'bg-green-500' : 'bg-accent'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {achieved && (
            <p className="text-xs text-green-500 mt-2">🎉 목표 달성! 축하합니다!</p>
          )}
        </>
      )}
    </div>
  );
}

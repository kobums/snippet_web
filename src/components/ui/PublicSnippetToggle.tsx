"use client"

import React from 'react';

/**
 * 밑줄(스니펫)을 다른 사용자의 스와이프 카드에 공개할지 고르는 체크박스.
 * 기본은 비공개다 — 예전엔 모든 밑줄이 작성자 동의 없이 카드에 노출됐다.
 */
export default function PublicSnippetToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label
      className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#a0a0a0] cursor-pointer select-none"
      title="켜면 이 문장이 다른 사용자의 스와이프 카드에 나옵니다"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-3.5 h-3.5 accent-accent cursor-pointer"
      />
      스와이프 카드에 공개
    </label>
  );
}

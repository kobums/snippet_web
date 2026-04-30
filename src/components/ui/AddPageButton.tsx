import React from 'react';
import { PlusIcon } from './icons';

interface AddPageButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function AddPageButton({ onClick, label = '새 페이지', className }: AddPageButtonProps) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 text-xs text-gray-400 dark:text-[#666] hover:text-gray-600 dark:text-[#a0a0a0] transition-colors px-3 py-2 w-full ${className ?? 'mt-3'}`}>
      <PlusIcon size={14} />
      {label}
    </button>
  );
}

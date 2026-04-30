import React from 'react';
import { PlusIcon } from './icons';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
      {icon && (
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 text-gray-200 dark:bg-white/6 dark:text-white/20">
          {icon}
        </div>
      )}
      <div className="text-center">
        <p className="text-sm text-gray-400 dark:text-[#666]">{message}</p>
        {actionLabel && onAction && (
          <button onClick={onAction}
            className="mt-4 flex items-center gap-2 text-xs text-primary dark:text-[#f0f0f0] hover:text-primary/75 dark:hover:text-white font-medium bg-primary/8 dark:bg-white/10 hover:bg-primary/12 dark:hover:bg-white/15 px-4 py-2 rounded-xl transition-all border border-primary/10 dark:border-white/15 mx-auto">
            <PlusIcon size={14} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

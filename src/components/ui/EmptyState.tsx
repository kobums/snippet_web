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
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          {icon}
        </div>
      )}
      <div className="text-center">
        <p className="text-gray-400 text-sm">{message}</p>
        {actionLabel && onAction && (
          <button onClick={onAction}
            className="mt-4 flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-100 mx-auto">
            <PlusIcon size={14} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

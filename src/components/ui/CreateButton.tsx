import React from 'react';
import { ChevronDownIcon, PlusIcon } from './icons';

interface CreateButtonProps {
  onClick: () => void;
  label?: string;
}

export function CreateButton({ onClick, label = '새로 만들기' }: CreateButtonProps) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/15 text-xs font-medium transition-all border border-primary/15">
      <PlusIcon size={14} />
      {label}
      <ChevronDownIcon size={12} strokeWidth={2.5} />
    </button>
  );
}

interface SplitCreateButtonProps {
  onClick: () => void;
  onDropdownClick: () => void;
  label?: string;
}

export function SplitCreateButton({ onClick, onDropdownClick, label = '새로 만들기' }: SplitCreateButtonProps) {
  return (
    <div className="flex items-stretch">
      <button onClick={onClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg bg-primary/10 text-primary hover:bg-primary/15 text-xs font-medium transition-all border border-primary/15 border-r-0">
        <PlusIcon size={14} />
        {label}
      </button>
      <button onClick={onDropdownClick}
        className="px-2 py-1.5 rounded-r-lg bg-primary/10 text-primary hover:bg-primary/15 text-xs font-medium transition-all border border-primary/15 h-full">
        <ChevronDownIcon size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}

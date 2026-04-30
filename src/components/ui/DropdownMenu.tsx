"use client"

import React, { useRef, useEffect } from 'react';

interface DropdownItem {
  key: string;
  label: string;
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownItem[];
  activeKey?: string;
  onSelect: (key: string) => void;
  align?: 'left' | 'right';
}

export function DropdownMenu({ isOpen, onClose, items, activeKey, onSelect, align = 'right' }: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={ref}
      className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 backdrop-blur-xl rounded-xl p-1 min-w-[120px] z-50 shadow-xl
        bg-white/95 border border-gray-200
        dark:bg-[#1c1c1e]/95 dark:border-white/10`}>
      {items.map(item => (
        <button key={item.key}
          onClick={() => { onSelect(item.key); onClose(); }}
          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
            activeKey === item.key
              ? 'bg-gray-100 text-gray-900 font-medium dark:bg-white/10 dark:text-[#f0f0f0]'
              : 'text-gray-600 hover:bg-gray-50 dark:text-[#a0a0a0] dark:hover:bg-white/8'
          }`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

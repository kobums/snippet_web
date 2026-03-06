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
      className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-xl p-1 min-w-[120px] z-50 shadow-xl`}>
      {items.map(item => (
        <button key={item.key}
          onClick={() => { onSelect(item.key); onClose(); }}
          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
            activeKey === item.key ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
          }`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

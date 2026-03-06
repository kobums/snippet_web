import React from 'react';

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabFilterProps {
  tabs: Tab[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export function TabFilter({ tabs, activeKey, onSelect }: TabFilterProps) {
  return (
    <div className="flex items-center gap-1.5">
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onSelect(tab.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeKey === tab.key
              ? 'liquid-badge text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-white/50 border border-transparent'
          }`}>
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

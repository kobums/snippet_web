import React from 'react';

interface BookSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BookSearchInput({ value, onChange, placeholder = "책, 저자 검색..." }: BookSearchInputProps) {
  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 bg-white/60 border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-blue-400 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder} 
          className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" 
        />
        {value && (
          <button onClick={() => onChange('')} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

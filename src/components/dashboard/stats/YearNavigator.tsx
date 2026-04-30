"use client"

interface YearNavigatorProps {
  year: number;
  onChange: (year: number) => void;
}

export default function YearNavigator({ year, onChange }: YearNavigatorProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(year - 1)}
        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-white/10/10 transition-colors"
      >
        ←
      </button>
      <span className="text-sm font-medium text-gray-700 dark:text-[#d0d0d0] min-w-[3.5rem] text-center">{year}</span>
      <button
        onClick={() => onChange(year + 1)}
        disabled={year >= currentYear}
        className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
          year >= currentYear
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-white/10/10'
        }`}
      >
        →
      </button>
    </div>
  );
}

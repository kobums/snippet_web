"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { YearlyStatsDto } from '@/types/stats';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface YearlyComparisonSectionProps {
  data: YearlyStatsDto[];
}

export default function YearlyComparisonSection({ data }: YearlyComparisonSectionProps) {
  const isMobile = useIsMobile();
  const chartData = data.map(d => ({
    year: `${d.year}년`,
    완료권수: d.completedCount,
    읽은페이지: d.totalPages,
  }));

  const maxBooks = Math.max(...data.map(d => d.completedCount));
  const maxPages = Math.max(...data.map(d => d.totalPages));

  if (isMobile) {
    return (
      <div className="liquid-panel p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">연도별 비교</h2>

        <div className="space-y-3">
          {data.map((yearData) => (
            <div key={yearData.year} className="liquid-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-700">{yearData.year}년</span>
                <div className="text-sm text-gray-500">
                  📚 {yearData.completedCount}권 · 📄 {yearData.totalPages.toLocaleString()}p
                </div>
              </div>

              {/* 완료 권수 프로그레스 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>완료한 책</span>
                  <span>{yearData.completedCount}권</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${maxBooks > 0 ? (yearData.completedCount / maxBooks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* 읽은 페이지 프로그레스 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>읽은 페이지</span>
                  <span>{yearData.totalPages.toLocaleString()}p</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-500"
                    style={{ width: `${maxPages > 0 ? (yearData.totalPages / maxPages) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-panel p-5 md:p-6 space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">연도별 비교</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="완료권수" fill="#34c759" radius={[4, 4, 0, 0]} />
          <Bar dataKey="읽은페이지" fill="#b794f4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

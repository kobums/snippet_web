"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyStatsDto } from '@/types/stats';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface MonthlyComparisonSectionProps {
  data: MonthlyStatsDto[];
  year: number;
}

export default function MonthlyComparisonSection({ data, year }: MonthlyComparisonSectionProps) {
  const isMobile = useIsMobile();

  // 현재 날짜 기준 필터링 (현재 연도인 경우 현재 월까지만 표시)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-based to 1-based

  const filteredData = year === currentYear
    ? data.filter(d => d.month <= currentMonth)
    : data;

  const chartData = filteredData.map(d => ({
    month: `${d.month}월`,
    완료권수: d.completedCount,
    읽은페이지: d.totalPages,
  }));

  const maxBooks = Math.max(...filteredData.map(d => d.completedCount));
  const maxPages = Math.max(...filteredData.map(d => d.totalPages));

  if (isMobile) {
    return (
      <div className="liquid-panel p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">{year}년 월별 독서 통계</h2>

        <div className="space-y-3">
          {filteredData.map((monthData) => (
            <div key={monthData.month} className="liquid-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">{monthData.month}월</span>
                <div className="text-sm text-gray-500">
                  📚 {monthData.completedCount}권 · 📄 {monthData.totalPages.toLocaleString()}p
                </div>
              </div>

              {/* 완료 권수 프로그레스 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>완료한 책</span>
                  <span>{monthData.completedCount}권</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${maxBooks > 0 ? (monthData.completedCount / maxBooks) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* 읽은 페이지 프로그레스 */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>읽은 페이지</span>
                  <span>{monthData.totalPages.toLocaleString()}p</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${maxPages > 0 ? (monthData.totalPages / maxPages) * 100 : 0}%` }}
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
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{year}년 월별 독서 통계</h2>

      {/* 완료 권수 Bar Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">월별 완료한 책</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Bar dataKey="완료권수" fill="#5ebd8a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 읽은 페이지 Line Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">월별 읽은 페이지</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="읽은페이지" stroke="#9b7ee8" strokeWidth={2} dot={{ fill: '#9b7ee8' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

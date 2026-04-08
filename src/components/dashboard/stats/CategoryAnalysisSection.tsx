"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CategoryStatsDto } from '@/types/stats';
import { useIsMobile } from '@/hooks/useMediaQuery';

const COLORS = ['#5ebd8a', '#9b7ee8', '#f87171', '#fbbf24', '#60a5fa', '#ec4899'];

interface CategoryAnalysisSectionProps {
  data: CategoryStatsDto[];
}

export default function CategoryAnalysisSection({ data }: CategoryAnalysisSectionProps) {
  const isMobile = useIsMobile();
  const pieData = data.map(d => ({ name: d.category, value: d.completedCount }));
  const barData = data.map(d => ({ category: d.category, 완독률: Number(d.completionRate.toFixed(1)) }));

  const totalBooks = data.reduce((sum, d) => sum + d.completedCount, 0);

  if (isMobile) {
    return (
      <div className="liquid-panel p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">장르별 분석</h2>

        <div className="space-y-3">
          {data.map((category, index) => {
            const percentage = totalBooks > 0 ? (category.completedCount / totalBooks) * 100 : 0;
            const color = COLORS[index % COLORS.length];

            return (
              <div key={category.category} className="liquid-card p-4 space-y-3">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-semibold text-gray-700">{category.category}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {category.completedCount}권
                  </span>
                </div>

                {/* 독서 비율 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>전체 대비 비율</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>

                {/* 완독률 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>완독률</span>
                    <span>{category.completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full transition-all duration-500"
                      style={{ width: `${category.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="liquid-panel p-5 md:p-6 space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">장르별 분석</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">장르별 독서 비율</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rate Bar Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">장르별 완독률 (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
              <YAxis type="category" dataKey="category" stroke="#9ca3af" fontSize={12} width={100} />
              <Tooltip />
              <Bar dataKey="완독률" fill="#b794f4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

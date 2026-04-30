"use client"

import { useState, useEffect } from 'react';
import { getMonthlyStats, getYearlyStats, getCategoryStats, getReadingInsights } from '@/lib/statsApi';
import type { MonthlyStatsDto, YearlyStatsDto, CategoryStatsDto, ReadingInsightsDto } from '@/types/stats';
import AppShell from '@/components/layout/AppShell';
import MonthlyComparisonSection from '@/components/dashboard/stats/MonthlyComparisonSection';
import ReadingInsightsSection from '@/components/dashboard/stats/ReadingInsightsSection';
import CategoryAnalysisSection from '@/components/dashboard/stats/CategoryAnalysisSection';
import YearlyComparisonSection from '@/components/dashboard/stats/YearlyComparisonSection';
import YearNavigator from '@/components/dashboard/stats/YearNavigator';
import { StatsSkeleton } from '@/components/ui/skeleton';

export default function StatsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStatsDto[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStatsDto[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStatsDto[]>([]);
  const [insights, setInsights] = useState<ReadingInsightsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [monthly, yearly, category, insightsData] = await Promise.all([
          getMonthlyStats(selectedYear),
          getYearlyStats(),
          getCategoryStats(selectedYear),
          getReadingInsights(selectedYear),
        ]);
        setMonthlyStats(monthly);
        setYearlyStats(yearly);
        setCategoryStats(category);
        setInsights(insightsData);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setError('통계 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [selectedYear]);

  if (loading) {
    return (
      <AppShell>
        <StatsSkeleton />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="liquid-panel p-6 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="w-full h-full overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-[1400px] mx-auto pb-20">
          {/* Header */}
          <div className="liquid-panel p-5 md:p-6 flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-[#d0d0d0]">독서 통계</h1>
            <YearNavigator year={selectedYear} onChange={setSelectedYear} />
          </div>

          {/* Scroll Layout */}
          <div className="space-y-6 md:space-y-8">
            {/* 1. 월별 비교 */}
            {monthlyStats.length > 0 && (
              <MonthlyComparisonSection data={monthlyStats} year={selectedYear} />
            )}

            {/* 2. 독서 인사이트 */}
            <ReadingInsightsSection data={insights} />

            {/* 3. 카테고리별 분포 */}
            {categoryStats.length > 0 && (
              <CategoryAnalysisSection data={categoryStats} />
            )}

            {/* 4. 연도별 비교 */}
            {yearlyStats.length > 0 && (
              <YearlyComparisonSection data={yearlyStats} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

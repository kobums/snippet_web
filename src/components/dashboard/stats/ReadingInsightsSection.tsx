"use client"

import type { ReadingInsightsDto } from '@/types/stats';

interface ReadingInsightsSectionProps {
  data: ReadingInsightsDto | null;
}

export default function ReadingInsightsSection({ data }: ReadingInsightsSectionProps) {
  if (!data) return null;

  const insights = [
    { title: '평균 독서 시간', value: `${Math.round(data.averageReadingDays)}일`, icon: '📅' },
    { title: '가장 많이 읽은 장르', value: data.topCategory, icon: '📚' },
    { title: '최장 독서 기록', value: `${data.longestReadingDays}일`, icon: '🏆', subtitle: data.longestBook },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {insights.map((insight, idx) => (
        <div key={idx} className="liquid-card p-5 md:p-6 text-center space-y-2">
          <div className="text-3xl">{insight.icon}</div>
          <h3 className="text-xs sm:text-sm text-gray-500">{insight.title}</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{insight.value}</p>
          {insight.subtitle && <p className="text-xs text-gray-400 truncate">{insight.subtitle}</p>}
        </div>
      ))}
    </div>
  );
}

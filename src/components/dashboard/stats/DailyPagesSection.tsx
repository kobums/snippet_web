"use client"

import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailyPages } from '@/lib/readingLogApi';
import type { DailyPagesDto } from '@/types/stats';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useThemeStore } from '@/stores/useThemeStore';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChartIcon } from '@/components/ui/icons';

interface DailyPagesSectionProps {
  year: number;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function getInitialMonth(year: number): number {
  const now = new Date();
  return year === now.getFullYear() ? now.getMonth() + 1 : 12;
}

export default function DailyPagesSection({ year }: DailyPagesSectionProps) {
  const isMobile = useIsMobile();
  const isDark = useThemeStore(s => s.effectiveDark());
  const gridColor = isDark ? '#3a3a3c' : '#e5e7eb';
  const axisColor = isDark ? '#666666' : '#9ca3af';

  const [month, setMonth] = useState(() => getInitialMonth(year));
  const [data, setData] = useState<DailyPagesDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const now = new Date();
  const isCurrentYear = year === now.getFullYear();
  const maxMonth = isCurrentYear ? now.getMonth() + 1 : 12;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const result = await getDailyPages(year, month);
        if (!cancelled) setData(result);
      } catch (err) {
        console.error('Failed to load daily pages:', err);
        if (!cancelled) {
          setData([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  // 서버는 읽은 날만 내려주므로 해당 월의 모든 날짜를 0으로 채운다.
  const chartData = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const pagesByDay = new Map<number, number>();
    data.forEach(d => {
      const day = Number(d.date.slice(8, 10));
      pagesByDay.set(day, (pagesByDay.get(day) ?? 0) + d.pages);
    });
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        day,
        weekday: WEEKDAYS[new Date(year, month - 1, day).getDay()],
        pages: pagesByDay.get(day) ?? 0,
      };
    });
  }, [data, year, month]);

  const summary = useMemo(() => {
    const readDays = chartData.filter(d => d.pages > 0);
    const total = readDays.reduce((sum, d) => sum + d.pages, 0);
    const best = readDays.reduce<(typeof readDays)[number] | null>(
      (acc, d) => (acc === null || d.pages > acc.pages ? d : acc),
      null,
    );
    return {
      total,
      daysRead: readDays.length,
      average: readDays.length > 0 ? Math.round(total / readDays.length) : 0,
      best,
    };
  }, [chartData]);

  const summaryItems = [
    { title: '이번 달 읽은 페이지', value: `${summary.total.toLocaleString()}p` },
    { title: '읽은 날', value: `${summary.daysRead}일` },
    { title: '하루 평균', value: `${summary.average.toLocaleString()}p`, subtitle: '읽은 날 기준' },
    {
      title: '가장 많이 읽은 날',
      value: summary.best ? `${summary.best.pages.toLocaleString()}p` : '-',
      subtitle: summary.best ? `${month}월 ${summary.best.day}일 (${summary.best.weekday})` : undefined,
    },
  ];

  const navButtonClass = (disabled: boolean) =>
    `w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
      disabled
        ? 'text-gray-300 dark:text-[#444] cursor-not-allowed'
        : 'text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-100 dark:hover:bg-white/10'
    }`;

  return (
    <div className="liquid-panel p-5 md:p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-[#d0d0d0]">일별 읽은 페이지</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMonth(m => m - 1)}
            disabled={month <= 1}
            aria-label="이전 달"
            className={navButtonClass(month <= 1)}
          >
            ←
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-[#d0d0d0] min-w-[5rem] text-center">
            {year}년 {month}월
          </span>
          <button
            onClick={() => setMonth(m => m + 1)}
            disabled={month >= maxMonth}
            aria-label="다음 달"
            className={navButtonClass(month >= maxMonth)}
          >
            →
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="liquid-card p-4 space-y-2">
                <div className="h-3 w-20 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-14 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-[220px] bg-gray-50 dark:bg-white/6 rounded-xl animate-pulse" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-red-500">일별 기록을 불러오지 못했습니다.</p>
      ) : summary.daysRead === 0 ? (
        <EmptyState icon={<BarChartIcon size={28} />} message={`${month}월에 기록한 페이지가 없어요`} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {summaryItems.map(item => (
              <div key={item.title} className="liquid-card p-4 space-y-1">
                <h3 className="text-xs text-gray-500 dark:text-[#a0a0a0]">{item.title}</h3>
                <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-[#d0d0d0]">{item.value}</p>
                {item.subtitle && <p className="text-[11px] text-gray-400 dark:text-[#666]">{item.subtitle}</p>}
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="day"
                stroke={axisColor}
                fontSize={isMobile ? 10 : 12}
                interval={isMobile ? 4 : 0}
                tickLine={false}
              />
              <YAxis stroke={axisColor} fontSize={isMobile ? 10 : 12} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                contentStyle={{ background: isDark ? '#1c1c1e' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb', borderRadius: '12px', color: isDark ? '#f0f0f0' : '#1a1a1a' }}
                labelFormatter={(label, payload) => {
                  const weekday = payload?.[0]?.payload?.weekday;
                  return `${month}월 ${label}일${weekday ? ` (${weekday})` : ''}`;
                }}
                formatter={(value) => [`${Number(value).toLocaleString()}p`, '읽은 페이지']}
              />
              <Bar dataKey="pages" fill="#9b7ee8" radius={[4, 4, 0, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

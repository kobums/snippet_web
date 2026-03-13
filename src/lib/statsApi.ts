import api from './api';
import type { MonthlyStatsDto, YearlyStatsDto, CategoryStatsDto, ReadingInsightsDto } from '@/types/stats';

export const getMonthlyStats = async (year?: number): Promise<MonthlyStatsDto[]> => {
  const params = year ? `?year=${year}` : '';
  const response = await api.get<MonthlyStatsDto[]>(`/userbooks/stats/monthly${params}`);
  return response.data;
};

export const getYearlyStats = async (): Promise<YearlyStatsDto[]> => {
  const response = await api.get<YearlyStatsDto[]>('/userbooks/stats/yearly');
  return response.data;
};

export const getCategoryStats = async (year?: number): Promise<CategoryStatsDto[]> => {
  const params = year ? `?year=${year}` : '';
  const response = await api.get<CategoryStatsDto[]>(`/userbooks/stats/category${params}`);
  return response.data;
};

export const getReadingInsights = async (year?: number): Promise<ReadingInsightsDto> => {
  const params = year ? `?year=${year}` : '';
  const response = await api.get<ReadingInsightsDto>(`/userbooks/stats/insights${params}`);
  return response.data;
};

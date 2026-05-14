import api from './api';
import type { ReadingGoalDto } from '@/types/readingGoal';

export const getReadingGoal = async (year?: number): Promise<ReadingGoalDto> => {
  const params = year ? { year } : {};
  const response = await api.get<ReadingGoalDto>('/readinggoals', { params });
  return response.data;
};

export const setReadingGoal = async (year: number, targetBooks: number): Promise<ReadingGoalDto> => {
  const response = await api.put<ReadingGoalDto>('/readinggoals', { year, targetBooks });
  return response.data;
};

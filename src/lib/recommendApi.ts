import api from './api';
import type { BookRecommendDto } from '@/types/recommend';

export const getRecommendations = async (limit = 10): Promise<BookRecommendDto[]> => {
  const response = await api.get<BookRecommendDto[]>('/books/recommend', { params: { limit } });
  return response.data;
};

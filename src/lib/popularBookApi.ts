import api from './api';
import { PopularBookDto, PopularBooksParams } from '../types/popular';

export const getPopularBooks = async (
  params: PopularBooksParams = {}
): Promise<PopularBookDto[]> => {
  const response = await api.get<PopularBookDto[]>('/books/popular', { params });
  return response.data;
};

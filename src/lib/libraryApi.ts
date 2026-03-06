import { BookSearchDto, LibraryAddRequestDto, UserBookDto } from '../types/library';
import api from './api';

export const searchBooks = async (query: string): Promise<BookSearchDto[]> => {
  const response = await api.get<BookSearchDto[]>('/library/search', {
    params: { query },
  });
  return response.data;
};

export const addBookToLibrary = async (data: LibraryAddRequestDto): Promise<number> => {
  const response = await api.post<number>('/library/add', data);
  return response.data;
};

export const getUserBooks = async (): Promise<UserBookDto[]> => {
  const response = await api.get<UserBookDto[]>('/library');
  return response.data;
};

export const updateBookStatus = async (userBookId: number, status: string): Promise<void> => {
  await api.patch(`/library/${userBookId}/status`, { status });
};

export const updateBookProgress = async (userBookId: number, readPage: number): Promise<void> => {
  await api.patch(`/library/${userBookId}/progress`, { readPage });
};

export const updateBookType = async (userBookId: number, type: string): Promise<void> => {
  await api.patch(`/library/${userBookId}/type`, { type });
};

export const updateBookStartDate = async (userBookId: number, startDate: string): Promise<void> => {
  await api.patch(`/library/${userBookId}/startdate`, { startDate });
};

export const updateBookEndDate = async (userBookId: number, endDate: string): Promise<void> => {
  await api.patch(`/library/${userBookId}/enddate`, { endDate });
};

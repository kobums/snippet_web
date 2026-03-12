import { BookSearchDto } from '../types/library';
import api from './api';

// Search (알라딘 API)
export const searchBooks = async (query: string, page: number = 1): Promise<BookSearchDto[]> => {
  const response = await api.get<BookSearchDto[]>('/books/search', {
    params: { query, page },
  });
  return response.data;
};

// Read all
export const getBooks = async (): Promise<BookSearchDto[]> => {
  const response = await api.get<BookSearchDto[]>('/books');
  return response.data;
};

// Read one
export const getBook = async (id: number): Promise<BookSearchDto> => {
  const response = await api.get<BookSearchDto>(`/books/${id}`);
  return response.data;
};

// Create
export const createBook = async (data: Partial<BookSearchDto>): Promise<number> => {
  const response = await api.post<number>('/books', data);
  return response.data;
};

// Update (full)
export const updateBook = async (id: number, data: Partial<BookSearchDto>): Promise<void> => {
  await api.put(`/books/${id}`, data);
};

// Update (partial)
export const patchBook = async (id: number, data: Partial<BookSearchDto>): Promise<void> => {
  await api.patch(`/books/${id}`, data);
};

// Delete
export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`);
};

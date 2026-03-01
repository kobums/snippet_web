import { BookSearchDto, LibraryAddRequestDto } from '../types/library';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';

const libraryApi = axios.create({
  baseURL: `${API_URL}/library`,
});

export const searchBooks = async (query: string): Promise<BookSearchDto[]> => {
  const response = await libraryApi.get<BookSearchDto[]>('/search', {
    params: { query },
  });
  return response.data;
};

export const addBookToLibrary = async (data: LibraryAddRequestDto): Promise<number> => {
  const response = await libraryApi.post<number>('/add', data);
  return response.data;
};

export const getUserBooks = async (): Promise<import('../types/library').UserBookDto[]> => {
  const response = await libraryApi.get<import('../types/library').UserBookDto[]>('');
  return response.data;
};

export const updateBookStatus = async (userBookId: number, status: string): Promise<void> => {
  await libraryApi.patch(`/${userBookId}/status`, { status });
};

export const updateBookProgress = async (userBookId: number, readPage: number): Promise<void> => {
  await libraryApi.patch(`/${userBookId}/progress`, { readPage });
};

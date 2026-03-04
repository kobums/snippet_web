import { RecordDto, RecordAddRequestDto } from '../types/record';
import api from './api';

export const getRecordsByBook = async (bookId: number, type?: string): Promise<RecordDto[]> => {
  const params = type ? { type } : {};
  const response = await api.get<RecordDto[]>(`/books/${bookId}/records`, { params });
  return response.data;
};

export const addRecordToBook = async (bookId: number, data: RecordAddRequestDto): Promise<number> => {
  const response = await api.post<number>(`/books/${bookId}/records`, data);
  return response.data;
};

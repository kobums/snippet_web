import { RecordDto, RecordAddRequestDto } from '../types/record';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';

const recordApi = axios.create({
  baseURL: `${API_URL}/books`,
});

export const getRecordsByBook = async (bookId: number, type?: string): Promise<RecordDto[]> => {
  const params = type ? { type } : {};
  const response = await recordApi.get<RecordDto[]>(`/${bookId}/records`, { params });
  return response.data;
};

export const addRecordToBook = async (bookId: number, data: RecordAddRequestDto): Promise<number> => {
  const response = await recordApi.post<number>(`/${bookId}/records`, data);
  return response.data;
};

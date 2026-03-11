import { RecordDto, RecordAddRequestDto } from '../types/record';
import api from './api';

// Read all
export const getRecords = async (): Promise<RecordDto[]> => {
  const response = await api.get<RecordDto[]>('/records');
  return response.data;
};

// Read one
export const getRecord = async (id: number): Promise<RecordDto> => {
  const response = await api.get<RecordDto>(`/records/${id}`);
  return response.data;
};

// Read by book
export const getRecordsByBook = async (bookId: number, type?: string): Promise<RecordDto[]> => {
  const params: Record<string, string | number> = { bookId };
  if (type) params.type = type;
  const response = await api.get<RecordDto[]>('/records/bybook', { params });
  return response.data;
};

// Read monthly
export const getMonthlyRecords = async (type: string, year?: number, month?: number): Promise<RecordDto[]> => {
  const params: Record<string, string | number> = { type };
  if (year !== undefined) params.year = year;
  if (month !== undefined) params.month = month;
  const response = await api.get<RecordDto[]>('/records/monthly', { params });
  return response.data;
};

// Create
export const createRecord = async (bookId: number, data: RecordAddRequestDto): Promise<number> => {
  const response = await api.post<number>('/records', { ...data, bookId });
  return response.data;
};

// Update (full)
export const updateRecord = async (id: number, data: Partial<RecordDto>): Promise<void> => {
  await api.put(`/records/${id}`, data);
};

// Update (partial)
export const patchRecord = async (id: number, data: Partial<RecordDto>): Promise<void> => {
  await api.patch(`/records/${id}`, data);
};

// Delete
export const deleteRecord = async (id: number): Promise<void> => {
  await api.delete(`/records/${id}`);
};

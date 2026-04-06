import { LibraryAddRequestDto, UserBookDto } from '../types/library';
import api from './api';

// 해당 월에 활동이 있는 책 조회 (활동 기간 겹침 방식)
export const getMonthlyUserBooks = async (year?: number, month?: number): Promise<UserBookDto[]> => {
  const params = new URLSearchParams();
  if (year !== undefined) params.append('year', String(year));
  if (month !== undefined) params.append('month', String(month));
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get<UserBookDto[]>(`/userbooks/monthly${query}`);
  return response.data;
};

// Read all (전체 조회, 관리용)
export const getUserBooks = async (): Promise<UserBookDto[]> => {
  const response = await api.get<UserBookDto[]>('/userbooks');
  return response.data;
};

// 진행 탭용 책 목록 (waiting/reading: 전체, completed: 해당 월)
export const getProgressBooks = async (year?: number, month?: number): Promise<UserBookDto[]> => {
  const params = new URLSearchParams();
  if (year !== undefined) params.append('year', String(year));
  if (month !== undefined) params.append('month', String(month));
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await api.get<UserBookDto[]>(`/userbooks/progress${query}`);
  return response.data;
};

// Read one
export const getUserBook = async (id: number): Promise<UserBookDto> => {
  const response = await api.get<UserBookDto>(`/userbooks/${id}`);
  return response.data;
};

// Create
export const addUserBook = async (data: LibraryAddRequestDto): Promise<number> => {
  const response = await api.post<number>('/userbooks', data);
  return response.data;
};

// Update (full)
export const updateUserBook = async (id: number, data: Partial<UserBookDto>): Promise<void> => {
  await api.put(`/userbooks/${id}`, data);
};

// Update (partial)
export const patchUserBook = async (id: number, data: Partial<UserBookDto>): Promise<void> => {
  await api.patch(`/userbooks/${id}`, data);
};

// Delete
export const deleteUserBook = async (id: number): Promise<void> => {
  await api.delete(`/userbooks/${id}`);
};

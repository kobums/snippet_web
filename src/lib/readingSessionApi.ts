import { ReadingSessionDto, StreakDto } from '@/types/readingSession';
import api from './api';

export const getAllSessions = async (): Promise<ReadingSessionDto[]> => {
  const response = await api.get<ReadingSessionDto[]>('/readingsessions');
  return response.data;
};

export const getSessionsByBook = async (userBookId: number): Promise<ReadingSessionDto[]> => {
  const response = await api.get<ReadingSessionDto[]>('/readingsessions/bybook', {
    params: { userBookId },
  });
  return response.data;
};

export interface AddSessionRequest {
  userBookId: number;
  durationSeconds: number;
  startPage: number;
  endPage: number;
  sessionDate: string;
}

export const addSession = async (data: AddSessionRequest): Promise<void> => {
  await api.post('/readingsessions', data);
};

export const getStreak = async (): Promise<StreakDto> => {
  const response = await api.get<StreakDto>('/readingsessions/streak');
  return response.data;
};

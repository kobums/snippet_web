import { ReadingSessionDto } from '@/types/readingSession';
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

import { StatsDto } from '../types/stats';
import api from './api';

export const getUserStats = async (): Promise<StatsDto> => {
  const response = await api.get<StatsDto>('/library/stats');
  return response.data;
};

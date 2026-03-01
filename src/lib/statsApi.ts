import { StatsDto } from '../types/stats';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008/api';

const statsApi = axios.create({
  baseURL: `${API_URL}/library/stats`,
});

export const getUserStats = async (): Promise<StatsDto> => {
  const response = await statsApi.get<StatsDto>('');
  return response.data;
};

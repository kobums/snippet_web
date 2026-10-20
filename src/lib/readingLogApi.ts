import api from './api';
import type { DailyPagesDto } from '@/types/stats';

// 페이지 변경 기록(직접 수정, 타이머, 완독 처리 포함) 기준 일별 읽은 페이지.
// 읽은 페이지가 있는 날만 내려오므로 빈 날짜는 클라이언트에서 0으로 채운다.
export const getDailyPages = async (year: number, month: number): Promise<DailyPagesDto[]> => {
  const response = await api.get<DailyPagesDto[]>('/readinglogs/daily', {
    params: { year, month },
  });
  return response.data;
};

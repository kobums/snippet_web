/**
 * 전역 유틸리티 함수 모음
 */

/**
 * 날짜 문자열을 "YYYY-MM-DD" 형식으로 포맷
 * @example formatDate("2026-03-05T00:00:00") → "2026-03-05"
 */
export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 읽기 진행률(%) 계산
 * @example calcProgress(30, 100) → 30
 */
export const calcProgress = (readPage: number, totalPage: number): number => {
  if (!totalPage || totalPage <= 0) return 0;
  return Math.min(Math.round((readPage / totalPage) * 100), 100);
};

/**
 * 문자열을 지정한 길이로 자르고 "..." 추가
 * @example truncate("긴 제목의 책", 6) → "긴 제목..."
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * 숫자에 천 단위 구분자 추가
 * @example formatNumber(12345) → "12,345"
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

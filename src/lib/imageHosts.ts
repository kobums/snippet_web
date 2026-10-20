/**
 * next/image 최적화(/_next/image)를 허용할 도서 표지 호스트.
 * 와일드카드(**)로 두면 이미지 최적화 서버가 임의 URL을 대신 가져오는 오픈 프록시가 된다.
 *
 * 표지 출처 (snippet_back 기준):
 * - 알라딘 API / 크롤러 `cover` → image.aladin.co.kr (http·https 혼재)
 * - 도서관 정보나루 인기대출 `bookImageURL` → 대부분 알라딘, 일부 네이버·예스24·교보 CDN
 * - 국립중앙도서관 `TITLE_URL` → nl.go.kr 계열
 * 목록에 없는 호스트는 컴포넌트에서 unoptimized(브라우저 직접 로드)로 처리한다.
 */
export const COVER_IMAGE_HOSTS = [
  'image.aladin.co.kr',
  'bookthumb-phinf.pstatic.net',
  'shopping-phinf.pstatic.net',
  'image.yes24.com',
  'contents.kyobobook.co.kr',
  'www.nl.go.kr',
  'seoji.nl.go.kr',
] as const;

/** next/image 최적화 대상 호스트인지 (아니면 unoptimized로 렌더) */
export function isOptimizableCover(src: string): boolean {
  try {
    const { protocol, hostname } = new URL(src);
    return (protocol === 'https:' || protocol === 'http:')
      && (COVER_IMAGE_HOSTS as readonly string[]).includes(hostname);
  } catch {
    return false;
  }
}

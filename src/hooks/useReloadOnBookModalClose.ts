import { useEffect, useRef } from 'react';
import { useUIStore } from '@/stores/useUIStore';

/**
 * 서재 하위 페이지(소장/대출/위시/대기/읽는 중/완독)는 목록을 페이지 로컬 state로 들고 있어
 * 기록 모달에서 바꾼 상태·진도가 스토어에만 반영되고 목록엔 남지 않았다.
 * 모달이 닫히는 순간(selectedBook: 있음 → null) 목록을 다시 불러온다.
 */
export function useReloadOnBookModalClose(reload: () => void) {
  const selectedBook = useUIStore(s => s.selectedBook);
  const wasOpen = useRef(false);
  const reloadRef = useRef(reload);
  useEffect(() => {
    reloadRef.current = reload;
  }, [reload]);

  useEffect(() => {
    if (selectedBook) {
      wasOpen.current = true;
    } else if (wasOpen.current) {
      wasOpen.current = false;
      reloadRef.current();
    }
  }, [selectedBook]);
}

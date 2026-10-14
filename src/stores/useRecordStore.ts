import { create } from 'zustand';

/**
 * 기록(스니펫/일기/리뷰) 변경 신호.
 *
 * 대시보드 패널·기록 페이지·책 상세 모달이 각자 목록을 들고 있어서, 한 곳에서 기록을
 * 추가/수정/삭제해도 다른 목록은 새로고침 전까지 옛 상태였다. 변경이 끝나면 bump()를
 * 호출하고, 목록 쪽은 version을 useEffect 의존성에 넣어 다시 조회한다.
 */
interface RecordStore {
  version: number;
  bump: () => void;
}

export const useRecordStore = create<RecordStore>((set) => ({
  version: 0,
  bump: () => set(s => ({ version: s.version + 1 })),
}));

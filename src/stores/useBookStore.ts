import { create } from 'zustand';
import toast from 'react-hot-toast';
import { UserBookDto } from '@/types/library';
import { getMonthlyUserBooks, getProgressBooks, patchUserBook } from '@/lib/userBookApi';
import { handleApiError } from '@/lib/errorHandler';
import { useUIStore } from '@/stores/useUIStore';

// 임시 ID 생성 유틸리티 (서버 응답 전까지 사용할 임시 ID - 음수 사용)
let tempIdCounter = -1;
const generateTempId = () => tempIdCounter--;

// 책 한 권의 변경을 books / progressBooks / (열려 있는) 기록 모달의 selectedBook 에 동시에 반영한다.
// 모달은 클릭 시점 스냅샷(useUIStore.selectedBook)을 들고 있으므로 여기서 같이 갱신하지 않으면
// 모달이 옛값과 비교·표시해서 "변경이 안 된 것처럼" 보인다.
type Patch = Partial<UserBookDto> | ((b: UserBookDto) => Partial<UserBookDto>);
const resolvePatch = (b: UserBookDto, patch: Patch) => (typeof patch === 'function' ? patch(b) : patch);

interface BookStore {
  books: UserBookDto[];
  progressBooks: UserBookDto[];
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;

  loadDashboard: (year?: number, month?: number) => Promise<void>;
  loadProgress: (year?: number, month?: number) => Promise<void>;
  setSelectedMonth: (year: number, month: number) => void;
  updateStatus: (id: number, status: UserBookDto['status'], e?: React.MouseEvent, rating?: number | null) => Promise<void>;
  updateProgress: (id: number, page: number, e?: React.MouseEvent) => Promise<void>;
  updateType: (id: number, type: UserBookDto['type'], e?: React.MouseEvent) => Promise<void>;
  updateStartDate: (id: number, date: string) => Promise<void>;
  updateEndDate: (id: number, date: string) => Promise<void>;
  updateBookLocally: (id: number, updates: Partial<UserBookDto>) => void;
  /** books / progressBooks / 열려 있는 모달의 selectedBook 을 한 번에 갱신 */
  applyBookPatch: (id: number, patch: Patch) => void;
  refreshBooks: () => Promise<void>;

  // 낙관적 업데이트 함수들
  addBookLocally: (book: Omit<UserBookDto, 'id'>) => number;
  removeBookLocally: (id: number) => void;
  updateBookId: (tempId: number, realId: number) => void;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  progressBooks: [],
  loading: true,
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,

  loadDashboard: async (year?: number, month?: number) => {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth() + 1;
    set({ loading: true, selectedYear: y, selectedMonth: m });
    try {
      const [books, progressBooks] = await Promise.all([
        getMonthlyUserBooks(y, m),
        getProgressBooks(y, m),
      ]);
      set({ books, progressBooks });
    } catch (e) {
      handleApiError(e, '대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      set({ loading: false });
    }
  },

  loadProgress: async (year?: number, month?: number) => {
    const { selectedYear, selectedMonth } = get();
    const y = year ?? selectedYear;
    const m = month ?? selectedMonth;
    try {
      const progressBooks = await getProgressBooks(y, m);
      set({ progressBooks });
    } catch (e) {
      handleApiError(e, '진행 중인 책 목록을 불러오는데 실패했습니다.');
    }
  },

  setSelectedMonth: (year: number, month: number) => {
    get().loadDashboard(year, month);
    get().loadProgress(year, month);
  },

  updateStatus: async (id, status, e?, rating?) => {
    e?.stopPropagation();
    const statusMessages: Record<string, string> = {
      completed: '완독 처리되었습니다!',
      dropped: '중단 처리되었습니다.',
      reading: '읽기를 시작했습니다!',
      waiting: '대기 목록에 추가했습니다.',
    };
    try {
      if (status === 'completed' || status === 'dropped') {
        const todayStr = new Date().toISOString();
        const body: Partial<UserBookDto> = { status };
        if (rating != null) body.rating = rating;
        await patchUserBook(id, body);
        get().applyBookPatch(id, b => ({
          status,
          endDate: b.status === status && b.endDate ? b.endDate : todayStr,
          ...(status === 'completed' ? { readPage: b.totalPage || b.readPage } : {}),
          ...(rating != null ? { rating } : {}),
        }));
      } else {
        await patchUserBook(id, { status });
        const updates: Partial<UserBookDto> = { status };
        if (status === 'reading') {
          // 독서 시작 시 startDate만 설정 (endDate는 완독/중단 시에만 의미가 있으므로 건드리지 않음)
          updates.startDate = new Date().toISOString();
        }
        get().applyBookPatch(id, updates);
      }
      toast.success(statusMessages[status] ?? '업데이트되었습니다.');
    } catch (e) {
      handleApiError(e, '상태 변경에 실패했습니다.', 'alert');
    }
  },

  updateProgress: async (id, page, e?) => {
    e?.stopPropagation();
    try {
      await patchUserBook(id, { readPage: page });
      get().applyBookPatch(id, { readPage: page });
      toast.success(`${page}p까지 읽은 것으로 저장했습니다.`);
    } catch (e) {
      handleApiError(e, '진도 업데이트에 실패했습니다.', 'alert');
    }
  },

  updateType: async (id, type, e?) => {
    e?.stopPropagation();
    const typeMessages: Record<string, string> = {
      wish: '위시리스트로 옮겼습니다.',
      have: '소장 도서로 변경했습니다.',
      borrow: '대출 중으로 변경했습니다.',
      return: '반납 처리했습니다.',
    };
    try {
      await patchUserBook(id, { type });
      // 백엔드와 동일하게 wish 전환 시 status는 none 으로 강제
      get().applyBookPatch(id, type === 'wish' ? { type, status: 'none' } : { type });
      toast.success(typeMessages[type] ?? '분류를 변경했습니다.');
    } catch (e) {
      handleApiError(e, '분류 변경에 실패했습니다.', 'alert');
    }
  },

  updateStartDate: async (id, date) => {
    try {
      await patchUserBook(id, { startDate: date });
      get().applyBookPatch(id, { startDate: date });
      toast.success('시작일을 변경했습니다.');
    } catch (e) {
      handleApiError(e, '시작일 변경에 실패했습니다.', 'alert');
    }
  },

  updateEndDate: async (id, date) => {
    try {
      await patchUserBook(id, { endDate: date });
      get().applyBookPatch(id, { endDate: date });
      toast.success('종료일을 변경했습니다.');
    } catch (e) {
      handleApiError(e, '종료일 변경에 실패했습니다.', 'alert');
    }
  },

  updateBookLocally: (id, updates) => {
    get().applyBookPatch(id, updates);
  },

  applyBookPatch: (id, patch) => {
    const apply = (b: UserBookDto) => (b.id === id ? { ...b, ...resolvePatch(b, patch) } : b);
    set(s => ({
      books: s.books.map(apply),
      progressBooks: s.progressBooks.map(apply),
    }));
    // 열려 있는 기록 모달의 스냅샷도 같이 갱신
    const selected = useUIStore.getState().selectedBook;
    if (selected && selected.id === id) {
      useUIStore.getState().updateSelectedBook(resolvePatch(selected, patch));
    }
  },

  refreshBooks: async () => {
    try {
      const { selectedYear, selectedMonth } = get();
      const books = await getMonthlyUserBooks(selectedYear, selectedMonth);
      set({ books });
    } catch (e) {
      handleApiError(e, '책 목록을 불러오는데 실패했습니다.');
    }
  },

  // 낙관적 업데이트 함수들
  addBookLocally: (book) => {
    const tempId = generateTempId();
    const newBook = { ...book, id: tempId };
    const inProgress = book.status === 'waiting' || book.status === 'reading';
    set(s => ({
      books: [newBook, ...s.books],
      progressBooks: inProgress ? [newBook, ...s.progressBooks] : s.progressBooks,
    }));
    return tempId;
  },

  removeBookLocally: (id) => {
    set(s => ({
      books: s.books.filter(b => b.id !== id),
      progressBooks: s.progressBooks.filter(b => b.id !== id),
    }));
  },

  updateBookId: (tempId, realId) => {
    set(s => ({
      books: s.books.map(b => b.id === tempId ? { ...b, id: realId } : b),
      progressBooks: s.progressBooks.map(b => b.id === tempId ? { ...b, id: realId } : b),
    }));
  },
}));

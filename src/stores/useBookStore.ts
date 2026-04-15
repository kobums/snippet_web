import { create } from 'zustand';
import toast from 'react-hot-toast';
import { UserBookDto } from '@/types/library';
import { getMonthlyUserBooks, getProgressBooks, patchUserBook } from '@/lib/userBookApi';
import { handleApiError } from '@/lib/errorHandler';

// 임시 ID 생성 유틸리티 (서버 응답 전까지 사용할 임시 ID - 음수 사용)
let tempIdCounter = -1;
const generateTempId = () => tempIdCounter--;

interface BookStore {
  books: UserBookDto[];
  progressBooks: UserBookDto[];
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;

  loadDashboard: (year?: number, month?: number) => Promise<void>;
  loadProgress: (year?: number, month?: number) => Promise<void>;
  setSelectedMonth: (year: number, month: number) => void;
  updateStatus: (id: number, status: UserBookDto['status'], e?: React.MouseEvent) => Promise<void>;
  updateProgress: (id: number, page: number, e?: React.MouseEvent) => Promise<void>;
  updateType: (id: number, type: UserBookDto['type'], e?: React.MouseEvent) => Promise<void>;
  updateStartDate: (id: number, date: string) => Promise<void>;
  updateEndDate: (id: number, date: string) => Promise<void>;
  updateBookLocally: (id: number, updates: Partial<UserBookDto>) => void;
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

  updateStatus: async (id, status, e?) => {
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
        // 완독 시 진도율 업데이트는 백엔드 LibraryService.java 에서 일괄 처리되므로 호출 생략
        await patchUserBook(id, { status });
        const applyUpdate = (b: UserBookDto) =>
          b.id === id
            ? { ...b, status, endDate: todayStr, ...(status === 'completed' ? { readPage: b.totalPage || b.readPage } : {}) }
            : b;
        set(s => ({
          books: s.books.map(applyUpdate),
          progressBooks: s.progressBooks.map(applyUpdate),
        }));
      } else {
        await patchUserBook(id, { status });
        const updates: Partial<UserBookDto> = { status };
        if (status === 'reading') {
          updates.startDate = new Date().toISOString();
          updates.endDate = new Date().toISOString();
        }
        set(s => ({
          books: s.books.map(b => b.id === id ? { ...b, ...updates } : b),
          progressBooks: s.progressBooks.map(b => b.id === id ? { ...b, ...updates } : b),
        }));
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
      set(s => ({
        books: s.books.map(b => b.id === id ? { ...b, readPage: page } : b),
        progressBooks: s.progressBooks.map(b => b.id === id ? { ...b, readPage: page } : b),
      }));
    } catch (e) {
      handleApiError(e, '진도 업데이트에 실패했습니다.');
    }
  },

  updateType: async (id, type, e?) => {
    e?.stopPropagation();
    try {
      await patchUserBook(id, { type });
      set(s => ({
        books: s.books.map(b => b.id === id ? { ...b, type } : b),
        progressBooks: s.progressBooks.map(b => b.id === id ? { ...b, type } : b),
      }));
    } catch (e) {
      handleApiError(e, '분류 변경에 실패했습니다.', 'alert');
    }
  },

  updateStartDate: async (id, date) => {
    try {
      await patchUserBook(id, { startDate: date });
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, startDate: date } : b) }));
    } catch (e) {
      handleApiError(e, '시작일 변경에 실패했습니다.', 'alert');
    }
  },

  updateEndDate: async (id, date) => {
    try {
      await patchUserBook(id, { endDate: date });
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, endDate: date } : b) }));
    } catch (e) {
      handleApiError(e, '종료일 변경에 실패했습니다.', 'alert');
    }
  },

  updateBookLocally: (id, updates) => {
    set(s => ({ books: s.books.map(b => b.id === id ? { ...b, ...updates } : b) }));
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

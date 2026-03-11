import { create } from 'zustand';
import { UserBookDto } from '@/types/library';
import { getMonthlyUserBooks, patchUserBook } from '@/lib/userBookApi';
import { handleApiError } from '@/lib/errorHandler';

interface BookStore {
  books: UserBookDto[];
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;

  loadDashboard: (year?: number, month?: number) => Promise<void>;
  setSelectedMonth: (year: number, month: number) => void;
  updateStatus: (id: number, status: UserBookDto['status'], e?: React.MouseEvent) => Promise<void>;
  updateProgress: (id: number, page: number, e?: React.MouseEvent) => Promise<void>;
  updateType: (id: number, type: UserBookDto['type'], e?: React.MouseEvent) => Promise<void>;
  updateStartDate: (id: number, date: string) => Promise<void>;
  updateEndDate: (id: number, date: string) => Promise<void>;
  updateBookLocally: (id: number, updates: Partial<UserBookDto>) => void;
  refreshBooks: () => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  loading: true,
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,

  loadDashboard: async (year?: number, month?: number) => {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth() + 1;
    set({ loading: true, selectedYear: y, selectedMonth: m });
    try {
      const books = await getMonthlyUserBooks(y, m);
      set({ books });
    } catch (e) {
      handleApiError(e, '대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      set({ loading: false });
    }
  },

  setSelectedMonth: (year: number, month: number) => {
    get().loadDashboard(year, month);
  },

  updateStatus: async (id, status, e?) => {
    e?.stopPropagation();
    try {
      if (status === 'completed' || status === 'dropped') {
        const book = get().books.find(b => b.id === id);
        const todayStr = new Date().toISOString();
        
        const promises: Promise<void>[] = [
          patchUserBook(id, { status }),
        ];

        // 완독 시 진도율 업데이트는 백엔드 LibraryService.java 에서 일괄 처리되므로 호출 생략
        await Promise.all(promises);
        
        set(s => ({
          books: s.books.map(b => b.id === id
            ? { 
                ...b, 
                status, 
                endDate: todayStr, 
                ...(status === 'completed' ? { readPage: b.totalPage || b.readPage } : {})
              }
            : b),
        }));
      } else {
        await patchUserBook(id, { status });
        set(s => ({ books: s.books.map(b => b.id === id ? { ...b, status } : b) }));
      }
    } catch (e) {
      handleApiError(e, '상태 변경에 실패했습니다.', 'alert');
    }
  },

  updateProgress: async (id, page, e?) => {
    e?.stopPropagation();
    try {
      await patchUserBook(id, { readPage: page });
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, readPage: page } : b) }));
    } catch (e) {
      handleApiError(e, '진도 업데이트에 실패했습니다.');
    }
  },

  updateType: async (id, type, e?) => {
    e?.stopPropagation();
    try {
      await patchUserBook(id, { type });
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, type } : b) }));
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
}));

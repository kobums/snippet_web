import { create } from 'zustand';
import { UserBookDto } from '@/types/library';
import { StatsDto } from '@/types/stats';
import {
  getUserBooks,
  updateBookStatus,
  updateBookProgress,
  updateBookType,
  updateBookStartDate,
  updateBookEndDate,
} from '@/lib/libraryApi';
import { getUserStats } from '@/lib/statsApi';
import { handleApiError } from '@/lib/errorHandler';

interface BookStore {
  books: UserBookDto[];
  stats: StatsDto | null;
  loading: boolean;

  loadDashboard: () => Promise<void>;
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
  stats: null,
  loading: true,

  loadDashboard: async () => {
    set({ loading: true });
    try {
      const [books, stats] = await Promise.all([getUserBooks(), getUserStats()]);
      set({ books, stats });
    } catch (e) {
      handleApiError(e, '대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      set({ loading: false });
    }
  },

  updateStatus: async (id, status, e?) => {
    e?.stopPropagation();
    try {
      if (status === 'completed') {
        const book = get().books.find(b => b.id === id);
        const todayStr = new Date().toISOString().split('T')[0];
        const promises: Promise<void>[] = [
          updateBookStatus(id, status),
          updateBookEndDate(id, todayStr),
        ];
        if (book?.totalPage) promises.push(updateBookProgress(id, book.totalPage));
        await Promise.all(promises);
        set(s => ({
          books: s.books.map(b => b.id === id
            ? { ...b, status, endDate: todayStr, readPage: b.totalPage || b.readPage }
            : b),
        }));
      } else {
        await updateBookStatus(id, status);
        set(s => ({ books: s.books.map(b => b.id === id ? { ...b, status } : b) }));
      }
    } catch (e) {
      handleApiError(e, '상태 변경에 실패했습니다.', 'alert');
    }
  },

  updateProgress: async (id, page, e?) => {
    e?.stopPropagation();
    try {
      await updateBookProgress(id, page);
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, readPage: page } : b) }));
    } catch (e) {
      handleApiError(e, '진도 업데이트에 실패했습니다.');
    }
  },

  updateType: async (id, type, e?) => {
    e?.stopPropagation();
    try {
      await updateBookType(id, type);
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, type } : b) }));
    } catch (e) {
      handleApiError(e, '분류 변경에 실패했습니다.', 'alert');
    }
  },

  updateStartDate: async (id, date) => {
    try {
      await updateBookStartDate(id, date);
      set(s => ({ books: s.books.map(b => b.id === id ? { ...b, startDate: date } : b) }));
    } catch (e) {
      handleApiError(e, '시작일 변경에 실패했습니다.', 'alert');
    }
  },

  updateEndDate: async (id, date) => {
    try {
      await updateBookEndDate(id, date);
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
      const books = await getUserBooks();
      set({ books });
    } catch (e) {
      handleApiError(e, '책 목록을 불러오는데 실패했습니다.');
    }
  },
}));

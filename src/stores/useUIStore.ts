import { create } from 'zustand';
import { UserBookDto } from '@/types/library';

interface SearchModalConfig {
  allowedActions?: ('wish' | 'have' | 'borrow')[];
  defaultStatus?: 'waiting' | 'reading' | 'completed' | 'dropped';
}

interface UIStore {
  // Book Record Modal
  selectedBook: UserBookDto | null;
  openBookRecord: (book: UserBookDto) => void;
  closeBookRecord: () => void;
  updateSelectedBook: (updates: Partial<UserBookDto>) => void;

  // Book Search Modal
  isSearchModalOpen: boolean;
  searchModalConfig: SearchModalConfig;
  openSearchModal: (config?: SearchModalConfig) => void;
  closeSearchModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedBook: null,
  openBookRecord: (book) => set({ selectedBook: book }),
  closeBookRecord: () => set({ selectedBook: null }),
  updateSelectedBook: (updates) => set(s => ({
    selectedBook: s.selectedBook ? { ...s.selectedBook, ...updates } : null,
  })),

  isSearchModalOpen: false,
  searchModalConfig: {},
  openSearchModal: (config = {}) => set({
    isSearchModalOpen: true,
    searchModalConfig: config,
  }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
}));

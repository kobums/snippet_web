export interface BookSearchDto {
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  isbn: string;
  coverUrl: string;
  totalPage: number | null;
}

export interface LibraryAddRequestDto {
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  isbn: string;
  coverUrl: string;
  totalPage: number | null;
  /** wish: 위시리스트, have: 소장, borrow: 대여 중, return: 반납 완료 */
  type: 'wish' | 'have' | 'borrow' | 'return';
  /** none: 위시 전용 | waiting/reading/completed/dropped: have or borrow */
  status: 'none' | 'waiting' | 'reading' | 'completed' | 'dropped';
  startDate?: string;
  endDate?: string;
}

export interface UserBookDto {
  id: number;
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  /** wish: 위시리스트, have: 소장, borrow: 대여 중, return: 반납 완료 */
  type: 'wish' | 'have' | 'borrow' | 'return';
  /** none: 위시 전용 | waiting/reading/completed/dropped: have or borrow */
  status: 'none' | 'waiting' | 'reading' | 'completed' | 'dropped';
  readPage: number;
  totalPage: number;
  createDate: string;
  startDate: string;
  endDate: string;
}

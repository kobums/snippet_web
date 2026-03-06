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
  type: 'wish' | 'borrow' | 'have';
  status: 'waiting' | 'reading' | 'completed' | 'dropped';
  startDate?: string;
  endDate?: string;
}

export interface UserBookDto {
  id: number;
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  type: 'wish' | 'borrow' | 'have';
  status: 'waiting' | 'reading' | 'completed' | 'dropped';
  readPage: number;
  totalPage: number;
  createDate: string;
  startDate: string;
  endDate: string;
}

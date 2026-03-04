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
  status: 'wish' | 'reading' | 'waiting';
}

export interface UserBookDto {
  id: number;
  bookId: number;
  title: string;
  author: string;
  coverUrl: string;
  status: 'wish' | 'reading' | 'waiting' | 'completed' | 'dropped';
  readPage: number;
  totalPage: number;
  createDate: string;
}

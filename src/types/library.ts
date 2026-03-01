export interface BookSearchDto {
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  isbn: string;
  coverUrl: string;
}

export interface LibraryAddRequestDto {
  title: string;
  author: string;
  publisher: string;
  pubDate: string;
  isbn: string;
  coverUrl: string;
  status: 'wish' | 'reading' | 'waiting';
}

export interface UserBookDto {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  status: 'wish' | 'reading' | 'waiting' | 'completed' | 'dropped';
  readPage: number;
  totalPage: number;
}

export interface ReadingSessionDto {
  id: number;
  userBookId: number;
  bookId: number;
  bookTitle: string;
  bookCoverUrl: string;
  durationSeconds: number;
  startPage: number;
  endPage: number;
  pagesRead: number;
  secondsPerPage: number;
  sessionDate: string;
  createDate: string;
}

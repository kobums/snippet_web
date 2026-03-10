export interface RecordDto {
  id: number;
  bookId: number;
  bookTitle: string;
  type: 'snippet' | 'diary' | 'review';
  text: string;
  tag?: string;
  relatedPage?: number;
  createDate: string;
}

export interface RecordAddRequestDto {
  type: 'snippet' | 'diary' | 'review';
  text: string;
  tag?: string;
  relatedPage?: number;
}

export interface RecordDto {
  id: number;
  bookId: number;
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

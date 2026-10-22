export interface RecordDto {
  id: number;
  bookId: number;
  bookTitle: string;
  type: 'snippet' | 'diary' | 'review';
  text: string;
  tag?: string;
  relatedPage?: number;
  createDate: string;
  isPublic?: boolean; // 스와이프 카드 공개 (snippet 만)
}

export interface RecordAddRequestDto {
  type: 'snippet' | 'diary' | 'review';
  text: string;
  tag?: string;
  relatedPage?: number;
  isPublic?: boolean;
}

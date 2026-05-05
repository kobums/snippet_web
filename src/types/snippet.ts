export interface SnippetCard {
  id: number;
  text: string;
  tag: string;
  bookTitle: string;
}

export interface SnippetCardsResponse {
  cards: SnippetCard[];
  remainingToday: number; // -1 = 비로그인(무제한)
}

export interface SnippetArchive {
  id: number;
  text: string;
  tag: string;
  bookTitle: string;
  bookAuthor: string;
  coverUrl: string;
  affiliateUrl: string;
}

export type SwipeDirection = "LEFT" | "RIGHT";

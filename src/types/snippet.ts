export interface SnippetCard {
  id: number;
  text: string;
  tag: string;
  bookTitle: string;
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

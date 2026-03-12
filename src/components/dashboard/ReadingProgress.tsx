"use client"

import { UserBookDto } from '@/types/library';
import BookRecordPanel from './BookRecordPanel';
import YearStatistics from './YearStatistics';
import ReadingManager from './ReadingManager';

interface ReadingProgressProps {
  books: UserBookDto[];
  loading: boolean;
}

export default function ReadingProgress({ books, loading }: ReadingProgressProps) {
  return (
    <div className="w-full lg:w-2/4 flex flex-col gap-6 lg:overflow-y-auto hide-scrollbar flex-1 relative">
      <ReadingManager books={books} loading={loading} />
      <BookRecordPanel books={books} />
      <YearStatistics books={books} />
    </div>
  );
}

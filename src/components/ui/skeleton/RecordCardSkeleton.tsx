"use client"

interface RecordCardSkeletonProps {
  count?: number;
}

export default function RecordCardSkeleton({ count = 3 }: RecordCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 rounded-2xl px-3 sm:px-3.5 py-2.5 sm:py-3 shadow-sm">
          {/* 헤더 */}
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <div className="w-3.5 h-3.5 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 dark:bg-white/10 rounded animate-pulse ml-auto" />
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-100 dark:border-white/8 pt-2 flex flex-col gap-1.5">
            {/* 책 제목 */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
            </div>

            {/* 페이지 */}
            <div className="h-3 w-12 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />

            {/* 본문 */}
            <div className="h-3 w-full bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client"

interface CompletedBookCardSkeletonProps {
  count?: number;
}

export default function CompletedBookCardSkeleton({ count = 3 }: CompletedBookCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white/60 border border-white/60 dark:bg-white/5 dark:border-white/8 rounded-2xl overflow-hidden shadow-sm">
          {/* 커버 영역 */}
          <div className="w-full h-[180px] sm:h-[200px] bg-gray-50 dark:bg-white/5 flex items-center justify-center p-3 sm:p-4">
            <div className="w-24 h-36 bg-gray-100 dark:bg-white/10 rounded-md animate-pulse" />
          </div>

          {/* 정보 영역 */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-1.5">
            {/* 제목 */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
            </div>

            {/* 저자 */}
            <div className="h-3 w-1/2 bg-gray-100 dark:bg-white/10 rounded animate-pulse pl-5" />

            {/* 날짜 */}
            <div className="flex items-center gap-1.5 pl-5 mt-1">
              <div className="w-3.5 h-3.5 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

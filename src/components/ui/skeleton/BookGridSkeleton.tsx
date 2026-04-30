"use client"

interface BookGridSkeletonProps {
  count?: number;
}

export default function BookGridSkeleton({ count = 6 }: BookGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="liquid-panel p-3">
          {/* 커버 */}
          <div className="w-full aspect-[2/3] rounded-lg bg-gray-100 dark:bg-white/10 animate-pulse mb-3" />

          {/* 제목 */}
          <div className="h-4 w-3/4 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />

          {/* 저자 */}
          <div className="h-3 w-1/2 bg-gray-100 dark:bg-white/10 rounded animate-pulse mt-1" />

          {/* 상태 + 진행률 */}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-5 w-16 bg-gray-100 dark:bg-white/10 rounded-md animate-pulse" />
            <div className="h-3 w-8 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

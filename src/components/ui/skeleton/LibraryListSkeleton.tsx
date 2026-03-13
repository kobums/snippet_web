"use client"

interface LibraryListSkeletonProps {
  count?: number;
}

export default function LibraryListSkeleton({ count = 3 }: LibraryListSkeletonProps) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-gray-200 shadow-sm"
        >
          {/* 아이콘/커버 */}
          <div className="w-7 h-7 sm:w-8 sm:h-11 rounded bg-gray-100 animate-pulse shrink-0" />
          {/* 제목 */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            {/* 프로그레스 바 (optional) */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-8 bg-gray-100 rounded animate-pulse shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

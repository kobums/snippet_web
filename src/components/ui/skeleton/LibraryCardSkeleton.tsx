"use client"

interface LibraryCardSkeletonProps {
  count?: number;
}

export default function LibraryCardSkeleton({ count = 2 }: LibraryCardSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/60 border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
        >
          {/* 커버 영역 */}
          <div className="w-full flex justify-center py-4 px-6 bg-gray-50/50">
            <div className="h-36 w-24 bg-gray-100 rounded-md animate-pulse" />
          </div>
          {/* 정보 영역 */}
          <div className="px-4 py-3 space-y-2">
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="flex items-center gap-2 pt-1">
              <div className="h-5 w-16 bg-gray-100 rounded-md animate-pulse" />
              <div className="h-5 w-16 bg-gray-100 rounded-md animate-pulse ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

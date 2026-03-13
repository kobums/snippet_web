"use client"

interface SearchResultSkeletonProps {
  count?: number;
}

export default function SearchResultSkeleton({ count = 3 }: SearchResultSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
          {/* 커버 */}
          <div className="w-16 h-24 bg-gray-100 rounded-lg animate-pulse shrink-0" />

          <div className="flex-1 flex flex-col min-w-0">
            {/* 제목 */}
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />

            {/* 저자 */}
            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse mt-2" />

            {/* 출판사 */}
            <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse mt-1" />

            {/* 버튼 영역 */}
            <div className="mt-auto pt-2 flex gap-2">
              <div className="flex-1 h-8 bg-gray-100 rounded-lg animate-pulse" />
              <div className="flex-1 h-8 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

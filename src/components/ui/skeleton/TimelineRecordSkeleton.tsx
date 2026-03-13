"use client"

interface TimelineRecordSkeletonProps {
  count?: number;
}

export default function TimelineRecordSkeleton({ count = 3 }: TimelineRecordSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative pl-12 pr-4">
          {/* 타임라인 점 */}
          <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full bg-gray-200 border-4 border-white z-10 animate-pulse" />

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            {/* 헤더 */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-12 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* 본문 */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* 태그 (선택적) */}
            {i % 2 === 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="h-6 w-20 bg-gray-100 rounded-md animate-pulse" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

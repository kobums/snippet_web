"use client"

export default function SwipeCardSkeleton() {
  return (
    <div className="relative w-full h-[380px] sm:h-[420px] md:h-[460px] flex items-center justify-center">
      <div className="absolute w-[320px] min-h-[360px] sm:w-[350px] sm:min-h-[380px] md:w-[400px] md:min-h-[420px]">
        <div className="liquid-panel p-6 sm:p-8 flex flex-col items-center justify-center h-full">
          {/* 태그 */}
          <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse mb-6" />

          {/* 문장 (4줄) */}
          <div className="space-y-3 w-full">
            <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-5/6 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-4/5 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

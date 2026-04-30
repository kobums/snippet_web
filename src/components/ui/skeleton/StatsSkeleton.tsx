"use client"

export default function StatsSkeleton() {
  return (
    <>
      {/* 헤더 */}
      <div className="liquid-panel p-5 md:p-6 flex items-center justify-between mb-6">
        <div className="h-8 w-32 bg-gray-100 dark:bg-white/10 rounded-lg animate-pulse" />
        <div className="h-10 w-24 bg-gray-100 dark:bg-white/10 rounded-lg animate-pulse" />
      </div>

      {/* 통계 섹션들 */}
      <div className="space-y-6 md:space-y-8">
        {/* 섹션 1 */}
        <div className="liquid-panel p-5 space-y-4">
          <div className="h-6 w-40 bg-gray-100 dark:bg-white/10 rounded animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="liquid-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-16 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-2 bg-gray-50 dark:bg-white/8 rounded-full" />
                <div className="h-2 bg-gray-50 dark:bg-white/8 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* 섹션 2 */}
        <div className="liquid-panel p-5">
          <div className="h-6 w-32 bg-gray-100 dark:bg-white/10 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="liquid-card p-4 text-center">
                <div className="h-8 mx-auto w-8 bg-gray-100 dark:bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-3 w-16 mx-auto bg-gray-100 dark:bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-8 w-20 mx-auto bg-gray-100 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* 섹션 3 */}
        <div className="liquid-panel p-5">
          <div className="h-6 w-40 bg-gray-100 dark:bg-white/10 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse" />
            <div className="h-64 bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* 섹션 4 */}
        <div className="liquid-panel p-5">
          <div className="h-6 w-32 bg-gray-100 dark:bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-64 bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    </>
  );
}

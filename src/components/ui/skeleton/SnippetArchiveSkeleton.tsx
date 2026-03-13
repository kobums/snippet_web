"use client"

interface SnippetArchiveSkeletonProps {
  count?: number;
}

export default function SnippetArchiveSkeleton({ count = 3 }: SnippetArchiveSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="liquid-panel p-4 sm:p-6">
          {/* 태그 */}
          <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse mb-3" />

          {/* 문장 (3줄) */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-5/6 bg-gray-100 rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* 안내 텍스트 */}
          <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mt-3" />
        </div>
      ))}
    </>
  );
}

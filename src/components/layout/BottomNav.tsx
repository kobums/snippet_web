"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "스와이프", icon: "◇" },
  { href: "/archive", label: "보관함", icon: "♡" },
  { href: "/dashboard/stats", label: "통계", icon: "📊" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 liquid-nav">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center py-3 gap-1 transition-all duration-200 relative"
              style={{
                color: active
                  ? "var(--lg-accent)"
                  : "var(--lg-text-tertiary)",
              }}
            >
              {/* 활성 탭 인디케이터 */}
              {active && (
                <span
                  className="absolute -top-px left-1/4 right-1/4 h-0.5 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--lg-accent), transparent)",
                  }}
                />
              )}
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

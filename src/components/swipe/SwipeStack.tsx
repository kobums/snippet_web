"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "./SwipeCard";
import { SnippetCard, SwipeDirection } from "@/types/snippet";
import { fetchCards } from "@/lib/api";
import { useArchive } from "@/hooks/useArchive";
import { SwipeCardSkeleton } from "@/components/ui/skeleton";

export default function SwipeStack() {
  const [cards, setCards] = useState<SnippetCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);
  const { seenIds, addLiked, addSeen } = useArchive();

  const loadCards = useCallback(async (currentSeenIds: number[]) => {
    try {
      setLoading(true);
      const response = await fetchCards(5, currentSeenIds);
      setRemainingToday(response.remainingToday);
      setCards((prev) => [...response.cards.reverse(), ...prev]);
    } catch {
      console.error("카드 로딩 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards([]);
  }, []);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      const topCard = cards[cards.length - 1];
      if (!topCard) return;

      addSeen(topCard.id);
      if (direction === "RIGHT") {
        addLiked(topCard.id);
      }

      setCards((prev) => {
        const next = prev.slice(0, -1);
        if (next.length <= 2 && remainingToday !== 0) {
          fetchCards(5, [...seenIds, topCard.id])
            .then((res) => {
              setRemainingToday(res.remainingToday);
              setCards((cur) => [...res.cards.reverse(), ...cur]);
            })
            .catch(() => {});
        }
        return next;
      });
    },
    [cards, seenIds, remainingToday, addSeen, addLiked]
  );

  if (loading && cards.length === 0) {
    return <SwipeCardSkeleton />;
  }

  // 일일 한도 소진
  if (remainingToday === 0 && cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-6xl float-effect">🌙</div>
        <p
          className="text-lg font-semibold"
          style={{ color: "var(--lg-text-primary)" }}
        >
          오늘의 스니펫을 모두 읽었어요
        </p>
        <p className="text-sm text-center" style={{ color: "var(--lg-text-secondary)" }}>
          내일 다시 새로운 문장을 만나보세요
        </p>
        <p className="text-xs" style={{ color: "var(--lg-text-tertiary)" }}>
          하루 5문장 · 매일 자정 초기화
        </p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-6xl float-effect">📚</div>
        <p
          className="text-lg font-light"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          모든 문장을 확인했어요
        </p>
        <p className="text-sm" style={{ color: "var(--lg-text-tertiary)" }}>
          보관함에서 모은 문장을 확인해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] md:h-[460px] flex items-center justify-center">
      {remainingToday !== null && remainingToday !== -1 && (
        <p
          className="absolute top-0 text-xs"
          style={{ color: "var(--lg-text-tertiary)" }}
        >
          오늘 {remainingToday}문장 남음
        </p>
      )}
      <AnimatePresence>
        {cards.slice(-3).map((snippet, index, arr) => {
          const isTop = index === arr.length - 1;
          const scale = 1 - (arr.length - 1 - index) * 0.04;
          const translateY = (arr.length - 1 - index) * 12;

          return (
            <div
              key={snippet.id}
              className="absolute w-[320px] min-h-[360px] sm:w-[350px] sm:min-h-[380px] md:w-[400px] md:min-h-[420px] h-auto"
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                zIndex: index,
                opacity: isTop ? 1 : 0,
              }}
            >
              <SwipeCard
                snippet={snippet}
                onSwipe={handleSwipe}
                isTop={isTop}
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

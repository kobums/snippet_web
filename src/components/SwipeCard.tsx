"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { SnippetCard, SwipeDirection } from "@/types/snippet";

interface SwipeCardProps {
  snippet: SnippetCard;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 120;

export default function SwipeCard({ snippet, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    if (offsetX > SWIPE_THRESHOLD || velocityX > 500) {
      onSwipe("RIGHT");
    } else if (offsetX < -SWIPE_THRESHOLD || velocityX < -500) {
      onSwipe("LEFT");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        x,
        rotate,
        zIndex: isTop ? 10 : 0,
        pointerEvents: isTop ? "auto" : "none",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      {/* Like / Pass 오버레이 */}
      {isTop && (
        <>
          <motion.div
            className="absolute top-8 left-8 z-20 rounded-2xl px-5 py-2 font-bold text-xl -rotate-12"
            style={{
              opacity: likeOpacity,
              color: "var(--lg-like)",
              border: "3px solid var(--lg-like)",
              background: "rgba(52, 199, 89, 0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            LIKE
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 z-20 rounded-2xl px-5 py-2 font-bold text-xl rotate-12"
            style={{
              opacity: passOpacity,
              color: "var(--lg-pass)",
              border: "3px solid var(--lg-pass)",
              background: "rgba(255, 59, 48, 0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            PASS
          </motion.div>
        </>
      )}

      {/* Liquid Glass 카드 */}
      <div className="liquid-card w-[350px] h-[380px] md:w-[400px] md:h-[420px] flex flex-col justify-center items-center px-10 py-8 select-none">
        {/* 태그 뱃지 */}
        <span
          className="liquid-badge self-start mb-6 px-4 py-1.5 text-xs font-medium tracking-wide relative z-10"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          {snippet.tag}
        </span>

        {/* 문장 */}
        <div
          className="text-lg md:text-xl leading-relaxed font-light text-center flex-1 flex flex-col justify-center items-center relative z-10 w-full"
          style={{ color: "var(--lg-text-primary)" }}
        >
          <p>&ldquo;{snippet.text}&rdquo;</p>
          {snippet.bookTitle && (
            <span className="mt-5 text-sm md:text-base font-normal opacity-70">
              {snippet.bookTitle}
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div
          className="mt-6 w-12 h-0.5 rounded-full relative z-10"
          style={{ background: "rgba(0, 0, 0, 0.1)" }}
        />
      </div>
    </motion.div>
  );
}

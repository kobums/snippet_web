"use client"

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

export interface TabItem {
  label: string;
  icon?: string;
  content: ReactNode;
}

interface SwipeableTabsProps {
  tabs: TabItem[];
  className?: string;
}

export default function SwipeableTabs({ tabs, className = '' }: SwipeableTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(activeIndex - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < tabs.length - 1) {
      setDirection(1);
      setActiveIndex(activeIndex + 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Tab Headers */}
      <div className="flex items-center justify-start gap-2 mb-4 overflow-x-auto scrollbar-hide px-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium
              ${activeIndex === index
                ? 'liquid-button shadow-md'
                : 'bg-white/60 backdrop-blur-sm text-gray-600 dark:text-[#a0a0a0] hover:bg-white/80 border border-white/60'
              }
            `}
          >
            {tab.icon && <span className="text-sm">{tab.icon}</span>}
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Swipeable Content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 overflow-y-auto"
          >
            {tabs[activeIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4 pb-2">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > activeIndex ? 1 : -1);
              setActiveIndex(index);
            }}
            className={`
              h-2 rounded-full transition-all
              ${activeIndex === index ? 'w-8 bg-accent' : 'w-2 bg-gray-300'}
            `}
            aria-label={`Go to ${tabs[index].label}`}
          />
        ))}
      </div>
    </div>
  );
}

"use client"

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

const NAV_ITEMS = [
  { path: '/dashboard', label: '내 서재' },
  { path: '/snippet', label: '추천 문장 스와이프' },
];

const BOOK_NAV_ITEMS = [
  { path: '/books/have', label: '소장한 책' },
  { path: '/books/borrow', label: '빌린 책' },
  { path: '/books/wishlist', label: '갖고 싶은 책' },
];

const PROGRESS_NAV_ITEMS = [
  { path: '/books/reading', label: '읽는 중' },
  { path: '/books/waiting', label: '읽을 예정' },
  { path: '/books/completed', label: '완독' },
];

const RECORD_NAV_ITEMS = [
  { path: '/record/diary', label: '독서 일기' },
  { path: '/record/snippet', label: '밑줄 긋기' },
  { path: '/record/review', label: '독서 리뷰' },
];

export default function Sidebar({
  isOpen,
  onClose,
  currentPath,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}) {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const navigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    onClose();
    router.push('/login');
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 w-72 sm:w-80 h-full bg-white/95 backdrop-blur-2xl border-r border-gray-200 z-50 flex flex-col p-4 sm:p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 sm:mb-8 shrink-0">
              <h2 className="text-xl font-light tracking-widest text-gray-900 uppercase">snippet</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 lg:hidden">✕</button>
            </div>

            <nav className="flex flex-col gap-3 sm:gap-4 text-gray-700 flex-1 overflow-y-auto hide-scrollbar pb-4">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`py-2 px-3 sm:px-4 rounded-xl font-medium transition text-left text-sm sm:text-base ${isActive(item.path) ? 'bg-accent/15 text-accent' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-1" />
              <p className="px-3 sm:px-4 text-[10px] sm:text-[11px] text-gray-400 font-medium uppercase tracking-wider">내 책장</p>

              {BOOK_NAV_ITEMS.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`py-2 px-3 sm:px-4 rounded-xl font-medium transition text-left text-sm sm:text-base ${isActive(item.path) ? 'bg-accent/15 text-accent' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-1" />
              <p className="px-3 sm:px-4 text-[10px] sm:text-[11px] text-gray-400 font-medium uppercase tracking-wider">독서 진행</p>

              {PROGRESS_NAV_ITEMS.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`py-2 px-3 sm:px-4 rounded-xl font-medium transition text-left text-sm sm:text-base ${isActive(item.path) ? 'bg-accent/15 text-accent' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-1" />
              <p className="px-3 sm:px-4 text-[10px] sm:text-[11px] text-gray-400 font-medium uppercase tracking-wider">독서 기록</p>

              {RECORD_NAV_ITEMS.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`py-2 px-3 sm:px-4 rounded-xl font-medium transition text-left text-sm sm:text-base ${isActive(item.path) ? 'bg-accent/15 text-accent' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={() => navigate('/dashboard/stats')}
                className={`py-2 px-3 sm:px-4 rounded-xl font-medium transition text-left text-sm sm:text-base ${isActive('/dashboard/stats') ? 'bg-accent/15 text-accent' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                통계
              </button>
            </nav>

            <div className="mt-auto pt-6 sm:pt-8 border-t border-gray-200 flex flex-col gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => navigate('/mypage')}
                className="py-2 px-4 hover:bg-gray-100 rounded-xl transition text-left text-gray-700 font-medium text-sm sm:text-base"
              >
                내 정보
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-4 hover:bg-red-50 rounded-xl transition text-left text-red-500 font-medium text-sm sm:text-base"
              >
                로그아웃
              </button>
              <p className="text-xs text-gray-400 px-4 pt-2">v2.0 MVP</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

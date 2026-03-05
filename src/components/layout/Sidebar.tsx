"use client"

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Sidebar({
  isOpen,
  onClose,
  onNavigate,
  currentView
}: {
  isOpen: boolean,
  onClose: () => void,
  onNavigate: (view: 'swipe' | 'dashboard') => void,
  currentView: string
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    onClose();
    router.push('/login');
  };
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
            className="fixed top-0 left-0 w-64 h-full bg-white/95 backdrop-blur-2xl border-r border-gray-200 z-50 flex flex-col p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-light tracking-widest text-gray-900 uppercase">snippet</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 lg:hidden">✕</button>
            </div>
            
            <nav className="flex flex-col gap-4 text-gray-700">
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`py-2 px-4 rounded-xl font-medium transition text-left ${currentView === 'dashboard' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                내 서재
              </button>
              <button 
                onClick={() => onNavigate('swipe')}
                className={`py-2 px-4 rounded-xl font-medium transition text-left ${currentView === 'swipe' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                추천 문장 스와이프
              </button>
              
              <button className="py-2 px-4 hover:bg-gray-100 rounded-xl transition text-left opacity-50 cursor-not-allowed">통계 (준비중)</button>
              <button className="py-2 px-4 hover:bg-gray-100 rounded-xl transition text-left opacity-50 cursor-not-allowed">리뷰 (준비중)</button>
            </nav>

            <div className="mt-auto pt-8 border-t border-gray-200 flex flex-col gap-3">
              <button
                onClick={() => { onClose(); router.push('/mypage'); }}
                className="py-2 px-4 hover:bg-gray-100 rounded-xl transition text-left text-gray-700 font-medium"
              >
                내 정보
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-4 hover:bg-red-50 rounded-xl transition text-left text-red-500 font-medium"
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

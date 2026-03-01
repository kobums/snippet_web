"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 w-64 h-full bg-white/10 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-light tracking-widest text-white uppercase">snippet</h2>
              <button onClick={onClose} className="text-white hover:text-white/70 lg:hidden">✕</button>
            </div>
            
            <nav className="flex flex-col gap-4 text-white/80">
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`py-2 px-4 rounded-xl font-medium transition text-left ${currentView === 'dashboard' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'}`}
              >
                내 서재
              </button>
              <button 
                onClick={() => onNavigate('swipe')}
                className={`py-2 px-4 rounded-xl font-medium transition text-left ${currentView === 'swipe' ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/80'}`}
              >
                추천 문장 스와이프
              </button>
              
              <button className="py-2 px-4 hover:bg-white/5 rounded-xl transition text-left opacity-50 cursor-not-allowed">통계 (준비중)</button>
              <button className="py-2 px-4 hover:bg-white/5 rounded-xl transition text-left opacity-50 cursor-not-allowed">리뷰 (준비중)</button>
            </nav>
            
            <div className="mt-auto pt-8 border-t border-white/10 text-xs text-white/40">
              <p>v2.0 MVP</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

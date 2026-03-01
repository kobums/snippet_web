"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecordsByBook, addRecordToBook } from '@/lib/recordApi';
import { RecordDto } from '@/types/record';
import { UserBookDto } from '@/types/library';

interface BookRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: UserBookDto | null;
}

export default function BookRecordModal({ isOpen, onClose, book }: BookRecordModalProps) {
  const [records, setRecords] = useState<RecordDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'snippet' | 'diary' | 'review'>('all');
  
  // Add Record State
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<'snippet' | 'diary' | 'review'>('snippet');
  const [newText, setNewText] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newRelatedPage, setNewRelatedPage] = useState<number | ''>('');

  useEffect(() => {
    if (isOpen && book) {
      loadRecords();
    }
  }, [isOpen, book, activeTab]);

  const loadRecords = async () => {
    if (!book) return;
    setLoading(true);
    try {
      const typeParam = activeTab === 'all' ? undefined : activeTab;
      const data = await getRecordsByBook(book.id, typeParam);
      setRecords(data);
    } catch (e) {
      console.error("Failed to load records", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!book || !newText.trim()) return;
    
    try {
      await addRecordToBook(book.id, {
        type: newType,
        text: newText,
        tag: newTag || undefined,
        relatedPage: newRelatedPage ? Number(newRelatedPage) : undefined
      });
      setIsAdding(false);
      setNewText('');
      setNewTag('');
      setNewRelatedPage('');
      loadRecords();
    } catch (e) {
      console.error("Failed to add record", e);
      alert("기록 추가에 실패했습니다.");
    }
  };

  if (!isOpen || !book) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl flex flex-col h-[85vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex flex-col gap-4 relative shrink-0">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors">✕</button>
            <div className="flex gap-4 pr-8">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-16 h-24 bg-white/10 rounded-lg flex-shrink-0"></div>
              )}
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold text-white line-clamp-1">{book.title}</h2>
                <p className="text-white/60 text-sm mt-1">{book.author}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: '전체' },
                { id: 'snippet', label: '밑줄(스니펫)' },
                { id: 'diary', label: '일기/단상' },
                { id: 'review', label: '리뷰' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-white/20 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white/80'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline View */}
          <div className="flex-1 overflow-y-auto p-6 bg-black/20 hide-scrollbar relative">
            <div className="absolute left-10 top-0 bottom-0 w-px bg-white/10"></div>
            
            <div className="space-y-6">
              {isAdding && (
                <div className="relative pl-12 pr-4">
                  <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full bg-blue-400 border-4 border-black/80 z-10"></div>
                  <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                    <div className="flex gap-2 mb-3">
                      <select value={newType} onChange={e => setNewType(e.target.value as any)} className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1 outline-none">
                        <option value="snippet" className="bg-gray-800">밑줄</option>
                        <option value="diary" className="bg-gray-800">일기</option>
                        <option value="review" className="bg-gray-800">리뷰</option>
                      </select>
                      <input type="number" placeholder="관련 페이지" value={newRelatedPage} onChange={e => setNewRelatedPage(e.target.value ? Number(e.target.value) : '')} className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1 outline-none w-24 placeholder-white/30" />
                      <input type="text" placeholder="태그 (e.g. #인상깊은)" value={newTag} onChange={e => setNewTag(e.target.value)} className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1 outline-none flex-1 placeholder-white/30" />
                    </div>
                    <textarea 
                      autoFocus
                      placeholder="내용을 입력하세요..." 
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      className="w-full bg-transparent border-none text-white text-sm resize-none outline-none min-h-[100px] placeholder-white/30"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                       <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-xs text-white/50 hover:bg-white/10">취소</button>
                       <button onClick={handleAddRecord} disabled={!newText.trim()} className="px-4 py-2 rounded-xl text-xs bg-blue-500/80 hover:bg-blue-500 text-white disabled:opacity-50">저장</button>
                    </div>
                  </div>
                </div>
              )}

              {loading && !isAdding && <div className="pl-12 text-white/50 text-sm">기록을 불러오는 중...</div>}
              
              {!loading && records.length === 0 && !isAdding && (
                 <div className="pl-12 text-white/40 text-sm py-8">아직 작성된 기록이 없습니다. 우측 하단의 + 버튼을 눌러 기록을 남겨보세요.</div>
              )}

              {!loading && records.map(record => (
                <div key={record.id} className="relative pl-12 pr-4 group">
                  <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full border-4 border-black/80 z-10
                    ${record.type === 'snippet' ? 'bg-pink-400' : record.type === 'diary' ? 'bg-purple-400' : 'bg-emerald-400'}"
                    style={{ backgroundColor: record.type === 'snippet' ? '#f472b6' : record.type === 'diary' ? '#c084fc' : '#34d399' }}
                  ></div>
                  
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10"
                          style={{ 
                            color: record.type === 'snippet' ? '#f472b6' : record.type === 'diary' ? '#c084fc' : '#34d399',
                            backgroundColor: record.type === 'snippet' ? 'rgba(244, 114, 182, 0.1)' : record.type === 'diary' ? 'rgba(192, 132, 252, 0.1)' : 'rgba(52, 211, 153, 0.1)' 
                          }}
                        >
                          {record.type}
                        </span>
                        {record.relatedPage && <span className="text-xs text-white/40">p.{record.relatedPage}</span>}
                      </div>
                      <span className="text-xs text-white/30">{new Date(record.createDate).toLocaleDateString()}</span>
                    </div>
                    
                    <p className={`text-white text-sm leading-relaxed whitespace-pre-wrap ${record.type === 'snippet' && 'italic text-white/90 border-l-2 border-white/20 pl-3'}`}>
                      {record.type === 'snippet' ? `"${record.text}"` : record.text}
                    </p>
                    
                    {record.tag && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <span className="text-xs text-blue-200/70 bg-blue-500/10 px-2 py-1 rounded-md">{record.tag}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Action Button */}
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

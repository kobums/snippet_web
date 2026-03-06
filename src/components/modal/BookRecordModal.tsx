"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecordsByBook, addRecordToBook } from '@/lib/recordApi';
import { RecordDto } from '@/types/record';
import { UserBookDto } from '@/types/library';
import { useBookStore } from '@/stores/useBookStore';

interface BookRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: UserBookDto | null;
}

export default function BookRecordModal({ isOpen, onClose, book }: BookRecordModalProps) {
  const { updateStatus, updateProgress, updateStartDate, updateEndDate } = useBookStore();
  const [records, setRecords] = useState<RecordDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'snippet' | 'diary' | 'review'>('all');
  
  // Add Record State
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<'snippet' | 'diary' | 'review'>('snippet');
  const [newText, setNewText] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newRelatedPage, setNewRelatedPage] = useState<number | ''>('');

  // Progress State
  const [localReadPage, setLocalReadPage] = useState<number | ''>('');
  const [localStatus, setLocalStatus] = useState<UserBookDto['status']>('waiting');
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');

  useEffect(() => {
    if (isOpen && book) {
      loadRecords();
      setLocalReadPage(book.readPage);
      setLocalStatus(book.status);
      setLocalStartDate(book.startDate?.slice(0, 10) || '');
      setLocalEndDate(book.endDate?.slice(0, 10) || '');
    }
  }, [isOpen, book, activeTab]);

  const handleProgressUpdate = async () => {
    if (!book || localReadPage === '' || localReadPage === book.readPage) {
      setLocalReadPage(book?.readPage ?? '');
      return;
    }

    let newPage = Number(localReadPage);
    if (newPage < 0 || (book.totalPage && newPage > book.totalPage)) {
      alert(`페이지는 0에서 ${book.totalPage || '?'} 사이여야 합니다.`);
      setLocalReadPage(book.readPage);
      return;
    }

    setLocalReadPage(newPage);
    await updateProgress(book.id, newPage);
  };

  const handleStatusChange = async (newStatus: UserBookDto['status']) => {
    if (!book || newStatus === localStatus) return;
    setLocalStatus(newStatus);
    await updateStatus(book.id, newStatus);
    if (newStatus === 'completed' && book.totalPage) {
      setLocalReadPage(book.totalPage);
    }
  };

  const handleStartDateChange = async (date: string) => {
    if (!book) return;
    setLocalStartDate(date);
    await updateStartDate(book.id, date);
  };

  const handleEndDateChange = async (date: string) => {
    if (!book) return;
    setLocalEndDate(date);
    await updateEndDate(book.id, date);
  };

  // Close with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // isAdding (새 기록 작성 중)일 때는 바로 닫히지 않고 취소되게 할 수도 있지만,
      // 일단 모달 자체를 닫는 기본 동작을 수행하도록 합니다.
      if (e.key === 'Escape' && isOpen) {
        if (isAdding) {
           setIsAdding(false);
        } else {
           onClose();
        }
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isAdding]);

  const loadRecords = async () => {
    if (!book) return;
    setLoading(true);
    try {
      const typeParam = activeTab === 'all' ? undefined : activeTab;
      const data = await getRecordsByBook(book.bookId, typeParam);
      setRecords(data);
    } catch (e) {
      console.error("Failed to load records", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!book || !newText.trim()) return;
    if (newRelatedPage !== '' && (newRelatedPage < 0 || (book.totalPage && newRelatedPage > book.totalPage))) {
      alert(`0~${book.totalPage}p 사이로 입력해주세요`);
      return;
    }
    
    try {
      await addRecordToBook(book.bookId, {
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
          className="w-full max-w-2xl bg-white/95 border border-gray-200 backdrop-blur-2xl rounded-3xl flex flex-col h-[85vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex flex-col gap-4 relative shrink-0">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">✕</button>
            <div className="flex gap-4 pr-8">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-16 h-24 bg-gray-100 rounded-lg flex-shrink-0"></div>
              )}
              <div className="flex flex-col justify-center flex-1">
                <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{book.title}</h2>
                <p className="text-gray-500 text-sm mt-1 mb-3">{book.author}</p>
                
                {/* Book Info Editor */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status */}
                  <select
                    value={localStatus}
                    onChange={(e) => handleStatusChange(e.target.value as UserBookDto['status'])}
                    className="appearance-none bg-white/60 hover:bg-white text-gray-700 font-medium text-xs px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-purple-300 focus:ring-1 focus:ring-purple-300 shadow-sm transition-all cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '1.75rem' }}
                  >
                    <option value="waiting">읽고 싶은</option>
                    <option value="reading">읽는 중</option>
                    <option value="completed">완독</option>
                    <option value="dropped">중단</option>
                  </select>

                  {/* Reading Progress */}
                  {localStatus === 'reading' && (
                    <div className="flex items-center gap-2 bg-white/60 hover:bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-all">
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">읽은 페이지</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={localReadPage}
                          onChange={(e) => setLocalReadPage(e.target.value === '' ? '' : Number(e.target.value))}
                          onBlur={handleProgressUpdate}
                          onKeyDown={(e) => e.key === 'Enter' && handleProgressUpdate()}
                          className="w-12 px-1 text-xs text-center border-b border-gray-300 hover:border-purple-400 focus:border-purple-500 bg-transparent outline-none transition-colors text-gray-900 font-medium"
                        />
                        <span className="text-[11px] text-gray-400 font-medium">/ {book.totalPage || '?'}p</span>
                      </div>
                    </div>
                  )}

                  {/* Start Date */}
                  <div className="flex items-center gap-2 bg-white/60 hover:bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-all">
                    <span className="text-xs text-gray-500 font-medium">시작</span>
                    <input
                      type="date"
                      value={localStartDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="text-xs text-gray-700 bg-transparent outline-none font-medium cursor-pointer"
                    />
                  </div>

                  {/* End Date */}
                  {(localStatus === 'completed' || localStatus === 'dropped') && (
                    <div className="flex items-center gap-2 bg-white/60 hover:bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-all">
                      <span className="text-xs text-gray-500 font-medium">종료</span>
                      <input
                        type="date"
                        value={localEndDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="text-xs text-gray-700 bg-transparent outline-none font-medium cursor-pointer"
                      />
                    </div>
                  )}
                </div>
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
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (isAdding) setIsAdding(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${activeTab === tab.id ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline View */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 hide-scrollbar relative">
            <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-200"></div>
            
            <div className="space-y-6">
              {isAdding && (
                <div className="relative pl-12 pr-4">
                  <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full bg-blue-400 border-4 border-white z-10"></div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
                    <div className="flex gap-2 mb-3">
                      <select value={newType} onChange={e => setNewType(e.target.value as any)} className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-2 py-1 outline-none">
                        <option value="snippet">밑줄</option>
                        <option value="diary">일기</option>
                        <option value="review">리뷰</option>
                      </select>
                      <input
                        type="number"
                        placeholder="관련 페이지"
                        value={newRelatedPage}
                        onChange={e => {
                          const val = e.target.value ? Number(e.target.value) : '';
                          setNewRelatedPage(val);
                          if (val !== '' && (val < 0 || (book.totalPage && val > book.totalPage))) {
                            alert(`0~${book.totalPage}p 사이로 입력해주세요`);
                            setNewRelatedPage('');
                          }
                        }}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-3 py-1 outline-none w-24 placeholder-gray-400"
                      />
                      <input type="text" placeholder="태그 (e.g. #인상깊은)" value={newTag} onChange={e => setNewTag(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-3 py-1 outline-none flex-1 placeholder-gray-400" />
                    </div>
                    <textarea 
                      autoFocus
                      placeholder="내용을 입력하세요..." 
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      className="w-full bg-transparent border-none text-gray-900 text-sm resize-none outline-none min-h-[100px] placeholder-gray-400"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                       <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-100">취소</button>
                       <button onClick={handleAddRecord} disabled={!newText.trim()} className="px-4 py-2 rounded-xl text-xs bg-blue-500/80 hover:bg-blue-500 text-white disabled:opacity-50">저장</button>
                    </div>
                  </div>
                </div>
              )}

              {loading && !isAdding && <div className="pl-12 text-gray-500 text-sm">기록을 불러오는 중...</div>}
              
              {!loading && records.length === 0 && !isAdding && (
                 <div className="pl-12 text-gray-400 text-sm py-8">아직 작성된 기록이 없습니다. 우측 하단의 + 버튼을 눌러 기록을 남겨보세요.</div>
              )}

              {!loading && records.map(record => (
                <div key={record.id} className="relative pl-12 pr-4 group">
                  <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full border-4 border-white z-10"
                    style={{ backgroundColor: record.type === 'snippet' ? '#f472b6' : record.type === 'diary' ? '#c084fc' : '#34d399' }}
                  ></div>
                  
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:bg-gray-50 transition-colors shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-gray-100"
                          style={{ 
                            color: record.type === 'snippet' ? '#db2777' : record.type === 'diary' ? '#9333ea' : '#059669',
                            backgroundColor: record.type === 'snippet' ? 'rgba(244, 114, 182, 0.1)' : record.type === 'diary' ? 'rgba(192, 132, 252, 0.1)' : 'rgba(52, 211, 153, 0.1)' 
                          }}
                        >
                          {record.type}
                        </span>
                        {record.relatedPage && <span className="text-xs text-gray-400">p.{record.relatedPage}</span>}
                      </div>
                      <span className="text-xs text-gray-400">{new Date(record.createDate).toLocaleDateString()}</span>
                    </div>
                    
                    <p className={`text-gray-800 text-sm leading-relaxed whitespace-pre-wrap ${record.type === 'snippet' && 'italic text-gray-700 border-l-2 border-gray-300 pl-3'}`}>
                      {record.type === 'snippet' ? `"${record.text}"` : record.text}
                    </p>
                    
                    {record.tag && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{record.tag}</span>
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
              onClick={() => {
                if (activeTab !== 'all') setNewType(activeTab);
                setIsAdding(true);
              }}
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

"use client"

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getRecordsByBook, createRecord, patchRecord, deleteRecord } from '@/lib/recordApi';
import { getSessionsByBook } from '@/lib/readingSessionApi';
import { RecordDto } from '@/types/record';
import { ReadingSessionDto } from '@/types/readingSession';
import { UserBookDto } from '@/types/library';
import { useBookStore } from '@/stores/useBookStore';
import { TimelineRecordSkeleton } from '@/components/ui/skeleton';

// 임시 ID 생성 유틸리티
let tempRecordIdCounter = -1;
const generateTempRecordId = () => tempRecordIdCounter--;

interface BookRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: UserBookDto | null;
}

export default function BookRecordModal({ isOpen, onClose, book }: BookRecordModalProps) {
  const { updateStatus, updateProgress, updateStartDate, updateEndDate, updateType } = useBookStore();
  const [records, setRecords] = useState<RecordDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'snippet' | 'diary' | 'review' | 'session'>('all');
  const [sessions, setSessions] = useState<ReadingSessionDto[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  
  // Add Record State
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<'snippet' | 'diary' | 'review'>('snippet');
  const [newText, setNewText] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newRelatedPage, setNewRelatedPage] = useState<number | ''>('');

  // Edit Record State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editType, setEditType] = useState<'snippet' | 'diary' | 'review'>('snippet');
  const [editText, setEditText] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editRelatedPage, setEditRelatedPage] = useState<number | ''>('');

  // Progress State
  const [localReadPage, setLocalReadPage] = useState<number | ''>('');
  const [localStatus, setLocalStatus] = useState<UserBookDto['status']>('waiting');
  const [localType, setLocalType] = useState<UserBookDto['type']>('wish');
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');

  useEffect(() => {
    if (isOpen && book) {
      if (activeTab === 'session') {
        loadSessions();
      } else {
        loadRecords();
      }
      setLocalReadPage(book.readPage);
      setLocalStatus(book.status);
      setLocalType(book.type);
      setLocalStartDate(book.startDate?.slice(0, 10) || '');
      setLocalEndDate(book.endDate?.slice(0, 10) || '');
    }
  }, [isOpen, book, activeTab]);

  // 모달이 열릴 때마다 탭 및 작성 폼 초기화 (탭 변경과 무관하게)
  useEffect(() => {
    if (isOpen) {
      setActiveTab('all');
      setIsAdding(false);
      setNewType('snippet');
      setNewText('');
      setNewTag('');
      setNewRelatedPage('');
    }
  }, [isOpen]);

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

    if (book.totalPage > 0 && newPage === book.totalPage && localStatus === 'reading') {
      setLocalStatus('completed');
      await updateStatus(book.id, 'completed');
      toast.success('완독을 축하합니다! 🎉');
    }
  };

  const handleTypeChange = async (newType: UserBookDto['type']) => {
    if (!book || newType === localType) return;
    setLocalType(newType);
    await updateType(book.id, newType);
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

  const loadSessions = async () => {
    if (!book) return;
    setLoadingSessions(true);
    try {
      const data = await getSessionsByBook(book.id);
      setSessions(data);
    } catch (e) {
      console.error("Failed to load sessions", e);
    } finally {
      setLoadingSessions(false);
    }
  };

  const formatSessionDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}시간 ${m}분`;
    if (m > 0) return `${m}분`;
    return `${seconds}초`;
  };

  const formatSessionPace = (secondsPerPage: number) => {
    if (secondsPerPage <= 0) return '-';
    return `${(secondsPerPage / 60).toFixed(1)} min/p`;
  };

  const startEditing = (record: RecordDto) => {
    setEditingId(record.id);
    setEditType(record.type);
    setEditText(record.text);
    setEditTag(record.tag || '');
    setEditRelatedPage(record.relatedPage ?? '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
    setEditTag('');
    setEditRelatedPage('');
  };

  const handleUpdateRecord = async (record: RecordDto) => {
    if (!editText.trim()) return;

    const updated: RecordDto = { ...record, type: editType, text: editText, tag: editTag || undefined, relatedPage: editRelatedPage !== '' ? Number(editRelatedPage) : undefined };
    setRecords(prev => prev.map(r => r.id === record.id ? updated : r));
    cancelEditing();

    try {
      await patchRecord(record.id, { type: editType, text: editText, tag: editTag || undefined, relatedPage: editRelatedPage !== '' ? Number(editRelatedPage) : undefined });
      toast.success('기록이 수정되었습니다');
    } catch (e) {
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
      toast.error('기록 수정에 실패했습니다.');
    }
  };

  const handleDeleteRecord = async (record: RecordDto) => {
    if (!confirm('이 기록을 삭제하시겠습니까?')) return;

    setRecords(prev => prev.filter(r => r.id !== record.id));

    try {
      await deleteRecord(record.id);
      toast.success('기록이 삭제되었습니다');
    } catch (e) {
      setRecords(prev => [record, ...prev]);
      toast.error('기록 삭제에 실패했습니다.');
    }
  };

  const handleAddRecord = async () => {
    if (!book || !newText.trim()) return;
    if (newRelatedPage === '' && !newTag.trim()) {
      alert('페이지 또는 태그를 입력해 주세요.');
      return;
    }
    if (newRelatedPage !== '' && (newRelatedPage < 0 || (book.totalPage && newRelatedPage > book.totalPage))) {
      alert(`0~${book.totalPage}p 사이로 입력해주세요`);
      return;
    }

    // 1️⃣ 임시 ID로 즉시 UI에 추가
    const tempRecord: RecordDto = {
      id: generateTempRecordId(),
      bookId: book.bookId,
      bookTitle: book.title,
      type: newType,
      text: newText,
      tag: newTag || undefined,
      relatedPage: newRelatedPage ? Number(newRelatedPage) : undefined,
      createDate: new Date().toISOString()
    };

    setRecords(prev => [tempRecord, ...prev]);

    // 2️⃣ 폼 즉시 리셋 (다음 기록 작성 가능)
    setIsAdding(false);
    setNewText('');
    setNewTag('');
    setNewRelatedPage('');

    try {
      // 3️⃣ 백그라운드 API 호출
      const realId = await createRecord(book.bookId, {
        type: newType,
        text: newText,
        tag: newTag || undefined,
        relatedPage: newRelatedPage ? Number(newRelatedPage) : undefined
      });

      // 4️⃣ 성공: 실제 ID로 교체
      setRecords(prev =>
        prev.map(r => r.id === tempRecord.id ? { ...r, id: realId } : r)
      );

      toast.success('기록이 추가되었습니다');

    } catch (e) {
      // 5️⃣ 실패: 롤백 + 에러 토스트
      setRecords(prev => prev.filter(r => r.id !== tempRecord.id));
      toast.error('기록 추가에 실패했습니다. 다시 시도해주세요.');
      console.error("Failed to add record", e);
    }
  };

  if (!isOpen || !book) return null;

  return createPortal(
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
          className="w-full max-w-2xl backdrop-blur-2xl rounded-3xl flex flex-col h-[85vh] overflow-hidden shadow-2xl
            bg-white/95 border border-gray-200
            dark:bg-[#1c1c1e]/95 dark:border-white/10"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b flex flex-col gap-4 relative shrink-0 border-gray-200 dark:border-white/10">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full transition-colors text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:text-[#666] dark:hover:text-[#f0f0f0] dark:hover:bg-white/8">✕</button>
            <div className="flex gap-4 pr-8">
              {book.coverUrl ? (
                <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-16 h-24 rounded-lg flex-shrink-0 bg-gray-100 dark:bg-white/10"></div>
              )}
              <div className="flex flex-col justify-center flex-1">
                <h2 className="text-xl font-bold line-clamp-1 text-gray-900 dark:text-[#f0f0f0]">{book.title}</h2>
                <p className="text-sm mt-1 mb-3 text-gray-500 dark:text-[#a0a0a0]">{book.author}</p>

                {/* Book Info Editor */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Type */}
                  <select
                    value={localType}
                    onChange={(e) => handleTypeChange(e.target.value as UserBookDto['type'])}
                    className="appearance-none font-medium text-xs px-3 py-1.5 rounded-lg border outline-none shadow-sm transition-all cursor-pointer
                      bg-white/60 hover:bg-white text-gray-700 border-gray-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/30
                      dark:bg-white/8 dark:hover:bg-white/12 dark:text-[#f0f0f0] dark:border-white/10"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '1.75rem' }}
                  >
                    <option value="wish">위시리스트</option>
                    <option value="have">소장</option>
                    <option value="borrow">대출 중</option>
                    <option value="return">반납</option>
                  </select>

                  {/* Status */}
                  <select
                    value={localStatus}
                    onChange={(e) => handleStatusChange(e.target.value as UserBookDto['status'])}
                    className="appearance-none font-medium text-xs px-3 py-1.5 rounded-lg border outline-none shadow-sm transition-all cursor-pointer
                      bg-white/60 hover:bg-white text-gray-700 border-gray-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/30
                      dark:bg-white/8 dark:hover:bg-white/12 dark:text-[#f0f0f0] dark:border-white/10"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '1.75rem' }}
                  >
                    <option value="waiting">읽고 싶은</option>
                    <option value="reading">읽는 중</option>
                    <option value="completed">완독</option>
                    <option value="dropped">중단</option>
                  </select>

                  {/* Reading Progress */}
                  {localStatus === 'reading' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all
                      bg-white/60 hover:bg-white border-gray-200
                      dark:bg-white/8 dark:hover:bg-white/12 dark:border-white/10">
                      <span className="text-xs font-medium whitespace-nowrap text-gray-500 dark:text-[#a0a0a0]">읽은 페이지</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={localReadPage}
                          onChange={(e) => setLocalReadPage(e.target.value === '' ? '' : Number(e.target.value))}
                          onBlur={handleProgressUpdate}
                          onKeyDown={(e) => e.key === 'Enter' && handleProgressUpdate()}
                          className="w-12 px-1 text-xs text-center border-b bg-transparent outline-none transition-colors font-medium
                            border-gray-300 hover:border-accent/50 focus:border-accent text-gray-900
                            dark:border-white/20 dark:text-[#f0f0f0]"
                        />
                        <span className="text-[11px] font-medium text-gray-400 dark:text-[#666]">/ {book.totalPage || '?'}p</span>
                      </div>
                    </div>
                  )}
                <div className="flex items-center gap-2">
                  {/* Start Date */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all
                    bg-white/60 hover:bg-white border-gray-200
                    dark:bg-white/8 dark:hover:bg-white/12 dark:border-white/10">
                    <span className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0]">시작</span>
                    <input
                      type="date"
                      value={localStartDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="text-xs bg-transparent outline-none font-medium cursor-pointer text-gray-700 dark:text-[#f0f0f0]"
                    />
                  </div>

                  {/* End Date */}
                  {(localStatus === 'completed' || localStatus === 'dropped') && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm transition-all
                      bg-white/60 hover:bg-white border-gray-200
                      dark:bg-white/8 dark:hover:bg-white/12 dark:border-white/10">
                      <span className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0]">종료</span>
                      <input
                        type="date"
                        value={localEndDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="text-xs bg-transparent outline-none font-medium cursor-pointer text-gray-700 dark:text-[#f0f0f0]"
                      />
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {[
                { id: 'all', label: '전체' },
                { id: 'snippet', label: '밑줄(스니펫)' },
                { id: 'diary', label: '일기/단상' },
                { id: 'review', label: '리뷰' },
                { id: 'session', label: '독서세션' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (isAdding) setIsAdding(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${activeTab === tab.id ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-[#f0f0f0]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-[#666] dark:hover:bg-white/8 dark:hover:text-[#f0f0f0]'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Session Tab Content */}
          {activeTab === 'session' && (
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar bg-gray-50/50 dark:bg-white/2">
              {loadingSessions ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl animate-pulse bg-gray-100 dark:bg-white/8" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-[#666]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-sm">이 책의 독서 세션이 없습니다</p>
                  <p className="text-xs mt-1 opacity-60">앱에서 타이머를 사용해 세션을 기록해보세요</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id} className="rounded-2xl p-4 shadow-sm border bg-white border-gray-200 dark:bg-white/5 dark:border-white/8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400 dark:text-[#666]">
                          {new Date(session.sessionDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                        </span>
                        <span className="text-xs font-semibold text-accent">{formatSessionDuration(session.durationSeconds)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm mb-2 text-gray-600 dark:text-[#a0a0a0]">
                        <span>{session.startPage}p</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                        <span>{session.endPage}p</span>
                        <span className="ml-auto text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{session.pagesRead}p</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#666]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>페이스: {formatSessionPace(session.secondsPerPage)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline View */}
          {activeTab !== 'session' && (
          <div className="flex-1 overflow-y-auto p-6 hide-scrollbar relative bg-gray-50/50 dark:bg-white/2">
            <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10"></div>

            <div className="space-y-6">
              {isAdding && (
                <div className="relative pl-12 pr-4">
                  <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full bg-blue-400 border-4 border-white dark:border-[#1c1c1e] z-10"></div>
                  <div className="rounded-2xl p-4 shadow-sm border bg-white border-gray-200 dark:bg-white/5 dark:border-white/10">
                    <div className="flex gap-2 mb-3">
                      <select value={newType} onChange={e => setNewType(e.target.value as any)} className="border rounded-lg px-2 py-1 outline-none text-xs bg-gray-50 border-gray-200 text-gray-900 dark:bg-white/8 dark:border-white/10 dark:text-[#f0f0f0]">
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
                        className="border rounded-lg px-3 py-1 outline-none w-24 text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-white/8 dark:border-white/10 dark:text-[#f0f0f0] dark:placeholder-[#666]"
                      />
                      <input type="text" placeholder="태그 (e.g. #인상깊은)" value={newTag} onChange={e => setNewTag(e.target.value)} className="border rounded-lg px-3 py-1 outline-none flex-1 text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-white/8 dark:border-white/10 dark:text-[#f0f0f0] dark:placeholder-[#666]" />
                    </div>
                    <textarea
                      autoFocus
                      placeholder="내용을 입력하세요..."
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      className="w-full bg-transparent border-none text-sm resize-none outline-none min-h-[100px] text-gray-900 placeholder-gray-400 dark:text-[#f0f0f0] dark:placeholder-[#666]"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                       <button onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-100 dark:text-[#a0a0a0] dark:hover:bg-white/8">취소</button>
                       <button onClick={handleAddRecord} disabled={!newText.trim()} className="px-4 py-2 rounded-xl text-xs bg-primary hover:bg-primary/85 text-white disabled:opacity-50">저장</button>
                    </div>
                  </div>
                </div>
              )}

              {loading && !isAdding && <TimelineRecordSkeleton count={3} />}

              {!loading && records.length === 0 && !isAdding && (
                 <div className="pl-12 text-sm py-8 text-gray-400 dark:text-[#666]">아직 작성된 기록이 없습니다. 우측 하단의 + 버튼을 눌러 기록을 남겨보세요.</div>
              )}

              {!loading && records.map(record => (
                <div key={record.id} className="relative pl-12 pr-4 group">
                  <div className="absolute left-[-1.1rem] top-4 w-4 h-4 rounded-full border-4 border-white dark:border-[#1c1c1e] z-10"
                    style={{ backgroundColor: record.type === 'snippet' ? '#f472b6' : record.type === 'diary' ? '#c084fc' : '#34d399' }}
                  ></div>

                  {editingId === record.id ? (
                    <div className="rounded-2xl p-4 shadow-sm border border-accent/20 bg-white dark:bg-white/5 dark:border-accent/30">
                      <div className="flex gap-2 mb-3">
                        <select value={editType} onChange={e => setEditType(e.target.value as any)} className="border rounded-lg px-2 py-1 outline-none text-xs bg-gray-50 border-gray-200 text-gray-900 dark:bg-white/8 dark:border-white/10 dark:text-[#f0f0f0]">
                          <option value="snippet">밑줄</option>
                          <option value="diary">일기</option>
                          <option value="review">리뷰</option>
                        </select>
                        <input
                          type="number"
                          placeholder="관련 페이지"
                          value={editRelatedPage}
                          onChange={e => setEditRelatedPage(e.target.value ? Number(e.target.value) : '')}
                          className="border rounded-lg px-3 py-1 outline-none w-24 text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-white/8 dark:border-white/10 dark:text-[#f0f0f0] dark:placeholder-[#666]"
                        />
                        <input type="text" placeholder="태그" value={editTag} onChange={e => setEditTag(e.target.value)} className="border rounded-lg px-3 py-1 outline-none flex-1 text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-white/8 dark:border-white/10 dark:text-[#f0f0f0] dark:placeholder-[#666]" />
                      </div>
                      <textarea
                        autoFocus
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="w-full bg-transparent border-none text-sm resize-none outline-none min-h-[80px] text-gray-900 placeholder-gray-400 dark:text-[#f0f0f0] dark:placeholder-[#666]"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={cancelEditing} className="px-4 py-2 rounded-xl text-xs text-gray-500 hover:bg-gray-100 dark:text-[#a0a0a0] dark:hover:bg-white/8">취소</button>
                        <button onClick={() => handleUpdateRecord(record)} disabled={!editText.trim()} className="px-4 py-2 rounded-xl text-xs bg-primary hover:bg-primary/85 text-white disabled:opacity-50">저장</button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl p-5 transition-colors shadow-sm border bg-white border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-white/8 dark:hover:bg-white/8">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-gray-100 dark:border-white/10"
                            style={{
                              color: record.type === 'snippet' ? '#db2777' : record.type === 'diary' ? '#9333ea' : '#059669',
                              backgroundColor: record.type === 'snippet' ? 'rgba(244, 114, 182, 0.1)' : record.type === 'diary' ? 'rgba(192, 132, 252, 0.1)' : 'rgba(52, 211, 153, 0.1)'
                            }}
                          >
                            {record.type}
                          </span>
                          {record.relatedPage && <span className="text-xs text-gray-400 dark:text-[#666]">p.{record.relatedPage}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 dark:text-[#666]">{new Date(record.createDate).toLocaleDateString()}</span>
                          <button onClick={() => startEditing(record)} className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-[#666] dark:hover:text-[#f0f0f0] dark:hover:bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => handleDeleteRecord(record)} className="opacity-0 group-hover:opacity-100 transition-all p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:text-[#666] dark:hover:text-red-400 dark:hover:bg-red-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          </button>
                        </div>
                      </div>

                      <p className={`text-sm leading-relaxed whitespace-pre-wrap text-gray-800 dark:text-[#d0d0d0] ${record.type === 'snippet' && 'italic border-l-2 border-gray-300 pl-3 dark:border-white/20'}`}>
                        {record.type === 'snippet' ? `"${record.text}"` : record.text}
                      </p>

                      {record.tag && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/8">
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md dark:text-blue-400 dark:bg-blue-500/10">{record.tag}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Floating Action Button */}
          {!isAdding && activeTab !== 'session' && (
            <button
              onClick={() => {
                if (activeTab !== 'all') setNewType(activeTab as any);
                setIsAdding(true);
              }}
              className="absolute bottom-8 right-8 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

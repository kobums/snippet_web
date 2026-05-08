"use client"

import React, { useState, useEffect } from 'react';
import { addSuggestion, getMySuggestions, SuggestionDto } from '@/lib/suggestionApi';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['기능 요청', '버그 신고', 'UI/UX 개선', '기타'];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:     { label: '검토 중', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  IN_PROGRESS: { label: '처리 중', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  DONE:        { label: '완료', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  REJECTED:    { label: '반려', color: 'text-gray-400 bg-gray-100 dark:bg-white/8' },
};

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SuggestionModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<SuggestionDto[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && tab === 'history') loadHistory();
  }, [isOpen, tab]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getMySuggestions();
      setHistory(data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime()));
    } catch {
      // silent
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('제목을 입력해주세요.'); return; }
    if (!content.trim()) { toast.error('내용을 입력해주세요.'); return; }

    setSubmitting(true);
    try {
      await addSuggestion({ category, title: title.trim(), content: content.trim() });
      toast.success('제안이 접수되었습니다. 감사합니다!');
      setTitle('');
      setContent('');
      setCategory(CATEGORIES[0]);
      setTab('history');
      loadHistory();
    } catch {
      toast.error('제안 제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTab('new');
    setTitle('');
    setContent('');
    setCategory(CATEGORIES[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/8 shrink-0">
          <h2 className="text-base font-semibold text-gray-900 dark:text-[#f0f0f0]">기능 제안 / 버그 신고</h2>
          <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 dark:text-[#666]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-3 gap-4 shrink-0">
          {(['new', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors ${tab === t ? 'border-accent text-accent' : 'border-transparent text-gray-400 dark:text-[#666] hover:text-gray-600 dark:hover:text-[#a0a0a0]'}`}
            >
              {t === 'new' ? '새 제안' : '내 제안 내역'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'new' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Category */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1.5 block">분류</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === c ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-200 dark:hover:bg-white/12'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1.5 block">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="한 줄로 요약해주세요"
                  maxLength={100}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-[#d0d0d0] placeholder-gray-400 dark:placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1.5 block">내용</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="자세한 내용을 적어주세요. 버그라면 재현 방법도 함께 써주시면 도움이 됩니다."
                  rows={5}
                  maxLength={2000}
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-[#d0d0d0] placeholder-gray-400 dark:placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                />
                <p className="text-right text-xs text-gray-400 dark:text-[#555] mt-1">{content.length}/2000</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-accent text-white rounded-xl font-medium text-sm hover:bg-accent/90 transition-all disabled:opacity-50 mt-1"
              >
                {submitting ? '제출 중...' : '제안 제출'}
              </button>
            </form>
          ) : (
            <div>
              {loadingHistory ? (
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-white/8 animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-[#555]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p className="text-sm">제출한 제안이 없습니다</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {history.map(s => {
                    const st = STATUS_LABELS[s.status] ?? { label: s.status, color: 'text-gray-400 bg-gray-100' };
                    return (
                      <div key={s.id} className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-gray-400 dark:text-[#666]">{s.category}</span>
                            <p className="text-sm font-medium text-gray-800 dark:text-[#d0d0d0] mt-0.5">{s.title}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.color}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[#a0a0a0] line-clamp-2">{s.content}</p>
                        <p className="text-[10px] text-gray-300 dark:text-[#555]">{formatDate(s.createDate)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

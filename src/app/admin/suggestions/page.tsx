"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  AdminSuggestionDto,
  answerSuggestion,
  getAdminSuggestions,
} from '@/lib/suggestionApi';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  FEATURE:     { label: '기능 요청', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  BUG:         { label: '버그 신고', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  IMPROVEMENT: { label: 'UI/UX 개선', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
  OTHER:       { label: '기타', color: 'text-gray-500 bg-gray-100 dark:bg-white/8' },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: '대기중', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  COMPLETED: { label: '답변완료', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
};

const FILTERS: { value: string; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'PENDING', label: '대기중' },
  { value: 'COMPLETED', label: '답변완료' },
];

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function SuggestionItem({
  suggestion,
  onUpdated,
}: {
  suggestion: AdminSuggestionDto;
  onUpdated: (updated: AdminSuggestionDto) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [answer, setAnswer] = useState(suggestion.answer ?? '');
  const [saving, setSaving] = useState(false);

  const cat = CATEGORY_LABELS[suggestion.category] ?? {
    label: suggestion.category, color: 'text-gray-500 bg-gray-100 dark:bg-white/8',
  };
  const st = STATUS_LABELS[suggestion.status] ?? {
    label: suggestion.status, color: 'text-gray-400 bg-gray-100 dark:bg-white/8',
  };

  const handleSave = async () => {
    if (!answer.trim()) {
      toast.error('답변 내용을 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      const updated = await answerSuggestion(suggestion.id, { answer: answer.trim() });
      onUpdated(updated);
      toast.success('답변이 저장되었습니다.');
      setExpanded(false);
    } catch {
      toast.error('답변 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 shadow-sm flex flex-col gap-3">
      {/* 상단: 뱃지 + 상태 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
          {suggestion.pushAvailable && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-accent bg-accent/10"
              title="답변 시 푸시 알림이 발송됩니다"
            >
              🔔 푸시 가능
            </span>
          )}
        </div>
        <span className="text-[10px] text-gray-400 dark:text-[#666] shrink-0">{formatDate(suggestion.createDate)}</span>
      </div>

      {/* 제목/내용 */}
      <div>
        {suggestion.title && (
          <p className="text-sm font-semibold text-gray-900 dark:text-[#f0f0f0]">{suggestion.title}</p>
        )}
        <p className="text-sm text-gray-600 dark:text-[#a0a0a0] mt-1 whitespace-pre-wrap">{suggestion.content}</p>
      </div>

      {/* 작성자 */}
      <p className="text-xs text-gray-400 dark:text-[#666]">
        {suggestion.userName} · {suggestion.userEmail}
      </p>

      {/* 기존 답변 표시 */}
      {suggestion.answer && !expanded && (
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
          <p className="text-[10px] font-medium text-gray-400 dark:text-[#666] uppercase tracking-wide mb-1">
            답변{suggestion.answerDate ? ` · ${formatDate(suggestion.answerDate)}` : ''}
          </p>
          <p className="text-sm text-gray-700 dark:text-[#d0d0d0] whitespace-pre-wrap">{suggestion.answer}</p>
        </div>
      )}

      {/* 답변 작성/수정 영역 */}
      {expanded ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="답변 내용을 입력해주세요. 저장 시 건의자에게 푸시 알림이 발송됩니다."
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-[#d0d0d0] placeholder-gray-400 dark:placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => { setExpanded(false); setAnswer(suggestion.answer ?? ''); }}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-[#a0a0a0] bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 transition-all disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-accent text-white hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              {saving ? '저장 중...' : '답변 저장'}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="self-start px-4 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-200 dark:hover:bg-white/12 transition-all"
        >
          {suggestion.answer ? '답변 수정' : '답변 작성'}
        </button>
      )}
    </div>
  );
}

export default function AdminSuggestionsPage() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<AdminSuggestionDto[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAdminSuggestions(status || undefined);
      setSuggestions(
        data.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime())
      );
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 403) {
        setForbidden(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const handleUpdated = (updated: AdminSuggestionDto) => {
    setSuggestions(prev =>
      prev
        .map(s => (s.id === updated.id ? updated : s))
        // 상태 필터가 걸려 있으면 필터에 맞지 않게 된 항목은 목록에서 제외
        .filter(s => !filter || s.status === filter)
    );
  };

  if (forbidden) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-6 bg-gray-50 dark:bg-[#111]">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 dark:text-[#555] mb-4">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <p className="text-base font-semibold text-gray-700 dark:text-[#d0d0d0]">관리자 권한이 필요합니다</p>
        <p className="text-sm text-gray-400 dark:text-[#666] mt-1">이 페이지는 관리자만 접근할 수 있습니다.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-all"
        >
          홈으로 돌아가기
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50 dark:bg-[#111]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        {/* 헤더 */}
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-white/8 border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/12 transition-colors text-gray-500 dark:text-[#a0a0a0]"
            aria-label="뒤로가기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-[#f0f0f0]">건의사항 관리</h1>
        </header>

        {/* 상태 필터 */}
        <div className="flex gap-2 mb-5">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.value
                  ? 'bg-accent text-white'
                  : 'bg-white dark:bg-white/8 text-gray-600 dark:text-[#a0a0a0] border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/12'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-white/8 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-[#555]">
            <p className="text-sm">건의사항을 불러오지 못했습니다.</p>
            <button
              onClick={() => load(filter)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-[#a0a0a0] hover:bg-gray-200 dark:hover:bg-white/12 transition-all"
            >
              다시 시도
            </button>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-[#555]">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-50">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p className="text-sm">건의사항이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {suggestions.map(s => (
              <SuggestionItem key={s.id} suggestion={s} onUpdated={handleUpdated} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

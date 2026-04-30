"use client"

import React, { useRef, useState } from 'react';
import { extractTextFromImage } from '@/lib/ocrApi';
import toast from 'react-hot-toast';

interface OcrButtonProps {
  onExtract: (text: string) => void;
  className?: string;
}

export default function OcrButton({ onExtract, className = '' }: OcrButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await extractTextFromImage(file);
      if (result.text?.trim()) {
        onExtract(result.text.trim());
        toast.success('텍스트 추출 완료');
      } else {
        toast.error('텍스트를 인식하지 못했습니다.');
      }
    } catch {
      toast.error('OCR 처리에 실패했습니다.');
    } finally {
      setLoading(false);
      // 같은 파일 재선택 허용
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        title="이미지에서 텍스트 추출 (OCR)"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/60 border border-gray-200 dark:bg-white/5 dark:border-white/8 text-sm text-gray-600 dark:text-[#a0a0a0] hover:bg-white dark:hover:bg-white/10 transition-all disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
            <span>인식 중...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
            <span>이미지 OCR</span>
          </>
        )}
      </button>
    </>
  );
}

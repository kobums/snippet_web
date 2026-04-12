"use client";

import React, { useState, useRef, useEffect } from 'react';
import { sendVerificationCodeUseCase, verifyEmailCodeUseCase } from '@/core/di/authInstances';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const inputStyle = {
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  color: 'var(--lg-text-primary)',
  boxShadow: 'var(--lg-shadow-sm)',
} as React.CSSProperties;

const inputFocusStyle = {
  background: 'rgba(255, 255, 255, 0.4)',
  border: '1px solid rgba(26, 26, 26, 0.5)',
  boxShadow: '0 0 0 3px rgba(26, 26, 26, 0.08)',
} as React.CSSProperties;

export const VerifyEmailForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.replace('/register');
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...code];
    pasted.split('').forEach((char, i) => { next[i] = char; });
    setCode(next);
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('6자리 인증 코드를 모두 입력해 주세요.');
      return;
    }
    setError('');
    setIsVerifying(true);
    try {
      await verifyEmailCodeUseCase.execute({ email, code: fullCode });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message;
      setError(message || '인증에 실패했습니다.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      await sendVerificationCodeUseCase.execute({ email });
      setResendCooldown(60);
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message;
      setError(message || '재발송에 실패했습니다.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-dvh bg-liquid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-light tracking-tight mb-2"
            style={{ color: 'var(--lg-text-primary)' }}
          >
            Snippet
          </h1>
          <p
            className="text-sm font-light tracking-wide"
            style={{ color: 'var(--lg-text-secondary)' }}
          >
            블라인드 북 큐레이션
          </p>
        </div>

        <div className="liquid-card p-8 sm:p-10">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <p className="text-sm font-light mb-1" style={{ color: 'var(--lg-text-secondary)' }}>
                아래 이메일로 인증 코드를 보냈습니다
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--lg-text-primary)' }}>
                {email}
              </p>
            </div>

            {/* 6자리 입력 */}
            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  disabled={isVerifying}
                  className="w-11 h-14 text-center text-xl font-semibold rounded-2xl outline-none transition-all duration-300"
                  style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)}
                />
              ))}
            </div>

            {error && (
              <div
                className="text-xs text-center px-4 py-2.5 rounded-xl mb-4"
                style={{
                  background: 'rgba(255, 59, 48, 0.1)',
                  color: 'var(--lg-pass)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={isVerifying || code.join('').length < 6}
              className="liquid-button w-full py-3.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  확인 중...
                </span>
              ) : (
                '인증 완료'
              )}
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(0, 0, 0, 0.08)' }} />
              <span className="text-xs font-light" style={{ color: 'var(--lg-text-tertiary)' }}>또는</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(0, 0, 0, 0.08)' }} />
            </div>

            <div className="text-center flex flex-col gap-3">
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className="text-sm font-light transition-colors duration-200 disabled:opacity-40"
                style={{ color: 'var(--lg-text-secondary)' }}
              >
                {resendCooldown > 0
                  ? `재발송 (${resendCooldown}초 후 가능)`
                  : isResending
                  ? '발송 중...'
                  : '인증 코드 재발송'}
              </button>

              <Link
                href="/register"
                className="text-sm font-light transition-colors duration-200"
                style={{ color: 'var(--lg-text-tertiary)' }}
              >
                다른 이메일로 가입하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

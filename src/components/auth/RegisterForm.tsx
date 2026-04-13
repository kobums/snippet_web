"use client";

import React, { useState, useRef, useEffect } from 'react';
import { registerUseCase, sendVerificationCodeUseCase } from '@/core/di/authInstances';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const fieldStyle = {
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  color: 'var(--lg-text-primary)',
  boxShadow: 'var(--lg-shadow-sm)',
} as React.CSSProperties;

const fieldFocus = {
  background: 'rgba(255, 255, 255, 0.4)',
  border: '1px solid rgba(26, 26, 26, 0.5)',
  boxShadow: '0 0 0 3px rgba(26, 26, 26, 0.08)',
} as React.CSSProperties;

const fieldBase = { ...fieldStyle };

export const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 인증코드 관련 상태
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // 이메일이 바뀌면 인증 상태 리셋
  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (codeSent || emailVerified) {
      setCodeSent(false);
      setEmailVerified(false);
      setCode(['', '', '', '', '', '']);
      setCooldown(0);
    }
  };

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('올바른 이메일을 입력해 주세요.');
      return;
    }
    setError('');
    setIsSending(true);
    try {
      await sendVerificationCodeUseCase.execute({ email });
      setCodeSent(true);
      setCooldown(60);
      setCode(['', '', '', '', '', '']);
      setTimeout(() => codeRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message;
      setError(message || '인증 코드 발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) codeRefs.current[index + 1]?.focus();
    // 6자리 입력 완료 시 자동 인증 체크
    const full = next.join('');
    if (full.length === 6) setEmailVerified(false); // 제출 시 서버에서 검증
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...code];
    digits.split('').forEach((d, i) => { next[i] = d; });
    setCode(next);
    const last = Math.min(digits.length, 5);
    codeRefs.current[last]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeSent) {
      setError('이메일 인증을 먼저 진행해 주세요.');
      return;
    }
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('6자리 인증 코드를 입력해 주세요.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await registerUseCase.execute({ email, password, name, code: fullCode });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = (err as any)?.response?.data?.message;
      setError(message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
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
          <p className="text-sm font-light tracking-wide" style={{ color: 'var(--lg-text-secondary)' }}>
            블라인드 북 큐레이션
          </p>
        </div>

        <div className="liquid-card p-8 sm:p-10">
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* 이메일 + 발송 버튼 */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={e => handleEmailChange(e.target.value)}
                  required
                  disabled={isLoading || emailVerified}
                  className="flex-1 px-4 py-3.5 text-sm rounded-2xl outline-none transition-all duration-300"
                  style={fieldBase}
                  onFocus={e => Object.assign(e.target.style, fieldFocus)}
                  onBlur={e => Object.assign(e.target.style, fieldBase)}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSending || cooldown > 0 || emailVerified || !email}
                  className="px-4 py-3.5 text-xs font-medium rounded-2xl whitespace-nowrap transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: 'rgba(26, 26, 26, 0.08)',
                    border: '1px solid rgba(26, 26, 26, 0.12)',
                    color: 'var(--lg-text-primary)',
                  }}
                >
                  {isSending
                    ? '발송 중...'
                    : cooldown > 0
                    ? `${cooldown}초`
                    : codeSent
                    ? '재발송'
                    : '인증코드 발송'}
                </button>
              </div>

              {/* 인증코드 입력 (발송 후 표시) */}
              {codeSent && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-center" style={{ color: 'var(--lg-text-secondary)' }}>
                    이메일로 발송된 6자리 코드를 입력하세요
                  </p>
                  <div className="flex gap-1.5 justify-center" onPaste={handleCodePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { codeRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeChange(i, e.target.value)}
                        onKeyDown={e => handleCodeKeyDown(i, e)}
                        disabled={isLoading}
                        className="w-10 h-12 text-center text-lg font-semibold rounded-xl outline-none transition-all duration-300"
                        style={fieldBase}
                        onFocus={e => Object.assign(e.target.style, fieldFocus)}
                        onBlur={e => Object.assign(e.target.style, fieldBase)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 이름 */}
              <input
                type="text"
                placeholder="이름 (닉네임)"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3.5 text-sm rounded-2xl outline-none transition-all duration-300"
                style={fieldBase}
                onFocus={e => Object.assign(e.target.style, fieldFocus)}
                onBlur={e => Object.assign(e.target.style, fieldBase)}
              />

              {/* 비밀번호 */}
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3.5 text-sm rounded-2xl outline-none transition-all duration-300"
                style={fieldBase}
                onFocus={e => Object.assign(e.target.style, fieldFocus)}
                onBlur={e => Object.assign(e.target.style, fieldBase)}
              />

              {/* 에러 */}
              {error && (
                <div
                  className="text-xs text-center px-4 py-2.5 rounded-xl"
                  style={{
                    background: 'rgba(255, 59, 48, 0.1)',
                    color: 'var(--lg-pass)',
                    border: '1px solid rgba(255, 59, 48, 0.2)',
                  }}
                >
                  {error}
                </div>
              )}

              {/* 가입 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="liquid-button w-full py-3.5 text-sm font-medium mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    가입 중...
                  </span>
                ) : (
                  '회원가입 완료'
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(0, 0, 0, 0.08)' }} />
              <span className="text-xs font-light" style={{ color: 'var(--lg-text-tertiary)' }}>또는</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(0, 0, 0, 0.08)' }} />
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-light inline-flex items-center gap-1 transition-colors duration-200"
                style={{ color: 'var(--lg-text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--lg-text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--lg-text-secondary)'; }}
              >
                이미 계정이 있으신가요?
                <span className="font-medium" style={{ color: 'var(--lg-text-primary)' }}>로그인</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

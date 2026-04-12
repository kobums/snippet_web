"use client";

import React, { useState } from 'react';
import { registerUseCase } from '@/core/di/authInstances';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await registerUseCase.execute({ email, password, name });
      router.push(`/verify?email=${encodeURIComponent(result.email)}`);
    } catch (err: unknown) {
      const message = err instanceof Error && 'response' in err
        ? (err as any).response?.data?.message
        : undefined;
      setError(message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-liquid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        {/* 로고 영역 */}
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

        {/* 회원가입 카드 */}
        <div className="liquid-card p-8 sm:p-10">
          <div className="relative z-10">
            <h2
              className="text-center mb-8 font-light text-2xl tracking-tight"
              style={{ color: 'var(--lg-text-primary)' }}
            >
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* 이메일 입력 */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 text-sm rounded-2xl outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: 'var(--lg-text-primary)',
                    boxShadow: 'var(--lg-shadow-sm)',
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                    e.target.style.border = '1px solid rgba(26, 26, 26, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(26, 26, 26, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                    e.target.style.boxShadow = 'var(--lg-shadow-sm)';
                  }}
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 text-sm rounded-2xl outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: 'var(--lg-text-primary)',
                    boxShadow: 'var(--lg-shadow-sm)',
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                    e.target.style.border = '1px solid rgba(26, 26, 26, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(26, 26, 26, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                    e.target.style.boxShadow = 'var(--lg-shadow-sm)';
                  }}
                />
              </div>

              {/* 이름 입력 */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="이름 (닉네임)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 text-sm rounded-2xl outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    color: 'var(--lg-text-primary)',
                    boxShadow: 'var(--lg-shadow-sm)',
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                    e.target.style.border = '1px solid rgba(26, 26, 26, 0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(26, 26, 26, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.4)';
                    e.target.style.boxShadow = 'var(--lg-shadow-sm)';
                  }}
                />
              </div>

              {/* 에러 메시지 */}
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

              {/* 회원가입 버튼 */}
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

            {/* 구분선 */}
            <div className="flex items-center gap-4 my-6">
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(0, 0, 0, 0.08)' }}
              />
              <span
                className="text-xs font-light"
                style={{ color: 'var(--lg-text-tertiary)' }}
              >
                또는
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(0, 0, 0, 0.08)' }}
              />
            </div>

            {/* 로그인 링크 */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-light inline-flex items-center gap-1 transition-colors duration-200"
                style={{ color: 'var(--lg-text-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--lg-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--lg-text-secondary)';
                }}
              >
                이미 계정이 있으신가요?
                <span
                  className="font-medium"
                  style={{ color: 'var(--lg-text-primary)' }}
                >
                  로그인
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

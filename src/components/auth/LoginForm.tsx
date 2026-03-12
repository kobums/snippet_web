"use client";

import React, { useState } from 'react';
import { loginUseCase } from '@/core/di/authInstances';
import { useRouter } from 'next/navigation';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginUseCase.execute({ email, password });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error && 'response' in err
        ? (err as any).response?.data?.message
        : undefined;
      setError(message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[400px] mx-auto p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-center mb-6 text-gray-800 font-semibold">로그인</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-blue-500"
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full p-3.5 bg-blue-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors mt-2 hover:bg-blue-600"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

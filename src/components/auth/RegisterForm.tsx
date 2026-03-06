"use client";

import React, { useState } from 'react';
import { registerUseCase } from '@/core/di/authInstances';
import { useRouter } from 'next/navigation';

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerUseCase.execute({ email, password, name });
      router.push('/login');
    } catch (err: unknown) {
      const message = err instanceof Error && 'response' in err
        ? (err as any).response?.data?.message
        : undefined;
      setError(message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[400px] mx-auto p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-center mb-6 text-gray-800 font-semibold">회원가입</h2>
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
        <input
          type="text"
          placeholder="이름 (닉네임)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-blue-500"
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full p-3.5 bg-blue-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors mt-2 hover:bg-blue-600"
        >
          회원가입 완료
        </button>
      </form>
    </div>
  );
};

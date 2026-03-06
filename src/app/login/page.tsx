"use client";

import { LoginForm } from '../../components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f7fa] p-5">
      <div className="text-center mb-8">
        <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-2">Snippet</h1>
        <p className="text-base text-[#666666]">기록하고 싶은 모든 순간</p>
      </div>

      <LoginForm />

      <div className="mt-6 text-sm text-[#666666]">
        계정이 없으신가요?
        <Link href="/register" className="text-[#4a90e2] font-semibold ml-2 hover:underline">회원가입</Link>
      </div>
    </div>
  );
}

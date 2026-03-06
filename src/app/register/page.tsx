"use client";

import { RegisterForm } from '../../components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f7fa] p-5">
      <div className="text-center mb-8">
        <h1 className="text-[32px] font-bold text-[#1a1a1a] mb-2">Snippet</h1>
        <p className="text-base text-[#666666]">새로운 독서 여정을 시작하세요</p>
      </div>

      <RegisterForm />

      <div className="mt-6 text-sm text-[#666666]">
        이미 계정이 있으신가요?
        <Link href="/login" className="text-[#4a90e2] font-semibold ml-2 hover:underline">로그인</Link>
      </div>
    </div>
  );
}

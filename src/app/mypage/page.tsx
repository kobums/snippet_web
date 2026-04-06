"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/core/domain/entities/User';
import { deleteAccountUseCase } from '@/core/di/authInstances';
import toast from 'react-hot-toast';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccountUseCase.execute();
      toast.success('계정이 삭제되었습니다.');
      router.push('/login');
    } catch {
      toast.error('계정 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col content-layer">
      {/* 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #c8b6ff 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
          style={{
            background: "radial-gradient(circle, #a8d8ea 0%, transparent 70%)",
            bottom: "10%",
            right: "-5%",
          }}
        />
      </div>

      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 relative z-10">
        <button
          onClick={() => router.push('/')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
          style={{ color: "var(--lg-text-secondary)" }}
          aria-label="뒤로가기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1
          className="text-xl font-light tracking-[0.25em] uppercase"
          style={{ color: "var(--lg-text-secondary)" }}
        >
          내 정보
        </h1>
        <div className="w-8" />
      </header>

      {/* 콘텐츠 */}
      <section className="flex-1 flex flex-col items-center px-6 pt-8 relative z-10 gap-6">
        {/* 프로필 카드 */}
        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center gap-6">
          {/* 아바타 */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/60 to-blue-400/60 flex items-center justify-center text-white text-2xl font-light border border-white/20">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          {/* 유저 정보 */}
          <div className="w-full space-y-4">
            <div className="bg-white/5 rounded-2xl p-4">
              <label className="text-white/40 text-xs uppercase tracking-wider">이름</label>
              <p className="text-white text-base mt-1">{user?.name || '-'}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4">
              <label className="text-white/40 text-xs uppercase tracking-wider">이메일</label>
              <p className="text-white text-base mt-1">{user?.email || '-'}</p>
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full max-w-md py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl text-red-400 font-medium hover:bg-red-500/10 hover:border-red-500/20 transition-all"
        >
          로그아웃
        </button>

        {/* 계정 삭제 버튼 */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full max-w-md py-3 text-white/30 text-sm hover:text-red-400 transition-colors"
        >
          계정 삭제
        </button>
      </section>

      {/* 계정 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-8 flex flex-col gap-4">
            <h2 className="text-white text-lg font-semibold text-center">계정을 삭제하시겠습니까?</h2>
            <p className="text-white/60 text-sm text-center leading-relaxed">
              모든 독서 기록, 서재, 스니펫이 영구적으로 삭제됩니다.<br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="w-full py-3 bg-red-500/80 border border-red-400/30 rounded-2xl text-white font-medium hover:bg-red-500 transition-all disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '계정 삭제'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white transition-all"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client"

import AppShell from '@/components/layout/AppShell';
import RecordListPage from '@/components/pages/RecordListPage';

export default function ReviewPage() {
  return (
    <AppShell>
      <RecordListPage type="review" title="독서 리뷰" description="완독 후 남기는 리뷰입니다" />
    </AppShell>
  );
}

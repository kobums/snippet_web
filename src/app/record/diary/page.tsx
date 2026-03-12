"use client"

import AppShell from '@/components/layout/AppShell';
import RecordListPage from '@/components/pages/RecordListPage';

export default function DiaryPage() {
  return (
    <AppShell>
      <RecordListPage type="diary" title="독서 일기" description="책을 읽으며 느낀 감상을 기록합니다" />
    </AppShell>
  );
}

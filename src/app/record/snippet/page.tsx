"use client"

import AppShell from '@/components/layout/AppShell';
import RecordListPage from '@/components/pages/RecordListPage';

export default function SnippetRecordPage() {
  return (
    <AppShell>
      <RecordListPage type="snippet" title="밑줄 긋기" description="인상 깊은 문장을 기록합니다" />
    </AppShell>
  );
}

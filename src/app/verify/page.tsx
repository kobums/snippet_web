import { Suspense } from 'react';
import { VerifyEmailForm } from '@/components/auth/VerifyEmailForm';

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}

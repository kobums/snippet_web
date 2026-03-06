type ErrorSeverity = 'silent' | 'alert';

export function handleApiError(e: unknown, message: string, severity: ErrorSeverity = 'silent') {
  console.error(message, e);
  if (severity === 'alert') {
    alert(message);
  }
}

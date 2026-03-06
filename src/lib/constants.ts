export const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  wish: { text: '갖고싶은', color: 'bg-pink-500/20 text-pink-300' },
  waiting: { text: '대기중', color: 'bg-yellow-500/20 text-yellow-300' },
  reading: { text: '읽는중', color: 'bg-blue-500/20 text-blue-300' },
  completed: { text: '완독', color: 'bg-green-500/20 text-green-300' },
  dropped: { text: '중단', color: 'bg-white/10 text-white/50' },
};

export const TYPE_LABELS: Record<string, string> = {
  wish: '갖고싶은',
  have: '보유중',
  borrow: '빌린 책',
};

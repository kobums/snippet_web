export const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  wish: { text: '갖고싶은', color: 'bg-accent/20 text-accent' },
  waiting: { text: '대기중', color: 'bg-warning/20 text-warning' },
  reading: { text: '읽는중', color: 'bg-info/20 text-info' },
  completed: { text: '완독', color: 'bg-secondary/20 text-secondary' },
  dropped: { text: '중단', color: 'bg-white/10 text-white/50' },
};

export const TYPE_LABELS: Record<string, string> = {
  wish: '갖고싶은',
  have: '보유중',
  borrow: '빌린 책',
};

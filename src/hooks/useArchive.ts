"use client";

import { useState, useEffect, useCallback } from "react";

const LIKED_KEY = "snippet_liked_ids";
const SEEN_KEY = "snippet_seen_ids";

function getStoredIds(key: string): number[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setStoredIds(key: string, ids: number[]) {
  localStorage.setItem(key, JSON.stringify(ids));
}

export function useArchive() {
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [seenIds, setSeenIds] = useState<number[]>([]);

  useEffect(() => {
    setLikedIds(getStoredIds(LIKED_KEY));
    setSeenIds(getStoredIds(SEEN_KEY));
  }, []);

  const addLiked = useCallback((id: number) => {
    setLikedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      setStoredIds(LIKED_KEY, next);
      return next;
    });
  }, []);

  const addSeen = useCallback((id: number) => {
    setSeenIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      setStoredIds(SEEN_KEY, next);
      return next;
    });
  }, []);

  return { likedIds, seenIds, addLiked, addSeen };
}

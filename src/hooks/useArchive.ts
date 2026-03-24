"use client";

import { useState, useEffect, useCallback } from "react";
import { addArchive as addArchiveApi } from "@/lib/api";

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
  const [seenIds, setSeenIds] = useState<number[]>([]);

  useEffect(() => {
    setSeenIds(getStoredIds(SEEN_KEY));
  }, []);

  const addLiked = useCallback(async (id: number) => {
    try {
      await addArchiveApi(id);
    } catch {
      console.error("보관함 추가 실패");
    }
  }, []);

  const addSeen = useCallback((id: number) => {
    setSeenIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      setStoredIds(SEEN_KEY, next);
      return next;
    });
  }, []);

  return { seenIds, addLiked, addSeen };
}

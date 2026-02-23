import axios from "axios";
import { SnippetCard, SnippetArchive } from "@/types/snippet";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

export async function fetchCards(
  count: number = 10,
  excludeIds?: number[]
): Promise<SnippetCard[]> {
  const params: Record<string, string> = { count: String(count) };
  if (excludeIds && excludeIds.length > 0) {
    params.excludeIds = excludeIds.join(",");
  }
  const { data } = await api.get<SnippetCard[]>("/api/snippets/cards", {
    params,
  });
  return data;
}

export async function fetchArchive(ids: number[]): Promise<SnippetArchive[]> {
  const { data } = await api.get<SnippetArchive[]>("/api/snippets/archive", {
    params: { ids: ids.join(",") },
  });
  return data;
}

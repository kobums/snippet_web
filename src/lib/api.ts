import axios from "axios";
import { SnippetCard, SnippetArchive } from "@/types/snippet";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8008/api",
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      // 인증 관련 API 또는 공개 API(snippets/cards)에서는 리다이렉트하지 않음
      if (!requestUrl.startsWith("/auth/") && !requestUrl.startsWith("/snippets/cards") && typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function fetchCards(
  count: number = 10,
  excludeIds?: number[]
): Promise<SnippetCard[]> {
  const params: Record<string, string> = { count: String(count) };
  if (excludeIds && excludeIds.length > 0) {
    params.excludeIds = excludeIds.join(",");
  }
  const { data } = await api.get<SnippetCard[]>("/snippets/cards", {
    params,
  });
  return data;
}

export async function fetchArchive(): Promise<SnippetArchive[]> {
  const { data } = await api.get<SnippetArchive[]>("/snippets/archive");
  return data;
}

export async function addArchive(snippetId: number): Promise<void> {
  await api.post("/snippets/archive", { snippetId });
}

export async function removeArchive(snippetId: number): Promise<void> {
  await api.delete(`/snippets/archive/${snippetId}`);
}

export default api;

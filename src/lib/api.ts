import axios from "axios";
import { SnippetArchive, SnippetCardsResponse } from "@/types/snippet";

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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || "";

    if (requestUrl.startsWith("/auth/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("token");
        // 공개 엔드포인트(snippets/cards)는 리다이렉트 없이 에러만 전파
        if (!requestUrl.startsWith("/snippets/cards")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const refreshClient = axios.create({ baseURL: api.defaults.baseURL });
        const { data } = await refreshClient.post("/auth/refresh", { refreshToken });

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        error.config.headers.Authorization = `Bearer ${data.token}`;
        return api.request(error.config);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export async function fetchCards(
  count: number = 5,
  excludeIds?: number[]
): Promise<SnippetCardsResponse> {
  const params: Record<string, string> = { count: String(count) };
  if (excludeIds && excludeIds.length > 0) {
    params.excludeIds = excludeIds.join(",");
  }
  const { data } = await api.get<SnippetCardsResponse>("/snippets/cards", { params });
  return data;
}

export async function skipSnippet(snippetId: number): Promise<void> {
  await api.post(`/snippets/${snippetId}/skip`);
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

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

// 동시에 여러 요청이 401을 받아도 토큰 갱신은 한 번만 수행한다(single-flight).
// 백엔드가 refresh token을 회전시키므로, 각 요청이 옛 토큰으로 개별 갱신하면
// 첫 갱신 이후의 나머지가 모두 실패해 세션이 강제로 풀린다. 진행 중인 갱신이
// 있으면 그 결과(새 access token)를 공유해서 기다린다.
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("no refresh token");
    }
    const refreshClient = axios.create({ baseURL: api.defaults.baseURL });
    const { data } = await refreshClient.post("/auth/refresh", { refreshToken });
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.token as string;
  })();

  // 성공/실패와 무관하게 다음 갱신을 위해 캐시를 비운다.
  refreshPromise.finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
}

// 토큰 갱신을 시도하지 않을 엔드포인트: refresh 자신(무한루프 방지)과
// 비인증 엔드포인트(401이 토큰 만료가 아니라 자격 증명 실패를 의미).
// 반면 /auth/me, /auth/account는 인증이 필요하므로 401 시 갱신을 타야 한다.
const NO_REFRESH_PATHS = [
  "/auth/refresh",
  "/auth/login",
  "/auth/register",
  "/auth/emailcode",
  "/auth/verifycode",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";

    if (NO_REFRESH_PATHS.some((p) => requestUrl.startsWith(p))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && typeof window !== "undefined") {
      // 갱신 후 재시도한 요청이 또 401 → 세션 만료로 간주하고 강제 로그아웃
      // (iOS/Android 네이티브와 동일하게 "재시도 후에도 401이면 로그아웃")
      if (originalRequest._retry) {
        clearSession();
        if (!requestUrl.startsWith("/snippets/cards")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

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
        const newToken = await refreshAccessToken();

        originalRequest._retry = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api.request(originalRequest);
      } catch {
        clearSession();
        if (!requestUrl.startsWith("/snippets/cards")) {
          window.location.href = "/login";
        }
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

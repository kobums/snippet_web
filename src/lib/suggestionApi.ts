import api from './api';

export interface SuggestionDto {
  id: number;
  category: string;
  title: string;
  content: string;
  status: string;
  createDate: string;
}

export interface AddSuggestionRequest {
  category: string;
  title: string;
  content: string;
}

export const addSuggestion = async (data: AddSuggestionRequest): Promise<SuggestionDto> => {
  const response = await api.post<SuggestionDto>('/suggestions', data);
  return response.data;
};

export const getMySuggestions = async (): Promise<SuggestionDto[]> => {
  const response = await api.get<SuggestionDto[]>('/suggestions/mine');
  return response.data;
};

// ---------- 관리자용 (관리자 이메일만 허용, 비관리자는 403) ----------

export interface AdminSuggestionDto {
  id: number;
  userEmail: string;
  userName: string;
  pushAvailable: boolean;
  category: string; // "FEATURE" | "BUG" | "IMPROVEMENT" | "OTHER"
  title: string | null;
  content: string;
  status: string; // "PENDING" | "COMPLETED"
  answer: string | null;
  answerDate: string | null;
  createDate: string;
}

export interface AnswerSuggestionRequest {
  answer: string;
  status?: string;
}

export const getAdminSuggestions = async (status?: string): Promise<AdminSuggestionDto[]> => {
  const response = await api.get<AdminSuggestionDto[]>('/admin/suggestions', {
    params: status ? { status } : undefined,
  });
  return response.data;
};

export const answerSuggestion = async (
  id: number,
  data: AnswerSuggestionRequest
): Promise<AdminSuggestionDto> => {
  const response = await api.patch<AdminSuggestionDto>(`/admin/suggestions/${id}/answer`, data);
  return response.data;
};

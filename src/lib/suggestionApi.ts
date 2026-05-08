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

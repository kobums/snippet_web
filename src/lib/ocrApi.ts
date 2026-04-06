import api from './api';

export interface OcrResult {
  text: string;
}

export const extractTextFromImage = async (file: File, engine = 'google'): Promise<OcrResult> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('engine', engine);
  const response = await api.post<OcrResult>('/ocr/extract', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

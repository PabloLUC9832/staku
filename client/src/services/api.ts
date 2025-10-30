import axios from 'axios';
import type {Runner, ApiResponse} from '../types/runner.types';

//const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://staku.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminAPI = {
  uploadExcel: async (file: File): Promise<ApiResponse<null>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/admin/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  clearData: async (): Promise<ApiResponse<null>> => {
    const response = await api.delete('/admin/clear');
    return response.data;
  },
};

export const dataAPI = {
  getAllRunners: async (): Promise<ApiResponse<Runner[]>> => {
    const response = await api.get('/data');
    return response.data;
  },

  getRunnerById: async (id: number): Promise<ApiResponse<Runner>> => {
    const response = await api.get(`/data/${id}`);
    return response.data;
  },

  getRunnersByCategory: async (
      category: string
  ): Promise<ApiResponse<Runner[]>> => {
    const response = await api.get(`/data/category/${category}`);
    return response.data;
  },
};
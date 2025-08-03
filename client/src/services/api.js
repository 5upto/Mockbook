import axios from 'axios';

const API_BASE_URL = 'https://mockbook.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const bookAPI = {
  getBooks: async (params) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  getBookDetails: async (bookId, params) => {
    const response = await api.get(`/books/${bookId}`, { params });
    return response.data;
  },

  exportCSV: async (params) => {
    const response = await api.get('/books/export/csv', {
      params,
      responseType: 'blob'
    });
    return response;
  },

  generateRandomSeed: async () => {
    const response = await api.post('/books/random-seed');
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

export default api;
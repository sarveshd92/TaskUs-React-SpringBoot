import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('taskus_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ===== AUTH APIs =====
export const authAPI = {
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
};

// ===== TODO APIs =====
export const todoAPI = {
  getAll: (completed) => {
    const params = completed !== undefined ? { completed } : {};
    return api.get('/api/todos', { params });
  },

  getById: (id) => api.get(`/api/todos/${id}`),

  create: (todo) => api.post('/api/todos', todo),

  update: (id, todo) => api.patch(`/api/todos/${id}`, todo),

  toggle: (id) => api.patch(`/api/todos/${id}/toggle`),

  delete: (id) => api.delete(`/api/todos/${id}`),

  getCount: () => api.get('/api/todos/count'),
};

export default api;

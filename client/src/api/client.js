import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// Course APIs
export const courseAPI = {
  generateCourse: (topic) =>
    api.post('/courses/generate', { topic }),
  getCourses: () =>
    api.get('/courses'),
  getCourseById: (id) =>
    api.get(`/courses/${id}`),
  deleteCourse: (id) =>
    api.delete(`/courses/${id}`),
};

// Module APIs
export const moduleAPI = {
  getModuleById: (id) =>
    api.get(`/modules/${id}`),
};

// Lesson APIs
export const lessonAPI = {
  getLessonById: (id) =>
    api.get(`/lessons/${id}`),
};

export default api;

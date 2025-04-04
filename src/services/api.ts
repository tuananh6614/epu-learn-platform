
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Khởi tạo axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Service cho khóa học
export const courseService = {
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  
  getCourseById: async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  }
};

// Service cho tài liệu
export const documentService = {
  getAllDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },
  
  getDocumentsByCategory: async (categoryId: number) => {
    const response = await api.get(`/documents/category/${categoryId}`);
    return response.data;
  },
  
  getPurchasedDocuments: async (userId: number) => {
    const response = await api.get(`/documents/purchased/${userId}`);
    return response.data;
  }
};

// Service cho người dùng
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  
  register: async (fullName: string, email: string, password: string) => {
    const response = await api.post('/users/register', { 
      full_name: fullName, 
      email, 
      password 
    });
    return response.data;
  },
  
  getUserInfo: async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};

export default { courseService, documentService, authService };

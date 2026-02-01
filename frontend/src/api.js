import axios from 'axios';

const API_BASE_URL = 'https://ai-recommendation-system-viv.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),
  
  // Users
  getUsers: () => api.get('/api/users'),
  getUserInfo: (userId) => api.get(`/api/users/${userId}`),
  
  // Products
  getProducts: (params = {}) => api.get('/api/products', { params }),
  searchProducts: (query, limit = 10) => 
    api.get('/api/products/search', { params: { query, limit } }),
  getTopRatedProducts: (limit = 10) => 
    api.get('/api/products/top-rated', { params: { limit } }),
  
  // Recommendations
  getUserRecommendations: (userId, limit = 10) => 
    api.get(`/api/recommendations/user/${userId}`, { params: { limit } }),
  getHybridRecommendations: (userId, productName = null, limit = 10) => 
    api.get(`/api/recommendations/hybrid/${userId}`, { 
      params: productName ? { product_name: productName, limit } : { limit } 
    }),
  getContentBasedRecommendations: (productName, limit = 10) => 
    api.get(`/api/recommendations/content/${encodeURIComponent(productName)}`, { params: { limit } }),
  getSimilarProducts: (productName, limit = 5) => 
    api.get(`/api/recommendations/similar/${encodeURIComponent(productName)}`, { params: { limit } }),
  
  // Categories and Brands
  getCategories: () => api.get('/api/categories'),
  getBrands: () => api.get('/api/brands'),
};

export default api;

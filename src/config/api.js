// src/config/api.js

// Simple and safe approach for environment variables
export const API_BASE_URL = (() => {
  // Try Vite environment variables first
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to default
  return 'http://localhost:5000/api';
})();

// API endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  
  // Cart
  CART: '/cart',
  CART_ITEM: (id) => `/cart/${id}`,
  
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile'
};

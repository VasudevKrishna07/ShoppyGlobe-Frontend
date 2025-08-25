export const API_BASE_URL = (() => {
  // For Vite (React with Vite)
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // // For Create React App
  // if (typeof window !== 'undefined' && process.env?.REACT_APP_API_URL) {
  //   return process.env.REACT_APP_API_URL;
  // }
  
  // Fallback to default
  return 'http://localhost:5000/api';
})();

// API endpoints that match your backend
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/me',
  UPDATE_PASSWORD: '/auth/update-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  VERIFY_EMAIL: (token) => `/auth/verify-email/${token}`,
  REFRESH_TOKEN: '/auth/refresh-token',

  // Products endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCTS_SEARCH: '/products/search',
  PRODUCTS_FEATURED: '/products/featured',
  PRODUCTS_BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  PRODUCT_RELATED: (id) => `/products/${id}/related`,

  // Categories endpoints
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,

  // Cart endpoints
  CART: '/cart',
  CART_ADD: '/cart',
  CART_UPDATE_ITEM: (productId) => `/cart/${productId}`,
  CART_REMOVE_ITEM: (productId) => `/cart/${productId}`,
  CART_CLEAR: '/cart',

  // Orders endpoints
  ORDERS: '/orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  ORDER_CREATE: '/orders',
  ORDER_CANCEL: (id) => `/orders/${id}/cancel`,
  ORDER_RETURN: (id) => `/orders/${id}/return`,

  // Payments endpoints
  PAYMENT_CREATE_INTENT: '/payments/create-intent',
  PAYMENT_CONFIRM: '/payments/confirm',

  // Upload endpoints
  UPLOAD_SINGLE: '/upload/single',
  UPLOAD_MULTIPLE: '/upload/multiple',
  UPLOAD_AVATAR: '/upload/avatar',

  // Reviews endpoints
  REVIEWS: '/reviews',
  REVIEW_BY_ID: (id) => `/reviews/${id}`,
  PRODUCT_REVIEWS: (productId) => `/products/${productId}/reviews`
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export default API_BASE_URL;
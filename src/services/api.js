// src/services/api.js
import axiosInstance, { uploadFile } from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';

// Auth API Service
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ME);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_PASSWORD, passwordData);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await axiosInstance.put(API_ENDPOINTS.RESET_PASSWORD(token), { password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await axiosInstance.get(API_ENDPOINTS.VERIFY_EMAIL(token));
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN);
    return response.data;
  }
};

// Products API Service
export const productsAPI = {
  // Get all products with filters
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params });
    return response.data;
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  },

  // Search products
  search: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, { params });
    return response.data;
  },

  // Get featured products
  getFeatured: async (limit = 10) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS_FEATURED, {
      params: { limit }
    });
    return response.data;
  },

  // Get products by category
  getByCategory: async (categoryId, params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId), {
      params
    });
    return response.data;
  },

  // Get related products
  getRelated: async (productId, limit = 6) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_RELATED(productId), {
      params: { limit }
    });
    return response.data;
  },

  // Create product (admin/seller only)
  create: async (productData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },

  // Update product (admin/seller only)
  update: async (id, productData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCT_BY_ID(id), productData);
    return response.data;
  },

  // Delete product (admin/seller only)
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  }
};

// Categories API Service
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  // Get single category
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  },

  // Create category (admin only)
  create: async (categoryData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES, categoryData);
    return response.data;
  },

  // Update category (admin only)
  update: async (id, categoryData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
    return response.data;
  },

  // Delete category (admin only)
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
    return response.data;
  }
};

// Cart API Service
export const cartAPI = {
  // Get cart
  get: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART);
    return response.data;
  },

  // Add item to cart
  addItem: async (productId, quantity, variants = []) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CART_ADD, {
      productId,
      quantity,
      variants
    });
    return response.data;
  },

  // Update cart item quantity
  updateItem: async (productId, quantity) => {
    const response = await axiosInstance.put(API_ENDPOINTS.CART_UPDATE_ITEM(productId), {
      quantity
    });
    return response.data;
  },

  // Remove item from cart
  removeItem: async (productId) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART_REMOVE_ITEM(productId));
    return response.data;
  },

  // Clear cart
  clear: async () => {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART_CLEAR);
    return response.data;
  },

  // Validate cart items
  validate: async () => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.CART}/validate`);
    return response.data;
  }
};

// Orders API Service
export const ordersAPI = {
  // Get user orders
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDERS, { params });
    return response.data;
  },

  // Get single order
  getById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER_BY_ID(id));
    return response.data;
  },

  // Create order from cart
  create: async (orderData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDER_CREATE, orderData);
    return response.data;
  },

  // Cancel order
  cancel: async (id, reason) => {
    const response = await axiosInstance.put(API_ENDPOINTS.ORDER_CANCEL(id), { reason });
    return response.data;
  },

  // Request return
  requestReturn: async (id, returnData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ORDER_RETURN(id), returnData);
    return response.data;
  },

  // Track order
  track: async (orderNumber) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS}/track/${orderNumber}`);
    return response.data;
  }
};

// Payments API Service
export const paymentsAPI = {
  // Create payment intent
  createIntent: async (amount, currency = 'inr', metadata = {}) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT_CREATE_INTENT, {
      amount,
      currency,
      metadata
    });
    return response.data;
  },

  // Confirm payment
  confirm: async (paymentIntentId, shippingAddress) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENT_CONFIRM, {
      paymentIntentId,
      shippingAddress
    });
    return response.data;
  }
};

// Reviews API Service
export const reviewsAPI = {
  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_REVIEWS(productId), {
      params
    });
    return response.data;
  },

  // Create review
  create: async (reviewData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REVIEWS, reviewData);
    return response.data;
  },

  // Update review
  update: async (id, reviewData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.REVIEW_BY_ID(id), reviewData);
    return response.data;
  },

  // Delete review
  delete: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.REVIEW_BY_ID(id));
    return response.data;
  },

  // Mark review as helpful
  markHelpful: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.REVIEW_BY_ID(id)}/helpful`);
    return response.data;
  }
};

// Upload API Service
export const uploadAPI = {
  // Upload single file
  uploadSingle: async (file, onProgress) => {
    const response = await uploadFile(API_ENDPOINTS.UPLOAD_SINGLE, file, onProgress);
    return response.data;
  },

  // Upload multiple files
  uploadMultiple: async (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD_MULTIPLE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file, onProgress) => {
    const response = await uploadFile(API_ENDPOINTS.UPLOAD_AVATAR, file, onProgress);
    return response.data;
  }
};

// Admin API Service (for admin-specific endpoints)
export const adminAPI = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  },

  // Get all orders (admin only)
  getOrders: async (params = {}) => {
    const response = await axiosInstance.get('/admin/orders', { params });
    return response.data;
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status, notes) => {
    const response = await axiosInstance.put(`/admin/orders/${orderId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  // Get analytics (admin only)
  getAnalytics: async (dateRange = {}) => {
    const response = await axiosInstance.get('/admin/analytics', {
      params: dateRange
    });
    return response.data;
  }
};

// Health check API
export const healthAPI = {
  check: async () => {
    const response = await axiosInstance.get('/health');
    return response.data;
  }
};

export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  cart: cartAPI,
  orders: ordersAPI,
  payments: paymentsAPI,
  reviews: reviewsAPI,
  upload: uploadAPI,
  admin: adminAPI,
  health: healthAPI
};
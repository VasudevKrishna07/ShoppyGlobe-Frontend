// src/redux/productsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// --- Async fetch for products with filters and pagination
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 20, search, category, sort, sortOrder } = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.token;
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}?${params}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      // Expect: { success: true, data: { products, pagination } }
      const { products, pagination } = result.data;
      return { products, pagination };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

const initialState = {
  items: [],
  pagination: null,
  status: 'idle',      // idle | loading | succeeded | failed
  error: null,
  searchTerm: '',
  selectedCategory: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    toggleSort(state, action) {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'asc';
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error fetching products';
      });
  }
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  toggleSort
} = productsSlice.actions;

// --- Base selectors
export const selectAllProducts = (state) => state.products.items;
export const selectPagination = (state) => state.products.pagination;
export const selectStatus = (state) => state.products.status;
export const selectError = (state) => state.products.error;
export const selectSearchTerm = (state) => state.products.searchTerm;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;
export const selectSortOrder = (state) => state.products.sortOrder;

// --- Categories selector
export const selectCategories = createSelector(
  [selectAllProducts],
  (items) => ['All', ...Array.from(new Set(items.map((p) => p.category || 'Uncategorized')))]
);

// --- Filtered products without pagination
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSearchTerm, selectSelectedCategory],
  (items, searchTerm, selectedCategory) => {
    let filtered = items;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    return filtered;
  }
);

// --- Sorted products (client-side sorting)
export const selectSortedProducts = createSelector(
  [selectFilteredProducts, selectSortBy, selectSortOrder],
  (filtered, sortBy, sortOrder) => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });
  }
);

// --- Popular products (top-rated & in-stock)
export const selectPopularProducts = createSelector(
  [selectAllProducts],
  (items) =>
    items
      .filter((p) => p.rating >= 4.5 && p.stock > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
);

// --- Related products for ProductPage
export const selectRelatedProducts = createSelector(
  [selectAllProducts, (_, productId) => productId],
  (products, productId) => {
    const current = products.find((p) => p.id === productId || p._id === productId);
    if (!current) return [];
    return products
      .filter(
        (p) =>
          (p.category === current.category || p.category === current.category) &&
          (p.id !== productId && p._id !== productId) &&
          p.stock > 0
      )
      .slice(0, 4);
  }
);

export default productsSlice.reducer;

// src/redux/productsSlice.js

import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// --- Async fetch for products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth?.token;
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      return data.products || data; // Support both array and { products: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',      // idle | loading | succeeded | failed
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  sortBy: 'title',
  sortOrder: 'asc',
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Error fetching products';
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  toggleSort,
} = productsSlice.actions;

// --- Base selectors
export const selectAllProducts = (state) => state.products.items;
export const selectStatus      = (state) => state.products.status;
export const selectError       = (state) => state.products.error;
export const selectSearchTerm = (state) => state.products.searchTerm;

// Select the currently selected category
export const selectSelectedCategory = (state) => state.products.selectedCategory;

// --- Categories selector
export const selectCategories = createSelector(
  [selectAllProducts],
  (items) => ['All', ...new Set(items.map((p) => p.category))]
);

// --- Filtered products
export const selectFilteredProducts = createSelector(
  [
    selectAllProducts,
    (state) => state.products.searchTerm,
    (state) => state.products.selectedCategory,
  ],
  (items, searchTerm, selectedCategory) => {
    let filtered = items;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    return filtered;
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

// --- Sorted & filtered products
export const selectSortedProducts = createSelector(
  [
    selectFilteredProducts,
    (state) => state.products.sortBy,
    (state) => state.products.sortOrder,
  ],
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

// --- Related products for ProductPage
export const selectRelatedProducts = createSelector(
  [selectAllProducts, (_, productId) => productId],
  (products, productId) => {
    const current = products.find((p) => p.id === productId);
    if (!current) return [];
    return products
      .filter(
        (p) =>
          p.category === current.category &&
          p.id !== productId &&
          p.stock > 0
      )
      .slice(0, 4);
  }
);

export default productsSlice.reducer;

// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

// --- Helper: Load from localStorage (fallback)
const loadCart = () => {
  try {
    const serialized = localStorage.getItem('shoppy_cart');
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
};

// --- Helper: Save to localStorage (backup)
const saveCart = (cart) => {
  try {
    localStorage.setItem('shoppy_cart', JSON.stringify(cart));
  } catch {
    // Ignore write errors
  }
};

// --- Async Thunks for Backend Integration

// Fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    try {
      const token = getState().auth?.token;
      if (!token) {
        const items = loadCart();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { items, total, source: 'localStorage' };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart from server');
      }
      
      const data = await response.json();
      return { ...data, source: 'backend' };
    } catch {
      const items = loadCart();
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items, total, source: 'localStorage' };
    }
  }
);

// Add item to cart (backend + localStorage)
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productId, quantity = 1, product }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      
      if (!token) {
        return { 
          type: 'localStorage', 
          product: { ...product, quantity },
          productId 
        };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add to cart' }));
        return rejectWithValue(errorData.message);
      }
      
      const data = await response.json();
      return { ...data, type: 'backend' };
    } catch {
      return { 
        type: 'localStorage', 
        product: { ...product, quantity },
        productId,
        fallback: true
      };
    }
  }
);

// Update cart item quantity
export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItemAsync',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      
      if (!token) {
        return { type: 'localStorage', productId, quantity };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_ITEM(productId)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update cart item' }));
        return rejectWithValue(errorData.message);
      }
      
      const data = await response.json();
      return { ...data, type: 'backend' };
    } catch {
      return { type: 'localStorage', productId, quantity, fallback: true };
    }
  }
);

// Remove item from cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      
      if (!token) {
        return { type: 'localStorage', productId };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_ITEM(productId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to remove from cart' }));
        return rejectWithValue(errorData.message);
      }
      
      return { productId, type: 'backend' };
    } catch {
      return { type: 'localStorage', productId, fallback: true };
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(), // Start from localStorage
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    total: loadCart().reduce((sum, item) => sum + (item.price * item.quantity), 0),
    source: 'localStorage' // Track data source
  },
  reducers: {
    // Local actions (for immediate UI updates)
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      saveCart(state.items);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        saveCart(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      state.total = 0;
      saveCart([]);
    },
    syncCartFromLocalStorage(state) {
      state.items = loadCart();
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.source = action.payload.source;
        state.error = null;
        
        // If backend data, also save to localStorage as backup
        if (action.payload.source === 'backend') {
          saveCart(state.items);
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cart';
      })

      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (action.payload.type === 'backend') {
          // Backend success - update with server data
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
          saveCart(state.items);
        } else {
          // localStorage fallback
          const item = action.payload.product;
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            state.items.push(item);
          }
          state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          saveCart(state.items);
        }
        state.error = null;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add to cart';
      })

      // Update cart item
      .addCase(updateCartItemAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (action.payload.type === 'backend') {
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
          saveCart(state.items);
        } else {
          // localStorage fallback
          const { productId, quantity } = action.payload;
          const item = state.items.find((i) => i.id === productId);
          if (item && quantity > 0) {
            item.quantity = quantity;
            state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            saveCart(state.items);
          }
        }
        state.error = null;
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update cart item';
      })

      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.id !== action.payload.productId);
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        saveCart(state.items);
        state.error = null;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to remove from cart';
      });
  }
});

// --- Actions (export both local and async)
export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  syncCartFromLocalStorage 
} = cartSlice.actions;

// --- Enhanced Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.total;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartSource = (state) => state.cart.source;

// --- Reducer
export default cartSlice.reducer;

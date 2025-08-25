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

// --- Helper: Get auth headers
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

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
        return { items, total: total, totalItems: items.reduce((sum, item) => sum + item.quantity, 0), source: 'localStorage' };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART}`, {
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        // If cart doesn't exist (404), return empty cart
        if (response.status === 404) {
          return { items: [], total: 0, totalItems: 0, source: 'backend' };
        }
        throw new Error('Failed to fetch cart from server');
      }
      
      const data = await response.json();
      
      // Backend returns: { success: true, data: { cart: {...} } }
      if (data.success && data.data?.cart) {
        const cart = data.data.cart;
        const processedItems = cart.items?.map(item => ({
          id: item.product._id,
          _id: item.product._id,
          title: item.product.title,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          thumbnail: item.product.thumbnail,
          product: item.product
        })) || [];
        
        return {
          items: processedItems,
          total: cart.totalAmount || 0,
          totalItems: cart.totalItems || 0,
          source: 'backend'
        };
      }
      
      return { items: [], total: 0, totalItems: 0, source: 'backend' };
    } catch  {
      const items = loadCart();
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items, total, totalItems: items.reduce((sum, item) => sum + item.quantity, 0), source: 'localStorage' };
    }
  }
);

// Add item to cart (backend + localStorage)
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productId, quantity = 1, product }, { getState }) => {
    try {
      const token = getState().auth?.token;
      
      if (!token) {
        return { 
          type: 'localStorage', 
          product: { ...product, quantity, id: product._id || product.id },
          productId 
        };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_ADD}`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ productId, quantity })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to add to cart' }));
        throw new Error(errorData.message || 'Failed to add to cart');
      }
      
      const data = await response.json();
      
      // Backend returns: { success: true, data: { cart: {...} } }
      if (data.success && data.data?.cart) {
        const cart = data.data.cart;
        const processedItems = cart.items?.map(item => ({
          id: item.product._id,
          _id: item.product._id,
          title: item.product.title,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          thumbnail: item.product.thumbnail,
          product: item.product
        })) || [];
        
        return {
          items: processedItems,
          total: cart.totalAmount || 0,
          totalItems: cart.totalItems || 0,
          type: 'backend'
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      // Fallback to localStorage
      return { 
        type: 'localStorage', 
        product: { ...product, quantity, id: product._id || product.id },
        productId,
        fallback: true,
        error: error.message
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

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_REMOVE_ITEM(productId)}`, {
          method: 'DELETE',
          headers: getAuthHeaders(token)
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }
        
        const data = await response.json();
        
        if (data.success && data.data?.cart) {
          const cart = data.data.cart;
          const processedItems = cart.items?.map(item => ({
            id: item.product._id,
            _id: item.product._id,
            title: item.product.title,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            thumbnail: item.product.thumbnail,
            product: item.product
          })) || [];
          
          return {
            items: processedItems,
            total: cart.totalAmount || 0,
            totalItems: cart.totalItems || 0,
            type: 'backend',
            removed: true
          };
        }
      } else {
        // Update quantity
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_UPDATE_ITEM(productId)}`, {
          method: 'PUT',
          headers: getAuthHeaders(token),
          body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update cart item');
        }
        
        const data = await response.json();
        
        if (data.success && data.data?.cart) {
          const cart = data.data.cart;
          const processedItems = cart.items?.map(item => ({
            id: item.product._id,
            _id: item.product._id,
            title: item.product.title,
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            thumbnail: item.product.thumbnail,
            product: item.product
          })) || [];
          
          return {
            items: processedItems,
            total: cart.totalAmount || 0,
            totalItems: cart.totalItems || 0,
            type: 'backend'
          };
        }
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      return rejectWithValue(error.message);
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

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_REMOVE_ITEM(productId)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
      
      const data = await response.json();
      
      if (data.success && data.data?.cart) {
        const cart = data.data.cart;
        const processedItems = cart.items?.map(item => ({
          id: item.product._id,
          _id: item.product._id,
          title: item.product.title,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          thumbnail: item.product.thumbnail,
          product: item.product
        })) || [];
        
        return {
          items: processedItems,
          total: cart.totalAmount || 0,
          totalItems: cart.totalItems || 0,
          productId,
          type: 'backend'
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear entire cart
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      
      if (!token) {
        return { type: 'localStorage' };
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CART_CLEAR}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      return { type: 'backend' };
    } catch (error) {
      return rejectWithValue(error.message);
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
    totalItems: loadCart().reduce((sum, item) => sum + item.quantity, 0),
    source: 'localStorage', // Track data source
    lastAddedItem: null, // For showing notifications
    isCartOpen: false // For UI state
  },
  reducers: {
    // Local actions (for immediate UI updates)
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items.find((i) => (i.id || i._id) === (item.id || item._id));
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({ 
          ...item, 
          quantity: item.quantity || 1,
          id: item.id || item._id 
        });
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.lastAddedItem = item;
      saveCart(state.items);
    },
    
    removeFromCart(state, action) {
      const itemId = action.payload;
      state.items = state.items.filter((i) => (i.id || i._id) !== itemId);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      saveCart(state.items);
    },
    
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => (i.id || i._id) === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        saveCart(state.items);
      }
    },
    
    clearCart(state) {
      state.items = [];
      state.total = 0;
      state.totalItems = 0;
      state.lastAddedItem = null;
      saveCart([]);
    },
    
    syncCartFromLocalStorage(state) {
      state.items = loadCart();
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // UI actions
    openCart(state) {
      state.isCartOpen = true;
    },
    
    closeCart(state) {
      state.isCartOpen = false;
    },
    
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    
    clearLastAddedItem(state) {
      state.lastAddedItem = null;
    },
    
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.totalItems = action.payload.totalItems || 0;
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
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (action.payload.type === 'backend') {
          // Backend success - update with server data
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
          state.totalItems = action.payload.totalItems || 0;
          state.lastAddedItem = action.payload.items?.find(item => 
            item.id === action.meta.arg.productId
          );
          saveCart(state.items);
        } else {
          // localStorage fallback
          const item = action.payload.product;
          const existingItem = state.items.find((i) => (i.id || i._id) === (item.id || item._id));
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            state.items.push(item);
          }
          state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
          state.lastAddedItem = item;
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
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (action.payload.type === 'backend') {
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
          state.totalItems = action.payload.totalItems || 0;
          saveCart(state.items);
        } else {
          // localStorage fallback
          const { productId, quantity } = action.payload;
          if (quantity <= 0) {
            state.items = state.items.filter(item => (item.id || item._id) !== productId);
          } else {
            const item = state.items.find((i) => (i.id || i._id) === productId);
            if (item) {
              item.quantity = quantity;
            }
          }
          state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
          saveCart(state.items);
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
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (action.payload.type === 'backend') {
          state.items = action.payload.items || [];
          state.total = action.payload.total || 0;
          state.totalItems = action.payload.totalItems || 0;
        } else {
          // localStorage fallback
          state.items = state.items.filter(item => (item.id || item._id) !== action.payload.productId);
          state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        }
        saveCart(state.items);
        state.error = null;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to remove from cart';
      })

      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
        state.total = 0;
        state.totalItems = 0;
        state.lastAddedItem = null;
        saveCart([]);
        state.error = null;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to clear cart';
      });
  }
});

// --- Actions (export both local and async)
export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  syncCartFromLocalStorage,
  openCart,
  closeCart,
  toggleCart,
  clearLastAddedItem,
  clearError
} = cartSlice.actions;

// --- Enhanced Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.totalItems;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectCartSource = (state) => state.cart.source;
export const selectLastAddedItem = (state) => state.cart.lastAddedItem;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;

// Helper selectors
export const selectCartItemById = (state, itemId) => 
  state.cart.items.find(item => (item.id || item._id) === itemId);

export const selectCartItemCount = (state, itemId) => {
  const item = selectCartItemById(state, itemId);
  return item ? item.quantity : 0;
};

export const selectIsItemInCart = (state, itemId) => 
  Boolean(selectCartItemById(state, itemId));

// --- Reducer
export default cartSlice.reducer;
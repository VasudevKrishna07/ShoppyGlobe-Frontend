// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

// 1. Persist config for products slice
const productsPersistConfig = {
  key: 'products',
  storage,
  blacklist: ['status', 'error', 'searchTerm', 'selectedCategory', 'sortBy', 'sortOrder']
};


const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['status', 'error']
};

// 2. Wrap the products reducer with persistReducer
const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// 3. Configure store
export const store = configureStore({
  reducer: {
    products: persistedProductsReducer,
    cart: cartReducer,
    auth: persistedAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// 4. Create persistor
export const persistor = persistStore(store);

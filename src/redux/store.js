import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const productsPersistConfig = {
  key: 'products',
  storage,
  blacklist: ['status', 'error', 'searchTerm', 'selectedCategory', 'sortBy', 'sortOrder', 'pagination'],
};

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['status', 'error'],
};

const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    products: persistedProductsReducer,
    cart: cartReducer, // Not persisted currently
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['products.status', 'products.error', 'auth.status', 'auth.error'],
      },
    }),
  // Use import.meta.env instead of process.env for Vite compatibility
  devTools: import.meta.env.MODE !== 'production',
});

export const persistor = persistStore(store);

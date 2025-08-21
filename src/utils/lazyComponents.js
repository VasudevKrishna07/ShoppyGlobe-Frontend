// src/utils/lazyComponents.js
import { lazy } from 'react';

export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyShop = lazy(() => import('../pages/Shop'));
export const LazyCart = lazy(() => import('../pages/CartPage'));
export const LazyProductDetails = lazy(() => import('../pages/ProductDetails'));
export const LazyAbout = lazy(() => import('../pages/About'));
export const LazyNotFound = lazy(() => import('../pages/NotFound'));
export const LazyCheckout = lazy(() => import('../pages/Checkout'));
export const LazyProductPage = lazy(() => import('../pages/ProductPage'));
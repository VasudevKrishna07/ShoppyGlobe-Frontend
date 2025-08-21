// src/utils/lazyComponents.js

import { lazy } from 'react';


// Main pages
export const LazyHome = lazy(() => import('../pages/Home'));
export const LazyAbout = lazy(() => import('../pages/About'));

// Shopping related pages  
export const LazyShop = lazy(() => import('../components/ProductList'));
export const LazyCart = lazy(() => import('../pages/CartPage'));
export const LazyCheckout = lazy(() => import('../pages/Checkout'));

// Product pages
export const LazyProductDetails = lazy(() => import('../pages/ProductPage'));

// Error pages
export const LazyNotFound = lazy(() => import('../components/NotFound'));

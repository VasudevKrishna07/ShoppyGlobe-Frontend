// src/App.jsx

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Lazy-loaded components for performance optimization
import { 
  LazyHome, 
  LazyShop, 
  LazyCart, 
  LazyProductDetails, 
  LazyAbout, 
  LazyNotFound,
  LazyCheckout 
} from './utils/lazyComponents';

// Global layout components (not lazy-loaded for better UX)
import Header from './components/Header';
import FooterComponent from './components/FooterComponent';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Main App Component
 * Handles routing, global state, and layout structure
 */
export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ErrorBoundary>
          <Router>
            <div className="flex flex-col min-h-screen">
              
              {/* Always visible header */}
              <Header />

              {/* Main content area with lazy-loaded routes */}
              <main className="flex-1 bg-gray-50">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Home page */}
                    <Route path="/" element={<LazyHome />} />

                    {/* Shop page (all products with filters) */}
                    <Route path="/shop" element={<LazyShop />} />

                    {/* Category filter page */}
                    <Route path="/category/:category" element={<LazyShop />} />

                    {/* Product detail page */}
                    <Route path="/product/:id" element={<LazyProductDetails />} />

                    {/* Shopping cart */}
                    <Route path="/cart" element={<LazyCart />} />

                    {/* Checkout process */}
                    <Route path="/checkout" element={<LazyCheckout />} />

                    {/* About page */}
                    <Route path="/about" element={<LazyAbout />} />

                    {/* 404 Not Found - catch all invalid routes */}
                    <Route path="*" element={<LazyNotFound />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Always visible footer */}
              <FooterComponent />
            </div>
          </Router>
        </ErrorBoundary>
      </ToastProvider>
    </Provider>
  );
}

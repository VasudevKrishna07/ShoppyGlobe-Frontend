// src/App.jsx

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Lazy-loaded components
import { 
  LazyHome, 
  LazyShop, 
  LazyCart, 
  LazyProductDetails, 
  LazyAbout, 
  LazyNotFound,
  LazyCheckout 
} from './utils/lazyComponents';

// Global layout components
import Header from './components/Header';
import FooterComponent from './components/FooterComponent';
import LoadingSpinner from './components/LoadingSpinner';
import ToastProvider from './contexts/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <ErrorBoundary>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 bg-gray-50">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<LazyHome />} />
                    <Route path="/shop" element={<LazyShop />} />
                    <Route path="/category/:category" element={<LazyShop />} />
                    <Route path="/product/:id" element={<LazyProductDetails />} />
                    <Route path="/cart" element={<LazyCart />} />
                    <Route path="/checkout" element={<LazyCheckout />} />
                    <Route path="/about" element={<LazyAbout />} />
                    <Route path="*" element={<LazyNotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <FooterComponent />
            </div>
          </Router>
        </ErrorBoundary>
      </ToastProvider>
    </Provider>
  );
}
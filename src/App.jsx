import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import FooterComponent from './components/FooterComponent';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import FloatingSearch from './components/FloatingSearch';

import { getCurrentUser } from './redux/authSlice';
import { fetchCart } from './redux/cartSlice';

// Lazy-loaded pages
const LazyHome            = React.lazy(() => import('./pages/Home'));
const LazyShop            = React.lazy(() => import('./pages/Shop'));
const LazyProductPage     = React.lazy(() => import('./pages/ProductPage'));
const LazyCart            = React.lazy(() => import('./pages/CartPage'));
const LazyCheckout        = React.lazy(() => import('./pages/Checkout'));
const LazyAbout           = React.lazy(() => import('./pages/About'));
const LazyNotFound        = React.lazy(() => import('./components/NotFound'));

function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const { token, status: authStatus } = useSelector(state => state.auth);

  useEffect(() => {
    if (token && authStatus === 'idle') {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, authStatus]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  // Show spinner while auth is initializing
  if (authStatus === 'loading') {
    return <LoadingSpinner fullPage />;
  }

  return children;
}

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
          <Router>
            <AppInitializer>
              <div className="flex flex-col min-h-screen">
                <Header />

                <main className="flex-1 bg-gray-50">
                  <Suspense fallback={<LoadingSpinner fullPage />}>
                    <Routes>
                      <Route path="/" element={<LazyHome />} />
                      <Route path="/shop" element={<LazyShop />} />
                      <Route path="/category/:category" element={<LazyShop />} />
                      <Route path="/product/:id" element={<LazyProductPage />} />
                      <Route path="/cart" element={<LazyCart />} />
                      <Route path="/checkout" element={<LazyCheckout />} />
                      <Route path="/about" element={<LazyAbout />} />
                      <Route path="*" element={<LazyNotFound />} />
                    </Routes>
                  </Suspense>
                </main>

                <FooterComponent />
                <FloatingSearch />
                <Toaster position="top-right" />
              </div>
            </AppInitializer>
          </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;

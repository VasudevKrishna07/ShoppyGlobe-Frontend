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
import FloatingSearch from './components/FloatingSearch';

export default function App() {
  // const [iconWhite, setIconWhite] = useState(false);

  // useEffect(() => {
  //   const headerEl = document.querySelector('header');
  //   if (!headerEl) return;

  //   // Convert ‘rgb(r, g, b)’ to relative luminance L in [0…1]
  //   const getRelativeLuminance = (rgb) => {
  //     const vals = rgb.match(/\d+/g).map(n => parseInt(n, 10) / 255).map((v) => {
  //       return (v <= 0.03928)
  //         ? v / 12.92
  //         : Math.pow((v + 0.055) / 1.055, 2.4);
  //     });
  //     const [r, g, b] = vals;
  //     return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  //   };

  //   const onScroll = () => {
  //     const bgColor = getComputedStyle(headerEl).backgroundColor;
  //     const luminance = getRelativeLuminance(bgColor);
  //     // If background is dark (luminance ≤ 0.2), use white icon
  //     setIconWhite(luminance <= 0.2);
  //   };

  //   window.addEventListener('scroll', onScroll);
  //   onScroll(); // initial check
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, []);


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

              <FloatingSearch />
            </div>
          </Router>
        </ErrorBoundary>
      </ToastProvider>
    </Provider>
  );
}
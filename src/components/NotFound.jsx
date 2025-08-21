// src/components/NotFound.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

/**
 * NotFound Component - 404 Error Page
 * Shows the invalid route and provides navigation options
 */
export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-white to-purple-50">
      
      {/* 404 Number Display */}
      <div className="mb-8">
        <h1 className="text-[120px] md:text-[150px] font-black text-purple-600 opacity-20 leading-none select-none">
          404
        </h1>
      </div>

      {/* Error Icon */}
      <div className="mb-6 p-4 bg-purple-100 rounded-full">
        <FiAlertCircle className="w-16 h-16 text-purple-600" />
      </div>

      {/* Headline */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-600 max-w-lg mb-4 text-lg leading-relaxed">
        Oops! The page you are looking for doesn't exist or has been moved.  
        Let's get you back to something interesting.
      </p>

      {/* Show invalid route */}
      <div className="mb-8 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md w-full">
        <p className="text-sm text-red-600 mb-1">
          <strong>Invalid route:</strong>
        </p>
        <code className="text-red-800 font-mono text-sm break-all">
          {location.pathname}
        </code>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-200"
        >
          <FiHome className="w-5 h-5" />
          Go Home
        </Link>

        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-purple-300 text-purple-600 font-medium hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
        >
          <FiShoppingBag className="w-5 h-5" />
          Browse Products
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>

      {/* Helpful Links */}
      <div className="border-t border-gray-200 pt-6 max-w-md w-full">
        <p className="text-sm text-gray-500 mb-3">You might be looking for:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/cart" className="text-purple-600 hover:text-purple-800 hover:underline text-sm transition-colors">
            Shopping Cart
          </Link>
          <Link to="/about" className="text-purple-600 hover:text-purple-800 hover:underline text-sm transition-colors">
            About Us
          </Link>
          <a href="/contact" className="text-purple-600 hover:text-purple-800 hover:underline text-sm transition-colors">
            Contact Support
          </a>
        </div>
      </div>

      {/* Fun fact */}
      <div className="mt-8 text-xs text-gray-400 max-w-sm">
        <p>
          💡 <strong>Did you know?</strong> HTTP 404 was named after room 404 at CERN, 
          where the original web servers were located.
        </p>
      </div>
    </div>
  );
}
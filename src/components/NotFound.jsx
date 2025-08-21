// src/components/NotFound.jsx
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-white to-purple-50">
      {/* Illustration */}
      <img
        src="../assets/404-illustration.svg" // Add your own SVG in public/assets
        alt="Page not found"
        className="w-full max-w-md mb-6"
      />

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-600 max-w-lg mb-8">
        Oops! The page you are looking for doesn’t exist or has been moved.  
        Let’s get you back to something interesting.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white font-medium shadow hover:bg-purple-700 transition"
        >
          <FiHome className="w-5 h-5" />
          Go Home
        </Link>

        <Link
          to="/shop"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-purple-400 text-purple-600 font-medium hover:bg-purple-50 transition"
        >
          <FiShoppingBag className="w-5 h-5" />
          Browse Products
        </Link>
      </div>
    </div>
  );
}

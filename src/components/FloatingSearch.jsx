// src/components/FloatingSearch.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSearchTerm } from '../redux/productsSlice';
import { FiSearch, FiX } from 'react-icons/fi';


export default function FloatingSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handle search submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      dispatch(setSearchTerm(searchValue.trim()));
      if (location.pathname !== '/shop') {
        navigate('/shop');
      }
      setIsOpen(false);
      setSearchValue('');
    }
  };

  /**
   * Toggle search modal
   */
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => {
        document.getElementById('floating-search-input')?.focus();
      }, 100);
    }
  };

  /**
   * Close modal on backdrop click
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Search Button - Only visible on mobile */}
      <button
        onClick={toggleSearch}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.2),rgba(255,255,255,0.4))] bg-gradient-to-br backdrop-blur-md rounded-md shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-110 text-gray-950"
        aria-label="Open search"
      >
        <FiSearch className="w-8 h-8" />
      </button>

      {/* Search Modal - Only visible on mobile when open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-gray-950/50 animate-fade-in"
          onClick={handleBackdropClick}
        >
          {/* Search Panel */}
          <div className="w-full max-w-sm mx-4 mb-4 bg-white rounded-t-2xl p-6 shadow-2xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-950">Search Products</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-700 hover:text-gray-950 transition-colors"
                aria-label="Close search"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-950 w-5 h-5" />
                <input
                  id="floating-search-input"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoComplete="off"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!searchValue.trim()}
                  className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 border border-gray-700 text-gray-950 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Quick Search Suggestions (Optional) */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {['Electronics', 'Clothing', 'Home', 'Beauty'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchValue(term);
                      dispatch(setSearchTerm(term));
                      navigate('/shop');
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// src/components/ProductList.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectFilteredProducts,
  selectCategories,
  selectStatus,
  selectError,
  selectSearchTerm,
  selectSelectedCategory,
  setSearchTerm,
  setSelectedCategory,
} from '../redux/productsSlice';
import ProductItem from './ProductItem';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

export default function ProductList() {
  const dispatch = useDispatch();

  // Individual memoized selectors
  const status           = useSelector(selectStatus);
  const error            = useSelector(selectError);
  const searchTerm       = useSelector(selectSearchTerm);
  const selectedCategory = useSelector(selectSelectedCategory);

  const products   = useSelector(selectFilteredProducts);
  const categories = useSelector(selectCategories);

  const [sortOption, setSortOption] = useState('title');

  // Fetch products once on mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Sort locally
  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortOption === 'price')  return copy.sort((a, b) => a.price - b.price);
    if (sortOption === 'rating') return copy.sort((a, b) => b.rating - a.rating);
    if (sortOption === 'title')  return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy;
  }, [products, sortOption]);

  return (
    <section className="container mx-auto px-4 py-8">

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">

        {/* Search */}
        <div className="relative md:w-[90%] mx-auto w-full lg:w-1/3">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            id="product-search"
            name="productSearch"
            autoComplete="off"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="h-10 border rounded-md pl-10 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
        </div>

        <div className="relative w-full md:w-[90%] mx-auto lg:w-1/3 flex justify-between items-center">
        {/* Category */}
        <select
          id="product-category"
          name="category"
          value={selectedCategory}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
          className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          id="product-sort"
          name="sortOption"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="title">Sort by: Title</option>
          <option value="price">Sort by: Price</option>
          <option value="rating">Sort by: Rating</option>
        </select>
        </div>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-gray-100 h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {status === 'failed' && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <FiRefreshCw /> Retry
          </button>
        </div>
      )}

      {/* Product Grid */}
      {status === 'succeeded' && sortedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* No Results */}
      {status === 'succeeded' && sortedProducts.length === 0 && (
        <p className="text-center py-8 text-gray-500">No products found.</p>
      )}
    </section>
  );
}

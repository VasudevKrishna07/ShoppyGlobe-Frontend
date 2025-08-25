import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectPagination,
  selectStatus,
  selectError,
  selectSearchTerm,
  selectSelectedCategory,
  selectSortBy,
  selectSortOrder,
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setSortOrder
} from '../redux/productsSlice';

import ProductItem from './ProductItem';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

export default function ProductList() {
  const dispatch = useDispatch();

  const status           = useSelector(selectStatus);
  const error            = useSelector(selectError);
  const searchTerm       = useSelector(selectSearchTerm);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortBy           = useSelector(selectSortBy);
  const sortOrder        = useSelector(selectSortOrder);
  const pagination       = useSelector(selectPagination);

  const products = useSelector(state => state.products.items);

  const [page, setPage]        = useState(1);
  const [limit]                = useState(20);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, search: searchTerm, category: selectedCategory, sort: sortBy, sortOrder }));
  }, [dispatch, page, limit, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Local filters
  const handleSearchChange = (e) => {
    setPage(1);
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setPage(1);
    dispatch(setSelectedCategory(e.target.value));
  };

  const handleSortChange = (e) => {
    const [newSort, newOrder] = e.target.value.split(':');
    dispatch(setSortBy(newSort));
    dispatch(setSortOrder(newOrder));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchProducts({ page, limit, search: searchTerm, category: selectedCategory, sort: sortBy, sortOrder }))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
          {/* Search */}
          <input
            type="text"
            id="product-search"
            name="productSearch"
            placeholder="Search products..."
            autoComplete="off"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded-md px-4 py-2 w-full lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Category */}
          <select
            id="product-category"
            name="productCategory"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {/* Replace with your categories list */}
            <option value="">All Categories</option>
            {/* ... */}
          </select>

          {/* Sort */}
          <select
            id="product-sort"
            name="productSort"
            value={`${sortBy}:${sortOrder}`}
            onChange={handleSortChange}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="rating:desc">Top Rated</option>
            <option value="title:asc">Name A–Z</option>
            <option value="title:desc">Name Z–A</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductItem key={product.id || product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </ErrorBoundary>
  );
}

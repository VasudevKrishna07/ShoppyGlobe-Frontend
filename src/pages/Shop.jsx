import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectAllProducts,
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
import ProductItem from '../components/ProductItem';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Shop() {
  const dispatch            = useDispatch();
  const products            = useSelector(selectAllProducts);
  const pagination          = useSelector(selectPagination);
  const status              = useSelector(selectStatus);
  const error               = useSelector(selectError);
  const searchTerm          = useSelector(selectSearchTerm);
  const selectedCategory    = useSelector(selectSelectedCategory);
  const sortBy              = useSelector(selectSortBy);
  const sortOrder           = useSelector(selectSortOrder);

  const [page, setPage]  = useState(1);
  const limit = 20;

  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts({
      page,
      limit,
      search: searchTerm,
      category: selectedCategory,
      sort: sortBy,
      sortOrder
    }));
  }, [dispatch, page, limit, searchTerm, selectedCategory, sortBy, sortOrder]);

  const onSearchChange = (e) => {
    setPage(1);
    dispatch(setSearchTerm(e.target.value));
  };

  const onCategoryChange = (e) => {
    setPage(1);
    dispatch(setSelectedCategory(e.target.value));
  };

  const onSortChange = (e) => {
    const [newSort, newOrder] = e.target.value.split(':');
    dispatch(setSortBy(newSort));
    dispatch(setSortOrder(newOrder));
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        {/* Filters & Sort */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
          <input
            type="text"
            id="shop-search"
            name="shopSearch"
            placeholder="Search..."
            autoComplete="off"
            value={searchTerm}
            onChange={onSearchChange}
            className="border rounded-md px-4 py-2 w-full lg:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            id="shop-category"
            name="shopCategory"
            value={selectedCategory}
            onChange={onCategoryChange}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            {/* Populate with categories */}
          </select>

          <select
            id="shop-sort"
            name="shopSort"
            value={`${sortBy}:${sortOrder}`}
            onChange={onSortChange}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="price:asc">Price Low → High</option>
            <option value="price:desc">Price High → Low</option>
            <option value="rating:desc">Top Rated</option>
            <option value="title:asc">Name A → Z</option>
            <option value="title:desc">Name Z → A</option>
          </select>
        </div>

        {/* Loading State */}
        {status === 'loading' && <LoadingSpinner fullPage />}

        {/* Error State */}
        {status === 'failed' && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts({ page, limit }))}
              className="px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {status === 'succeeded' && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductItem key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* No Results */}
        {status === 'succeeded' && products.length === 0 && (
          <p className="text-center text-gray-500 py-8">No products found.</p>
        )}

        {/* Pagination */}
        {status === 'succeeded' && pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

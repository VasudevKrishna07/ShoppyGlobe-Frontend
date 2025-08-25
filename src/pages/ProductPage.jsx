import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductDetail from '../components/ProductDetail';
import ProductItem from '../components/ProductItem';
import {
  selectAllProducts,
  selectRelatedProducts,
  selectStatus,
  selectError,
  fetchProducts
} from '../redux/productsSlice';
import { FiHome, FiChevronRight } from 'react-icons/fi';

export default function ProductPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const allProducts      = useSelector(selectAllProducts);
  const relatedProducts  = useSelector(state => selectRelatedProducts(state, id));
  const status           = useSelector(selectStatus);
  const error            = useSelector(selectError);

  const currentProduct = allProducts.find(p => (p._id || p.id) === id);

  // Ensure products are loaded
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="flex items-center text-purple-600 hover:underline">
            <FiHome className="mr-1" /> Home
          </Link>
          <FiChevronRight className="mx-2" />
          <Link to="/shop" className="hover:underline">
            Shop
          </Link>
          {currentProduct && (
            <>
              <FiChevronRight className="mx-2" />
              <Link
                to={`/category/${currentProduct.category}`}
                className="hover:underline"
              >
                {currentProduct.category}
              </Link>
              <FiChevronRight className="mx-2" />
              <span className="text-gray-700">{currentProduct.title}</span>
            </>
          )}
        </nav>

        {/* Product Detail */}
        {status === 'loading' && (
          <p className="text-center py-20 text-gray-500">Loading product...</p>
        )}
        {status === 'failed' && (
          <p className="text-center text-red-500 py-20">{error}</p>
        )}
        {status === 'succeeded' && currentProduct && (
          <ProductDetail product={currentProduct} />
        )}
        {status === 'succeeded' && !currentProduct && (
          <p className="text-center text-gray-500 py-20">Product not found.</p>
        )}

        {/* Related Products */}
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductItem key={product._id || product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

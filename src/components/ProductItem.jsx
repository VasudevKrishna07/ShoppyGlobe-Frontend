// src/components/ProductItem.jsx

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../redux/cartSlice';
import { FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import useToast from '../hooks/useToast';


function ProductItem({ product }) {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.cart);
  const { addToast } = useToast();

  /**
   * Handles adding product to cart with loading state and notifications
   * @param {Event} e - Click event
   */
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation when clicking add to cart
    e.stopPropagation(); // Prevent event bubbling

    // Don't proceed if product is out of stock
    if (product.stock === 0) {
      addToast('Product is out of stock', 'error');
      return;
    }

    try {
      // Dispatch add to cart action with product details
      await dispatch(addToCartAsync({
        productId: product.id,
        quantity: 1,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail || product.image,
          stock: product.stock
        }
      })).unwrap();

      // Show success notification
      addToast(`${product.title} added to cart!`, 'success');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      // Show error notification with proper error handling
      addToast('Failed to add product to cart', 'error');
    }
  };

  // Calculate discount percentage if available
  const discountPercentage = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  
  // Calculate original price before discount
  const originalPrice = discountPercentage > 0 
    ? Math.round(product.price / (1 - discountPercentage / 100)) 
    : null;

  // Format rating for display
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col w-full tablet-full-width">
      
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.thumbnail || product.image || '/assets/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback image on load error
              e.target.src = '/assets/placeholder-product.jpg';
            }}
          />
        </Link>

        {/* Stock Badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full backdrop-blur-sm
            ${product.stock > 0 
              ? 'bg-green-100/90 text-green-700 border border-green-200' 
              : 'bg-red-100/90 text-red-700 border border-red-200'
            }`}
        >
          {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
        </span>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col p-4">
        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="block group-hover:text-purple-600 transition-colors">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-2 leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {product.description || 'No description available'}
        </p>

        {/* Rating Display */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {/* Render star rating */}
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < fullStars 
                    ? 'text-yellow-400 fill-current' 
                    : i === fullStars && hasHalfStar
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline mb-4">
          <span className="text-xl font-bold text-purple-600">
            ${product.price}
          </span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${product.stock > 0 
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
              ${status === 'loading' ? 'opacity-50 cursor-wait' : ''}
            `}
            disabled={product.stock === 0 || status === 'loading'}
            aria-label={`Add ${product.title} to cart`}
          >
            <FiShoppingCart className="w-4 h-4" />
            {status === 'loading' ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
          </button>
          
          <Link
            to={`/product/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-purple-200 text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
            aria-label={`View details for ${product.title}`}
          >
            <FiEye className="w-4 h-4" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * PropTypes for type checking and documentation
 */
ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number,
    stock: PropTypes.number,
    thumbnail: PropTypes.string,
    image: PropTypes.string,
    discountPercentage: PropTypes.number
  }).isRequired
};

/**
 * Default props for optional values
 */
ProductItem.defaultProps = {
  product: {
    description: '',
    rating: 0,
    stock: 0,
    discountPercentage: 0
  }
};

// Memoize component to prevent unnecessary re-renders
export default memo(ProductItem);

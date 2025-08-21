// src/components/ProductItem.jsx
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../redux/cartSlice';
import { memo } from 'react';
import { FiShoppingCart, FiEye } from 'react-icons/fi';

function ProductItem({ product }) {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.cart);

  const handleAddToCart = () => {
    dispatch(addToCartAsync({
      productId: product.id,
      quantity: 1,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || product.image
      }
    }));
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail || product.image || '/placeholder.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Stock Badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full 
            ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-purple-600">${product.price}</p>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            disabled={product.stock === 0 || status === 'loading'}
          >
            <FiShoppingCart className="w-4 h-4" />
            {status === 'loading' ? 'Adding...' : 'Add'}
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            <FiEye className="w-4 h-4" />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    rating: PropTypes.number,
    stock: PropTypes.number,
    thumbnail: PropTypes.string,
    image: PropTypes.string
  }).isRequired
};

export default memo(ProductItem);

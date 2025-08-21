// src/components/CartItem.jsx
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import { memo } from 'react';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  const handleQuantityChange = (e) => {
    const qty = parseInt(e.target.value, 10);
    if (qty > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: qty }));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all duration-300">
      
      {/* Product Image */}
      <div className="flex items-center gap-4 w-full sm:w-1/2">
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
          <img
            src={item.thumbnail}
            alt={`${item.title} thumbnail`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
          <p className="text-sm text-gray-600 capitalize">{item.brand || '—'}</p>
          <span className="text-purple-600 font-bold">${item.price}</span>
        </div>
      </div>
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
        {/* Quantity Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor={`qty-${item.id}`} className="text-sm text-gray-600">Qty:</label>
          <input
            id={`qty-${item.id}`}
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="border rounded-md w-16 text-center py-1 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        {/* Subtotal */}
        <div className="text-sm font-semibold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="px-3 py-1 rounded-md border border-red-400 text-red-500 hover:bg-red-50 hover:border-red-500 transition-colors text-sm"
          aria-label={`Remove ${item.title} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ✅ PropTypes for runtime type safety
CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    brand: PropTypes.string,
  }).isRequired,
};

// ✅ React.memo to prevent unnecessary re-renders
export default memo(CartItem);

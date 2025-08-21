// src/pages/CartPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartCount,
  selectCartStatus,
  selectCartError,
  fetchCart
  // removeFromCartAsync, 
  // updateCartItemAsync  
} from '../redux/cartSlice';
import Cart from '../components/Cart';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const dispatch = useDispatch();
  
  // Use individual selectors (no duplicate)
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);

  useEffect(() => {
    dispatch(fetchCart()); // Load cart on mount
  }, [dispatch]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2">Loading cart...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            <h2 className="font-semibold mb-2">Error loading cart</h2>
            <p>{error}</p>
            <button
              onClick={() => dispatch(fetchCart())}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!items || items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h1>
            <Link
              to="/shop"
              className="inline-flex items-center mt-2 text-purple-600 hover:underline text-sm"
            >
              <FiArrowLeft className="mr-1" /> Continue Shopping
            </Link>
          </div>
          {items.length > 0 && (
            <div className="text-lg font-semibold text-gray-800">
              Total: ${total.toFixed(2)}
            </div>
          )}
        </div>

        {/* Cart Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Cart /> {/* This is our enhanced Cart component */}
        </div>

        {/* Checkout Section */}
        {items.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <p className="text-gray-600">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  ${total.toFixed(2)}
                </p>
                <Link
                  to="/checkout"
                  className="mt-2 inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

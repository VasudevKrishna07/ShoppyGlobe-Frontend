import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCartTotal, selectCartItems } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';

export default function Cart() {
  const cart = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  // Persist cart state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('shoppy_cart', JSON.stringify(cart));
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        {/* Replace this img src with your actual empty cart SVG or image path */}
        <img
          src="https://cdn3.iconfinder.com/data/icons/shopping-and-ecommerce-29/90/empty_cart-512.png"
          alt="Empty Cart Illustration"
          className="w-64 mb-6"
        />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven’t added anything to your cart yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-1/3 bg-white border rounded-lg shadow p-6 sticky top-20">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 max-h-[calc(100vh-150px)] overflow-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-gray-700"
              >
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block mt-6 w-full text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

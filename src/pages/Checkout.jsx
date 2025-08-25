// src/pages/Checkout.jsx
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../redux/cartSlice';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function Checkout() {
  const cart = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    payment: 'card',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (!form[field]) {
        newErrors[field] = 'Required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Here you'd send the order to the backend or payment gateway
    // For now, just navigate to a success screen or clear cart
    alert('Order placed successfully!');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
        <p className="text-lg mb-4">Your cart is empty.</p>
        <Link to="/" className="text-purple-600 hover:underline inline-flex items-center">
          <FiArrowLeft className="mr-1" />
          Go back to shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="checkout-name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="checkout-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Enter your full name"
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="checkout-email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="checkout-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter your email address"
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="checkout-address" className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <textarea
                id="checkout-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                autoComplete="street-address"
                placeholder="Enter your street address"
                rows="3"
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* City, ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-city" className="block text-sm font-medium mb-1">
                  City
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  placeholder="Enter city"
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="checkout-zip" className="block text-sm font-medium mb-1">
                  ZIP / Postal Code
                </label>
                <input
                  id="checkout-zip"
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  placeholder="Enter ZIP code"
                  className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="checkout-country" className="block text-sm font-medium mb-1">
                Country
              </label>
              <input
                id="checkout-country"
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                autoComplete="country-name"
                placeholder="Enter country"
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
            </div>

            {/* Payment */}
            <div>
              <label htmlFor="checkout-payment" className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <select
                id="checkout-payment"
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <aside className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-8 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item._id || item.id || item.productId} className="flex justify-between text-sm">
                <span className="truncate pr-2">
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-3 mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Tax</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Items in your order ({cart.length})
            </h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item._id || item.id || item.productId} className="flex items-center text-xs text-gray-600">
                  <div className="w-10 h-10 bg-gray-200 rounded mr-2 flex-shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="truncate">{item.title}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
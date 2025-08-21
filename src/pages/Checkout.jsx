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
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
            </div>

            {/* City, ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ZIP / Postal Code</label>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${errors.zip ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.zip && <p className="text-xs text-red-500">{errors.zip}</p>}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.country && <p className="text-xs text-red-500">{errors.country}</p>}
            </div>

            {/* Payment */}
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
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
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.title} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

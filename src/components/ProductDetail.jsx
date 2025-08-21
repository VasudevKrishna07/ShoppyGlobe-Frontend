// src/components/ProductDetail.jsx
import { useParams, Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useState } from 'react';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(`https://dummyjson.com/products/${id}`);
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return <p className="p-6 text-center">Loading product details...</p>;
  }

  if (error || !product) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load product. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center text-purple-600 hover:underline mb-6">
        <FiArrowLeft className="mr-1" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div>
          <div className="border rounded-lg overflow-hidden mb-4">
            <img
              src={mainImage || product.thumbnail}
              alt={product.title}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`border rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 ${
                    mainImage === img ? 'border-purple-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold text-purple-600 mb-4">${product.price}</p>

          {/* Rating and Stock */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-600">{product.rating} / 5</span>
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-6">
            <label htmlFor="qty" className="text-sm font-medium">
              Quantity
            </label>
            <input
              id="qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="border rounded w-20 text-center py-1 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => dispatch(addToCart({ ...product, quantity }))}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <FiShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="px-6 py-3 border rounded-lg border-purple-600 text-purple-600 hover:bg-purple-50 transition">
              Buy Now
            </button>
          </div>

          {/* Category */}
          <p className="text-sm text-gray-500 mb-2">
            Category:{" "}
            <Link to={`/category/${product.category}`} className="text-purple-600 hover:underline">
              {product.category}
            </Link>
          </p>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* We can map actual related products here later */}
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-400"
            >
              Related Product {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

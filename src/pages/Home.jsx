// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProducts,
  selectPopularProducts,
  selectCategories,
} from '../redux/productsSlice';
import ProductItem from '../components/ProductItem';

export default function Home() {
  const dispatch = useDispatch();

  const popularProducts = useSelector(selectPopularProducts);
  const categories = useSelector(selectCategories);
  const { status } = useSelector((state) => state.products);

  // Fetch products on first load
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HERO */}
      <section className="relative min-h-[calc(90vh)] ring-3 ring-blue-950 border-b-3 bg-gradient-to-r from-blue-950 to-indigo-400 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome to <span className="text-yellow-300">ShoppyGlobe</span>
            </h1>
            <p className="text-lg mb-6">
              Discover amazing products at unbeatable prices — shop the latest trends and top deals now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                Shop Now
              </Link>
              <Link
                to="/category/All"
                className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-purple-700 transition"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/assets/hero-shopping.webp"
              alt="Shopping hero"
              className="w-full rounded-2xl max-w-lg mx-auto md:my-15 lg:my-0"
            />
          </div>
        </div>
        {/* Feature highlights for medium screens only */}
        <div className="hidden md:block pb-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2 gap-2">
                <div className="w-24 h-24 shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 border-3 ring-gray-950 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-gray-950 via-blue-950 to-gray-950 rounded-full flex items-center justify-center">

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -2 45 37" className="" fill="none" stroke='white' id="shipping">
                      <path d="M25.24 25.31H13.3a1.25 1.25 0 0 1 0-2.5H25.24a1.25 1.25 0 0 1 0 2.5zM32.12 25.31h-.3a1.25 1.25 0 0 1 0-2.5h.3a.62.62 0 0 0 .63-.62V17.9a.63.63 0 0 0-.48-.61H24.9a3.13 3.13 0 0 1-3.13-3.12V7.47a.61.61 0 0 0-.62-.62H6.42a1.25 1.25 0 0 1 0-2.5H21.15a3.12 3.12 0 0 1 3.12 3.12v6.68a.62.62 0 0 0 .63.62h7.22a3.82 3.82 0 0 1 .68.07l.22.07a3.1 3.1 0 0 1 2.23 3v4.29A3.13 3.13 0 0 1 32.12 25.31z"></path>
                      <path d="M32.55 17.33a1.24 1.24 0 0 1-1.17-.83l-2-5.56a.6.6 0 0 0-.47-.25H23a1.25 1.25 0 0 1 0-2.5h5.91a3.08 3.08 0 0 1 2.7 1.62 1.42 1.42 0 0 1 .08.18l2 5.67a1.26 1.26 0 0 1-.76 1.6A1.54 1.54 0 0 1 32.55 17.33zM28.53 30.65a4.55 4.55 0 1 1 4.55-4.55A4.55 4.55 0 0 1 28.53 30.65zm0-6.6a2.05 2.05 0 1 0 2 2.05A2.05 2.05 0 0 0 28.53 24.05zM10 30.65a4.55 4.55 0 1 1 4.55-4.55A4.55 4.55 0 0 1 10 30.65zm0-6.6a2.05 2.05 0 1 0 2.05 2.05A2.05 2.05 0 0 0 10 24.05z"></path>
                      <path d="M23 25.31a1.24 1.24 0 0 1-1.25-1.25V13.13a1.25 1.25 0 1 1 2.5 0V24.06A1.24 1.24 0 0 1 23 25.31zM10.19 13.17H2a1.25 1.25 0 0 1 0-2.5h8.19a1.25 1.25 0 0 1 0 2.5zM11.73 18.75H7.45a1.25 1.25 0 1 1 0-2.5h4.28a1.25 1.25 0 0 1 0 2.5z"></path>
                    </svg>
                  
                </div>
                <span className="text-[18px] font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 gap-2">
                <div className="w-24 h-24 shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 border-3 ring-gray-950 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-gray-950 via-blue-950 to-gray-950 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill='none' stroke='white' viewBox="-4 -2 32 27" id="return">
                    <g id="Layer_2">
                      <g>
                        <path d="M8,10H5c-0.55225,0-1,0.44727-1,1s0.44775,1,1,1h3c2.20557,0,4-1.79395,4-4s-1.79443-4-4-4H5.41406l1.29297-1.29297
                        c0.39062-0.39062,0.39062-1.02344,0-1.41406s-1.02344-0.39062-1.41406,0L2.29382,4.29211
                        C2.20123,4.38446,2.12793,4.49518,2.07709,4.61792C1.97601,4.8623,1.97607,5.1377,2.07715,5.38208
                        c0.05078,0.12274,0.12408,0.23346,0.21667,0.32581l2.99915,2.99915C5.48828,8.90234,5.74414,9,6,9
                        s0.51172-0.09766,0.70703-0.29297c0.39062-0.39062,0.39062-1.02344,0-1.41406L5.41406,6H8c1.10303,0,2,0.89746,2,2
                        S9.10303,10,8,10z"></path>
                        <path d="M20.66602,9.53027C19.93164,8.57227,18.77295,8,17.56543,8h-1.57446c-0.02386-1.04749-0.49481-2.04877-1.31372-2.75684
                        c-0.41846-0.36133-1.05029-0.31543-1.41064,0.10352c-0.36084,0.41797-0.31494,1.04883,0.10303,1.41016
                        C13.77637,7.10742,14,7.57812,14,8.08105V9v8H8.48743C8.03064,16.39642,7.31354,16,6.5,16
                        c-0.75244,0-1.42029,0.341-1.87903,0.86871c-0.67749-0.24017-1.19043-0.79004-1.29431-1.46344L3.25049,14.9082
                        c-0.24756-1.60547-0.31201-3.24023-0.19092-4.85938c0.0415-0.5498-0.37158-1.03027-0.92236-1.07129
                        C1.57764,8.92969,1.10645,9.34961,1.06543,9.90039c-0.13281,1.76953-0.0625,3.55664,0.2085,5.31152l0.07617,0.49707
                        c0.22156,1.43524,1.28992,2.59467,2.67743,3.06305C4.16516,20.02167,5.21472,21,6.5,21c1.20721,0,2.2171-0.86005,2.4494-2H15
                        h1.0506c0.2323,1.13995,1.24219,2,2.4494,2c1.26685,0,2.3053-0.95026,2.46704-2.17401C22.14545,18.42114,23,17.31409,23,16
                        v-1.37695c0-1.31836-0.44141-2.62109-1.24268-3.66797L20.66602,9.53027z M21,16c0,0.40442-0.24377,0.74933-0.5896,0.90674
                        C19.95142,16.35736,19.27014,16,18.5,16c-0.81354,0-1.53064,0.39642-1.98743,1H16v-7h1.56543
                        c0.58887,0,1.15479,0.2793,1.5127,0.74707l1.09131,1.4248C20.70508,12.87109,21,13.74121,21,14.62305V16z"></path>
                      </g>
                    </g>
                  </svg>
                </div>
                <span className="text-[18px] font-medium">Easy Returns</span>
              </div>
              <div className="flex items-center space-x-2 gap-2">
                <div className="w-24 h-24 shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 border-3 ring-gray-950 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-gray-950 via-blue-950 to-gray-950 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill='' viewBox="0 0 500 500" id="24-hour-services">
                    <path fill="white" d="M195.224 209.963c-11.796 8.417-19.28 16.842-22.448 24.375-3.275 6.704-5.015 13.662-5.223 22.662H245v-21h-49.386c1.403-2 3.13-4.119 5.184-5.887 2.051-1.765 5.865-4.488 11.435-8.438l8.903-6.246c7.498-5.3 12.887-10.072 16.166-14.387 4.998-6.495 7.498-13.908 7.498-22.275 0-10.913-3.538-19.674-10.612-26.299-7.074-6.626-16.593-9.935-28.558-9.935-15.137 0-25.671 5.762-31.601 17.038-3.121 5.924-4.864 13.428-5.227 23.428h21.591c.259-6 1.091-11.084 2.493-13.995 2.443-5.04 7.041-7.621 13.797-7.621 4.936 0 8.731 1.556 11.38 4.724 2.651 3.171 3.975 7.131 3.975 11.911 0 5.873-2.313 11.27-6.937 16.206C212.086 197.396 205.462 202.635 195.224 209.963zM335 215h-13v-71h-24.9L256 212.379V231h44v26h22v-26h13V215zM300 215h-27.915L300 165.724V215z"></path>
                    <polygon fill="white" points="171 296 155 296 155 279 144 279 144 324 155 324 155 303 171 303 171 324 180 324 180 279 171 279"></polygon>
                    <path fill="white" d="M208.963 278.225c-6.329 0-11.165 1.723-14.509 5.168-4.487 4.064-6.729 10.152-6.729 18.264 0 7.949 2.242 14.038 6.729 18.264 3.344 3.444 8.18 5.166 14.509 5.166 6.328 0 11.163-1.722 14.509-5.166 4.466-4.225 6.698-10.314 6.698-18.264 0-8.112-2.232-14.199-6.698-18.264C220.126 279.948 215.29 278.225 208.963 278.225zM217.688 313.191c-2.153 2.703-5.061 4.055-8.726 4.055s-6.589-1.352-8.771-4.055c-2.183-2.704-3.275-6.549-3.275-11.535 0-4.987 1.092-8.832 3.275-11.536 2.183-2.703 5.107-4.055 8.771-4.055s6.573 1.357 8.726 4.071 3.229 6.553 3.229 11.52C220.917 306.642 219.841 310.487 217.688 313.191zM264 306.77c0 3.042-.678 5.263-1.396 6.663-1.118 2.481-3.702 3.722-7.433 3.722-3.751 0-6.081-1.241-7.198-3.722-.719-1.4-.973-3.621-.973-6.663V279h-10v27.793c0 4.706.843 8.37 2.303 10.994 2.739 4.806 7.994 7.209 15.651 7.209 7.657 0 12.491-2.403 15.21-7.209 1.46-2.623 1.836-6.288 1.836-10.994V279h-8V306.77zM316.268 320.219c-.163-.721-.268-2.092-.268-4.115v-2.974c0-3.104-.43-5.411-1.281-6.924-.852-1.512-2.3-2.678-4.343-3.499 2.443-.842 4.193-2.278 5.256-4.311 1.061-2.033 1.592-4.1 1.592-6.203 0-1.743-.274-3.294-.821-4.656s-1.289-2.604-2.226-3.725c-1.133-1.362-2.515-2.68-4.145-3.382-1.63-.701-3.959-1.43-6.986-1.43H281v45h10v-18h8.945c2.575 0 4.333.716 5.27 1.657.938.942 1.426 2.947 1.463 5.771l.061 4.177c.02 1.301.15 2.676.39 3.918.12.6.321 1.477.6 2.477H318v-1.258C317 322.202 316.512 321.361 316.268 320.219zM305.315 298.859c-.989.482-2.472 1.141-4.45 1.141H291v-13h10.122c1.902 0 3.328.394 4.279.914 1.692.922 2.539 3 2.539 5.684C307.94 296.082 307.066 298.019 305.315 298.859zM356.669 301.865c-1.7-1.341-4.253-2.413-7.658-3.214l-7.77-1.832c-2.999-.701-4.958-1.311-5.882-1.832-1.437-.781-2.157-1.962-2.157-3.545 0-1.722.729-3.064 2.186-4.025 1.458-.962 3.408-1.442 5.852-1.442 2.196 0 4.034.489 5.512 1.23 2.217 1.122 3.408 2.795 3.572 5.795h8.892c-.162-5-1.91-8.414-5.246-10.888-3.335-2.472-7.364-3.768-12.087-3.768-5.657 0-9.944 1.282-12.863 3.905-2.919 2.625-4.379 5.903-4.379 9.869 0 4.346 1.492 7.532 4.477 9.575 1.762 1.222 4.998 2.35 9.71 3.391l4.794 1.049c2.805.6 4.854 1.29 6.147 2.072 1.291.801 1.939 1.932 1.939 3.394 0 2.503-1.32 4.215-3.957 5.136-1.39.48-3.2.72-5.429.72-3.722 0-6.349-1.004-7.883-2.827-.838-1.002-1.4-2.629-1.687-4.629h-8.831c0 5 1.67 8.32 5.009 10.952 3.34 2.635 7.925 3.997 13.755 3.997 5.707 0 10.125-1.314 13.252-3.987 3.127-2.674 4.692-6.021 4.692-10.066C360.629 306.951 359.309 303.949 356.669 301.865z"></path>
                    <g>
                      <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="15" d="M79.389 328.746L79.389 328.746c-16.513 0-29.899-13.386-29.899-29.899v-64.889c0-16.513 13.386-29.899 29.899-29.899h0c16.513 0 29.899 13.386 29.899 29.899v64.889C109.288 315.359 95.902 328.746 79.389 328.746zM422 328.746L422 328.746c-16.513 0-29.899-13.386-29.899-29.899v-64.889c0-16.513 13.386-29.899 29.899-29.899h0c16.513 0 29.899 13.386 29.899 29.899v64.889C451.899 315.359 438.513 328.746 422 328.746z"></path>
                      <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="15" d="M407.372 324.92v25.014c0 64.752-52.492 117.243-117.243 117.243h-39.411M94.288 207.039v-22.342c0-86.455 70.086-156.541 156.541-156.541h0c86.455 0 156.541 70.086 156.541 156.541v23.186"></path>
                      <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="15" d="
                        M265.459,440.703h-31.821c-7.311,0-13.237,5.926-13.237,13.237v0c0,7.311,5.926,13.237,13.237,13.237h31.821
                        c7.311,0,13.237-5.926,13.237-13.237v0C278.696,446.629,272.77,440.703,265.459,440.703z"></path>
                    </g>
                  </svg>
                </div>
                <span className="text-[18px] font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* FEATURE OVERVIEW SECTION */}
      <section className="w-[90%] rounded-xl justify-center mx-auto mt-12 mb-4
            shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 border-3 ring-blue-600/95 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-blue-600/95 via-green-200/85 to-indigo-300/95 py-16 px-0.5">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Why Shop With Us?</h2>
            <ul className="list-disc ml-6 text-lg space-y-2">
              <li>Curated collection from top brands</li>
              <li>Fast & free shipping on orders over ₹999</li>
              <li>Easy returns and 24/7 support</li>
              <li>Seasonal sales and exclusive deals</li>
            </ul>
            <Link
              to="/about"
              className="mt-6 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Learn More
            </Link>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="/assets/home-features.avif"
              alt="Features"
              className="w-full max-w-lg rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 1 && (
        <section className="container mx-auto px-4 py-12 my-4 flex-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories
              .filter((cat) => cat !== 'All')
              .map((cat) => (
                <Link
                  to={`/category/${cat}`}
                  key={cat}
                  className="shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 ring-blue-600/95 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-blue-600/95 to-indigo-300/95 rounded-lg p-6 flex flex-col items-center group"
                >
                  <div className="w-12 h-12 mb-3 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100">
                    <span className="text-lg font-bold text-purple-600">
                      {cat[0]}
                    </span>
                  </div>
                  <span className="font-medium text-center">{cat}</span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* POPULAR PRODUCTS */}
      <section className="bg-white py-12 my-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Popular Products</h2>
            <Link
              to="/shop"
              className="text-purple-600 hover:underline font-medium"
            >
              View All
            </Link>
          </div>

          {status === 'loading' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 h-64 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          )}

          {status === 'succeeded' && popularProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {status === 'succeeded' && popularProducts.length === 0 && (
            <p className="text-gray-500">No popular products available.</p>
          )}
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="w-full bg-white py-12 my-4">
        <div className="container mx-auto px-4 flex flex-col items-center gap-6">
          <h3 className="text-xl lg:text-2xl font-semibold text-gray-800 text-center mb-2">What Our Customers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 ring-blue-600/95 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-blue-600/95 to-indigo-300/95 p-6 rounded text-center">
              <p className="italic mb-3">“Best shopping experience! Fast delivery and amazing products.”</p>
              <p className="font-bold text-purple-600">- Ayush, Mumbai</p>
            </div>
            <div className="shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 ring-blue-600/95 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-blue-600/95 to-indigo-300/95 p-6 rounded text-center">
              <p className="italic mb-3">“Great deals and easy returns. Highly recommend!”</p>
              <p className="font-bold text-purple-600">- Priya, Bangalore</p>
            </div>
            <div className="shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 ring-blue-600/95 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition bg-gradient-to-r from-blue-600/95 to-indigo-300/95 p-6 rounded text-center">
              <p className="italic mb-3">“I love the selection and the support team is awesome!”</p>
              <p className="font-bold text-purple-600">- Varun, Delhi</p>
            </div>
          </div>
        </div>
      </section>

      {/* SALE CTA */}
      <section className="w-[90%] rounded-xl justify-center mx-auto bg-gradient-to-r shadow-[0_15px_30px_rgba(2,6,23,0.35),0_6px_10px_rgba(2,6,23,0.2)]
            ring-3 ring-blue-600/95 border-3 hover:shadow-[0_25px_40px_rgba(2,6,23,0.45)] transition from-blue-600 via-green-200/85 to-indigo-300 text-gray-900 py-12 mt-4 mb-12">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Big Summer Sale</h3>
            <p className="mb-4">
              Save up to 50% on select items. Limited time only — don’t miss out!
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Deals
            </Link>
          </div>
          <img
            src="/assets/sale-banner.webp"
            alt="Sale Banner"
            className="w-full rounded-2xl max-w-md"
          />
        </div>
      </section>

      {/* FOOTER */}
      
    </div>
  );
}

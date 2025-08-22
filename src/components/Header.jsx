// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '../redux/cartSlice';
import {
  selectCategories,
  selectSearchTerm,
  selectSelectedCategory,
  setSearchTerm,
  setSelectedCategory,
} from '../redux/productsSlice';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiSearch,
} from 'react-icons/fi';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useSelector(selectCartCount);
  const categories = useSelector(selectCategories);
  const searchTerm = useSelector(selectSearchTerm);
  const selectedCategory = useSelector(selectSelectedCategory);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (value) => {
    dispatch(setSearchTerm(value));
    if (location.pathname !== '/shop') {
      navigate('/shop');
    }
  };

  const handleCategoryChange = (value) => {
    dispatch(setSelectedCategory(value));
    if (location.pathname !== '/shop') {
      navigate('/shop');
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  const activeClass =
    'text-purple-600 font-semibold border-b-2 border-purple-500';
  const baseClass = 'hover:text-purple-500 transition-colors pb-1';

  const sidebarRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const main = document.getElementById('main-content'); // add id="main-content" to your page wrapper

    if (mobileMenuOpen) {
      // lock body scroll
      document.body.style.overflow = 'hidden';

      // blur whatever had focus (remove blue outline on underlying items)
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      // focus the sidebar for accessibility (and so focus ring appears on the sidebar instead)
      setTimeout(() => sidebarRef.current?.focus(), 0);

      // mark main content inert-ish
      if (main) {
        main.setAttribute('aria-hidden', 'true');
        main.classList.add('pointer-events-none');
      }
    } else {
      document.body.style.overflow = '';
      if (main) {
        main.removeAttribute('aria-hidden');
        main.classList.remove('pointer-events-none');
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (main) {
        main.removeAttribute('aria-hidden');
        main.classList.remove('pointer-events-none');
      }
    };
  }, [mobileMenuOpen, sidebarRef]);

  // useEffect(() => {
  //   document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  //   return () => {
  //     document.body.style.overflow = '';
  //   };
  // }, [mobileMenuOpen]);

  return (
    <header className={`sticky md:py-3 py-1.5 top-0 z-50 box-border transition-all shadow-md ${
        isScrolled 
          ? 'dark:bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.2))] backdrop-blur-md' // Butter paper color when scrolled
          : ' dark:bg-gradient-to-r from-gray-950 via-blue-950 to-gray-950'       // Default color
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 ">
        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <FiX className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          ) : (
            <FiMenu className={`w-6 h-6 text-gray-950 ${isScrolled ? 'dark:text-gray-950' : 'dark:text-white'}`} />
          )}
        </button>

        {/* Logo */}
        <div className='flex items-center md:gap-0.5 '>
          <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="-24 -24 48 48"
              className='lg:h-10 lg:w-10 h-6 w-6 md:h-8 md:w-8 ring-2 rounded-[2px] ring-white border-2'
              preserveAspectRatio="xMidYMid meet"
              style={{ display: 'block', background: "white", overflow: "visible"}}
            >
              <rect x="-24" y="-24" width="48" height="48" fill="#ffffff"/>
              <g className="signage-logo" fill="gray-950" transform="translate(0,19.35)">
                <path d="M-12.27 -2.43C-10.55 -0.85 -7.91 -0.06 -4.35 -0.06L4.29 -0.06C8.01 -0.06 10.73 -0.92 12.45 -2.64C14.17 -4.36 15.03 -7.06 15.03 -10.74C15.03 -14.42 14.17 -17.12 12.45 -18.84C10.73 -20.56 8.01 -21.42 4.29 -21.42L-3.93 -21.42C-6.57 -21.42 -8.41 -21.94 -9.45 -22.98C-10.49 -24.02 -11.01 -25.86 -11.01 -28.5C-11.01 -31.1 -10.49 -32.92 -9.45 -33.96C-8.41 -35 -6.59 -35.52 -3.99 -35.52L4.47 -35.52C6.95 -35.52 8.72 -35.05 9.78 -34.11C10.84 -33.17 11.39 -31.54 11.43 -29.22C11.47 -28.78 11.63 -28.42 11.91 -28.14C12.19 -27.86 12.55 -27.72 12.99 -27.72C13.47 -27.72 13.86 -27.86 14.16 -28.14C14.46 -28.42 14.59 -28.8 14.55 -29.28C14.43 -32.48 13.56 -34.84 11.94 -36.36C10.32 -37.88 7.83 -38.64 4.47 -38.64L-3.99 -38.64C-7.47 -38.64 -10.03 -37.82 -11.67 -36.18C-13.31 -34.54 -14.13 -31.98 -14.13 -28.5C-14.13 -24.98 -13.31 -22.4 -11.67 -20.76C-10.03 -19.12 -7.45 -18.3 -3.93 -18.3L4.29 -18.3C7.13 -18.3 9.11 -17.75 10.23 -16.65C11.35 -15.55 11.91 -13.58 11.91 -10.74C11.91 -7.9 11.36 -5.93 10.26 -4.83C9.16 -3.73 7.17 -3.18 4.29 -3.18L-4.35 -3.18C-7.07 -3.18 -8.99 -3.68 -10.11 -4.68C-11.23 -5.68 -11.83 -7.46 -11.91 -10.02C-11.95 -10.5 -12.11 -10.88 -12.39 -11.16C-12.67 -11.44 -13.03 -11.58 -13.47 -11.58C-13.95 -11.58 -14.34 -11.43 -14.64 -11.13C-14.94 -10.83 -15.07 -10.44 -15.03 -9.96C-14.91 -6.52 -13.99 -4.01 -12.27 -2.43Z"/>
              </g>
          </svg>
        
          <Link
            to="/"
            className={`flex-1 mr-4 ml-2 text-xl md:text-2xl font-bold text-purple-600 ${isScrolled ? 'dark:text-gray-950' : 'dark:text-white'} whitespace-nowrap`}
          >
            ShoppyGlobe
          </Link>
        </div>

        <div className='md:hidden w-10'>

        </div>

        {/* Desktop Nav & Controls */}
        <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8 w-full">
          <nav className={`flex font-semibold space-x-4 ${isScrolled ? 'text-gray-950' : 'text-white'}`}>
            {navLinks.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive ? activeClass : baseClass
                }
              >
                {name}
              </NavLink>
            ))}
          </nav>

          <div className={`flex items-center ${isScrolled ? 'text-gray-950' : 'text-white'}`}>
            <select
              id="desktop-category"
              name="desktopCategory"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`border rounded-l-md px-3 lg:h-10 md:h-8 h-6 w-16 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${isScrolled ? 'dark:bg-gray-950 dark:text-white' : 'dark:bg-white dark:text-gray-950'}`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="relative">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${isScrolled ? 'dark:text-white' : 'dark:text-gray-950'}`} />
              <input
                type="text"
                id="header-search"
                name="headerSearch"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={`border rounded-r-md pl-10 pr-3 lg:h-10 md:h-8 h-6 w-48 lg:w-155 md:w-60 focus:outline-none focus:ring-2 focus:ring-purple-500 ${isScrolled ? 'dark:bg-gray-950 dark:text-white' : 'dark:bg-white dark:text-gray-950'} `}
              />
            </div>
          </div>

        </div>

        <button
            onClick={toggleTheme}
            className="px-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors"
          >
            {isDark ? (
              <FiSun className="md:w-8 md:h-8 w-6 h-6 text-yellow-400" />
            ) : (
              <FiMoon className={`md:w-8 md:h-8 w-6 h-6 ${isScrolled ? 'text-gray-950' : 'text-white'}`} />
            )}
        </button>

        <Link to="/cart" className="relative px-2">
          <FiShoppingCart className={`md:w-8 md:h-8 w-6 h-6 text-gray-700 stroke-2 hover:text-purple-600 ${isScrolled ? 'dark:text-gray-950' : 'dark:text-white'} transition-colors`} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
        </Link>
      </div>

      {/* Mobile Side Toggle Menu */}
      {mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-51 flex">
            {/* Background Overlay */}
            <div
              className="absolute inset-0 bg-black/50 z-52"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />

            {/* Sidebar with Animation */}
            <aside
              className={`relative w-64 bg-white dark:bg-gray-950 shadow-xl overflow-y-auto z-53 transform transition-transform duration-300 ease-in-out ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              {/* Navigation Links */}
              <nav className="flex flex-col p-4 space-y-2">
                {navLinks.map(({ name, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-purple-600 font-semibold'
                        : 'text-gray-700 dark:text-gray-300') +
                      ' px-3 py-2 rounded hover:bg-purple-50 dark:hover:bg-purple-700'
                    }
                  >
                    {name}
                  </NavLink>
                ))}
              </nav>

              {/* Categories */}
              <div className="border-t mt-2 pt-4 px-4">
                <p className="font-semibold text-gray-600 dark:text-gray-400 mb-2 select-none">
                  Categories
                </p>
                <ul>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded ${
                          selectedCategory === cat
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-700'
                        }`}
                        onClick={() => handleCategoryChange(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Search Bar */}
              <div className="mt-4 px-4">
                <label htmlFor="mobile-search" className="sr-only">
                  Search Products
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    id="mobile-search"
                    name="mobileSearch"
                    placeholder="Search products…"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full rounded-full border border-gray-300 dark:border-gray-700 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )}

    </header>
  );
}

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
        <Link
          to="/"
          className={`flex-1 mx-4 text-xl md:text-2xl font-bold text-purple-600 ${isScrolled ? 'dark:text-gray-950' : 'dark:text-white'} whitespace-nowrap`}
        >
          ShoppyGlobe
        </Link>

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

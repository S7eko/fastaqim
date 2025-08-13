"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedMode || prefersDark);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-green-700 text-white py-3 px-4 sm:px-6 flex justify-between items-center shadow-lg fixed w-full top-0 z-[1100] dark:bg-gray-900 dark:border-b dark:border-gray-700">
      {/* Logo and Branding */}
      <div className="flex items-center">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 font-tajawal dark:text-yellow-400">
          تبيان الهدى
        </span>
      </div>

      {/* Desktop Navigation and Controls */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Navigation Links */}
        <ul className="flex items-center space-x-1 rtl:space-x-reverse">
          <li>
            <Link
              href="/"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              href="/apprefrance/dashboard"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              لوحة التحكم
            </Link>
          </li>
          <li>
            <Link
              href="/apprefrance/hadeeth"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              الأحاديث
            </Link>
          </li>
          <li>
            <Link
              href="/apprefrance/Services"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              القرآن الكريم
            </Link>
          </li>
          <li>
            <Link
              href="/apprefrance/duaService"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              الأدعية
            </Link>
          </li>
          <li>
            <Link
              href="/apprefrance/tafsir"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              التفسير
            </Link>
          </li>
          <li>
            <Link
              href="/apprefrance/radioPlayer"
              className="hover:text-yellow-300 py-2 px-4 transition-colors duration-200 dark:hover:text-yellow-400"
            >
              الإذاعة
            </Link>
          </li>
        </ul>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full focus:outline-none hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
          aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع المظلم"}
        >
          <FontAwesomeIcon
            icon={darkMode ? faSun : faMoon}
            className={`text-lg ${darkMode ? "text-yellow-300" : "text-white"}`}
          />
        </button>

        {/* Login Button */}
        <Link
          href="/apprefrance/auth/login"
          className="bg-yellow-400 text-green-900 px-6 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200 shadow-md font-medium whitespace-nowrap dark:bg-yellow-500 dark:hover:bg-yellow-400"
        >
          تسجيل الدخول
        </Link>
      </div>

      {/* Mobile Controls */}
      <div className="flex lg:hidden items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full focus:outline-none hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
          aria-label={darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع المظلم"}
        >
          <FontAwesomeIcon
            icon={darkMode ? faSun : faMoon}
            className={`text-lg ${darkMode ? "text-yellow-300" : "text-white"}`}
          />
        </button>

        {/* Mobile Menu Button */}
        <button
          className="text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="فتح القائمة"
          aria-expanded={isOpen}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute bg-green-700 dark:bg-gray-900 w-full left-0 top-full transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen shadow-xl" : "max-h-0"}`}>
        <div className="flex flex-col items-center py-4">
          <ul className="w-full">
            <li className="border-b border-green-600 dark:border-gray-700">
              <Link
                href="/"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </Link>
            </li>
            <li className="border-b border-green-600 dark:border-gray-700">
              <Link
                href="/apprefrance/dashboard"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                لوحة التحكم
              </Link>
            </li>
            <li className="border-b border-green-600 dark:border-gray-700">
              <Link
                href="/apprefrance/hadeeth"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                الأحاديث
              </Link>
            </li>
            <li className="border-b border-green-600 dark:border-gray-700">
              <Link
                href="/apprefrance/Services"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                القرآن الكريم
              </Link>
            </li>
            <li className="border-b border-green-600 dark:border-gray-700">
              <Link
                href="/apprefrance/duaService"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                الأدعية
              </Link>
            </li>
            <li className="border-b border-green-600 dark:border-gray-700">
              <Link
                href="/apprefrance/tafsir"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                التفسير
              </Link>
            </li>
            <li>
              <Link
                href="/apprefrance/radioPlayer"
                className="hover:text-yellow-300 py-3 px-6 transition-colors duration-200 block text-center dark:hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                الإذاعة
              </Link>
            </li>
          </ul>

          {/* Mobile Login Button */}
          <div className="w-full px-6 mt-4">
            <Link
              href="/apprefrance/auth/login"
              className="bg-yellow-400 text-green-900 px-6 py-3 rounded-md hover:bg-yellow-300 transition-colors duration-200 shadow-md block text-center font-medium dark:bg-yellow-500 dark:hover:bg-yellow-400"
              onClick={() => setIsOpen(false)}
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
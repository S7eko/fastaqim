"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white py-3 px-4 sm:px-6 flex justify-between items-center shadow-lg fixed w-full top-0 z-[1100]">
      {/* Logo and Branding */}
      <div className="flex items-center">
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 font-tajawal">
          فَاسْتَقِمْ كَمَا أُمِرْتَ
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden text-white text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Navigation Links and Desktop Login */}
      <div className={`absolute lg:static bg-green-700 w-full lg:w-auto left-0 top-full lg:top-0 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-screen shadow-xl" : "max-h-0 lg:max-h-screen"}`}>
        <div className="flex flex-col lg:flex-row items-center py-2 lg:py-0">
          <ul className="flex flex-col lg:flex-row w-full lg:w-auto">
            <li className="w-full lg:w-auto border-b lg:border-b-0 border-green-600">
              <Link
                href="/"
                className="hover:text-yellow-300 py-3 px-6 lg:py-2 lg:px-4 transition-colors duration-200 block text-center lg:text-right"
                onClick={() => setIsOpen(false)}
              >
                الرئيسية
              </Link>
            </li>
            <li className="w-full lg:w-auto border-b lg:border-b-0 border-green-600">
              <Link
                href="/apprefrance/dashboard"
                className="hover:text-yellow-300 py-3 px-6 lg:py-2 lg:px-4 transition-colors duration-200 block text-center lg:text-right"
                onClick={() => setIsOpen(false)}
              >
                لوحة التحكم
              </Link>
            </li>
            <li className="w-full lg:w-auto border-b lg:border-b-0 border-green-600">
              <Link
                href="/Dashbord/AddExamMCQ"
                className="hover:text-yellow-300 py-3 px-6 lg:py-2 lg:px-4 transition-colors duration-200 block text-center lg:text-right"
                onClick={() => setIsOpen(false)}
              >
                السيرة النبوية
              </Link>
            </li>
            <li className="w-full lg:w-auto border-b lg:border-b-0 border-green-600">
              <Link
                href="#"
                className="hover:text-yellow-300 py-3 px-6 lg:py-2 lg:px-4 transition-colors duration-200 block text-center lg:text-right"
                onClick={() => setIsOpen(false)}
              >
                المصحف المفسر
              </Link>
            </li>
            <li className="w-full lg:w-auto border-b lg:border-b-0 border-green-600">
              <Link
                href="#"
                className="hover:text-yellow-300 py-3 px-6 lg:py-2 lg:px-4 transition-colors duration-200 block text-center lg:text-right"
                onClick={() => setIsOpen(false)}
              >
                ربط الآيات
              </Link>
            </li>
            <li className="w-full lg:w-auto">
              <Link
                href="#"
                className="hover:text-yellow-300 py-3 px-6 lg:py-2 lg:px-4 transition-colors duration-200 block text-center lg:text-right"
                onClick={() => setIsOpen(false)}
              >
                الحصون الخمسة
              </Link>
            </li>
          </ul>

          {/* Desktop Login Button - Appears after links */}
          <div className="hidden lg:block ml-4">
            <Link
              href="/apprefrance/auth/login"
              className="bg-yellow-400 text-green-900 px-6 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200 shadow-md font-medium whitespace-nowrap"
              onClick={() => setIsOpen(false)}
            >
              تسجيل الدخول
            </Link>
          </div>

          {/* Mobile Login Button - Only visible in mobile menu */}
          <div className="lg:hidden w-full mt-3 px-4">
            <Link
              href="/apprefrance/auth/login"
              className="bg-yellow-400 text-green-900 px-6 py-3 rounded-md hover:bg-yellow-300 transition-colors duration-200 shadow-md block text-center font-medium"
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
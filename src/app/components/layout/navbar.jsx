"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-lg fixed w-full top-0 z-1000">
      {/* الشعار مع اللوجو */}
      <div className="flex items-center space-x-3">
        
        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300">
          فَاسْتَقِمْ كَمَا أُمِرْتَ
        </span>
      </div>

      {/* زر القائمة للجوال والتابلت */}
      <button
        className="lg:hidden text-white text-2xl focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? "✕" : "☰"} {/* تغيير الأيقونة عند الفتح والإغلاق */}
      </button>

      {/* الروابط */}
      <ul
        className={`absolute lg:static bg-green-700 w-full lg:w-auto left-0 top-16 lg:top-0 lg:flex space-x-0 lg:space-x-6 flex-col lg:flex-row items-center transition-all duration-300 ease-in-out ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <li>
          <Link
            href="/"
            className="hover:text-yellow-300 py-2 px-4 lg:ml-4 transition-colors duration-200 block text-center lg:text-left"
          >
            الرئيسية
          </Link>
        </li>
        <li>
          <Link href="/apprefrance/dashboard"
            
            className="hover:text-yellow-300 py-2 px-4 lg:ml-4 transition-colors duration-200 block text-center lg:text-left"
          >
            لوحه التحكم 
          </Link>
        </li>
        <li>
          <a
            href="./Dashbord/AddExamMCQ"
            className="hover:text-yellow-300 py-2 px-4 lg:ml-4 transition-colors duration-200 block text-center lg:text-left"
          >
            السيرة النبوية
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-yellow-300 py-2 px-4 lg:ml-4 transition-colors duration-200 block text-center lg:text-left"
          >
            المصحف المفسر
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-yellow-300 py-2 px-4 lg:ml-4 transition-colors duration-200 block text-center lg:text-left"
          >
            ربط الآيات
          </a>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-yellow-300 py-2 px-4 lg:ml-4 transition-colors duration-200 block text-center lg:text-left"
          >
            الحصون الخمسة
          </a>
        </li>
      </ul>

      {/* زر تسجيل الدخول */}
      <button className="hidden lg:block bg-yellow-400 text-green-900 px-6 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200 shadow-md">
        تسجيل الدخول
      </button>
    </nav>
  );
};

export default Navbar;
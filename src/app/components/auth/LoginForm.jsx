"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faSpinner,
  faSignInAlt,
  faUserPlus,
  faMosque,
  faBookQuran
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!password) newErrors.password = 'كلمة المرور مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل تسجيل الدخول');
      }

      localStorage.setItem('authToken', data.token);
      toast.success('تم تسجيل الدخول بنجاح!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-[70px] flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-4 md:p-8" dir="rtl">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-green-100">
          <div className="text-center mb-8">
            <FontAwesomeIcon
              icon={faMosque}
              className="text-4xl text-green-600 mb-4 animate-pulse"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-tajawal">مرحباً بعودتك</h1>
            <p className="text-gray-600 mt-2 font-scheherazade">سجل الدخول إلى حسابك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-green-500 text-opacity-70" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pr-10 pl-3 py-2.5 text-sm border ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'} rounded-lg focus:ring-2 focus:outline-none transition duration-200`}
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 text-right">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-green-500 text-opacity-70" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pr-10 pl-3 py-2.5 text-sm border ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'} rounded-lg focus:ring-2 focus:outline-none transition duration-200`}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 text-right">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-300 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-xs sm:text-sm text-gray-600">
                  تذكرني
                </label>
              </div>

              <div className="text-xs sm:text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 transition-all duration-300 ${isLoading ? 'bg-green-500' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'}`}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin ml-2"
                    />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faSignInAlt}
                      className="ml-2"
                    />
                    تسجيل الدخول
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              ليس لديك حساب؟{' '}
              <Link href="/apprefrance/auth/register" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="ml-1"
                />
                سجل الآن
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <FontAwesomeIcon
              icon={faBookQuran}
              className="text-green-500 text-lg animate-bounce"
            />
            <p className="text-xs text-green-600 mt-1 font-scheherazade">بسم الله الرحمن الرحيم</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faMoon,
  faPrayingHands,
  faBed,
  faSearch,
  faSpinner,
  faArrowLeft,
  faBookQuran
} from '@fortawesome/free-solid-svg-icons';

const DuaService = () => {
  const [azkarData, setAzkarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // جلب بيانات الأذكار من API
  useEffect(() => {
    const fetchAzkar = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json');
        if (!response.ok) {
          throw new Error('فشل في تحميل بيانات الأذكار');
        }
        const data = await response.json();
        setAzkarData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAzkar();
  }, []);

  // تصفية الأذكار حسب البحث
  const filteredAzkar = () => {
    if (!selectedCategory || !azkarData) return [];

    const categoryData = azkarData[selectedCategory];
    if (!categoryData) return [];

    const flattenedData = Array.isArray(categoryData[0]) ? categoryData.flat() : categoryData;

    return flattenedData.filter(item =>
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // عرض تصنيفات الأذكار
  const renderCategories = () => {
    if (!azkarData) return null;

    const categories = Object.keys(azkarData).filter(cat => cat !== 'stop');

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {categories.map(category => (
          <div
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-5 rounded-xl shadow-sm cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
              } border ${darkMode ? 'border-gray-600' : 'border-gray-200'
              }`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                <FontAwesomeIcon
                  icon={getCategoryIcon(category)}
                  className={`text-xl ${darkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}
                />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                  {category}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'
                  } text-sm`}>
                  {Array.isArray(azkarData[category][0])
                    ? azkarData[category].flat().length
                    : azkarData[category].length} ذكر
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // عرض الأذكار حسب التصنيف
  const renderAzkar = () => {
    const azkar = filteredAzkar();

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'text-blue-300 hover:bg-gray-600' : 'text-blue-600 hover:bg-blue-50'
              } transition-colors`}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="ml-2" />
            العودة للتصنيفات
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-600 text-yellow-300' : 'bg-gray-200 text-gray-700'
              }`}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>

        <h2 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
          <FontAwesomeIcon
            icon={getCategoryIcon(selectedCategory)}
            className="ml-2"
            color={darkMode ? '#93c5fd' : '#2563eb'}
          />
          {selectedCategory}
        </h2>

        {azkar.length === 0 ? (
          <div className={`text-center py-8 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'
            }`}>
            {searchQuery ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد أذكار متاحة'}
          </div>
        ) : (
          <div className="space-y-4">
            {azkar.map((zekr, index) => (
              <div
                key={index}
                className={`rounded-lg p-6 shadow-sm transition-all duration-300 ${darkMode
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  } border`}
              >
                <div className={`text-right text-lg leading-relaxed font-arabic ${darkMode ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                  {zekr.content}
                </div>

                {(zekr.description || zekr.count !== '1') && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    {zekr.description && (
                      <div className={`text-sm p-2 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-50 text-gray-600'
                        }`}>
                        {zekr.description}
                      </div>
                    )}

                    {zekr.count !== '1' && (
                      <span className={`px-3 py-1 rounded-full text-sm ${darkMode
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-blue-100 text-blue-600'
                        }`}>
                        {zekr.count} مرة
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // الحصول على الأيقونة المناسبة لكل تصنيف
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'أذكار الصباح': return faSun;
      case 'أذكار المساء': return faMoon;
      case 'أذكار بعد السلام من الصلاة المفروضة': return faPrayingHands;
      case 'أذكار النوم': return faBed;
      default: return faBookQuran;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6`} dir="rtl">
      <main className="container mx-auto max-w-6xl">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'
            }`}>
            <FontAwesomeIcon
              icon={faBookQuran}
              className={`ml-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
            />
            الأذكار اليومية
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
            مجموعة من الأذكار المأثورة من القرآن والسنة
          </p>
        </div>

        {/* شريط البحث */}
        {selectedCategory && (
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <FontAwesomeIcon
                icon={faSearch}
                className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
              />
              <input
                type="text"
                placeholder="ابحث في الأذكار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'
                  } border`}
              />
            </div>
          </div>
        )}

        {/* حالة التحميل */}
        {loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              className={`animate-spin text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-500'
                }`}
            />
            <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              جاري تحميل الأذكار...
            </p>
          </div>
        )}

        {/* حالة الخطأ */}
        {error && (
          <div className={`border-l-4 p-4 mb-6 rounded ${darkMode
              ? 'bg-red-900 border-red-500 text-red-200'
              : 'bg-red-50 border-red-400 text-red-700'
            }`}>
            <div className="flex items-start">
              <div>
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className={`mt-2 ${darkMode ? 'text-red-300 hover:text-red-100' : 'text-red-600 hover:text-red-800'
                    }`}
                >
                  حاول مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}

        {/* المحتوى الرئيسي */}
        {!loading && !error && (
          <>
            {selectedCategory ? renderAzkar() : renderCategories()}
          </>
        )}
      </main>

      {/* تذييل الصفحة */}
      <footer className={`mt-12 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
        <div className="container mx-auto px-4">
          جميع الحقوق محفوظة © {new Date().getFullYear()} | بيانات الأذكار مقدمة من Nawaf Alqari
        </div>
      </footer>
    </div>
  );
};

export default DuaService;
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

  // جلب بيانات الأذكار
  useEffect(() => {
    const fetchAzkar = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json');
        if (!response.ok) throw new Error('فشل في تحميل بيانات الأذكار');
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

  const renderCategories = () => {
    if (!azkarData) return null;
    const categories = Object.keys(azkarData).filter(cat => cat !== 'stop');

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="p-5 rounded-xl shadow-sm cursor-pointer transition-all duration-300 transform hover:scale-[1.02] bg-[var(--card)] hover:bg-[var(--card-hover)] border border-[var(--border)]"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full ml-[15px] bg-[var(--primary-bg)]">
                <FontAwesomeIcon
                  icon={getCategoryIcon(category)}
                  className="text-xl text-[var(--primary)]"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mr-1">{category}</h3>
                <p className="text-[var(--muted-foreground)] text-sm">
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
            className="flex items-center px-4 py-2 rounded-lg text-[var(--primary)] hover:bg-[var(--card-hover)] transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="ml-2" />
            العودة للتصنيفات
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center text-[var(--foreground)]">
          <FontAwesomeIcon
            icon={getCategoryIcon(selectedCategory)}
            className="ml-2"
            color="var(--primary)"
          />
          {selectedCategory}
        </h2>

        {azkar.length === 0 ? (
          <div className="text-center py-8 rounded-lg bg-[var(--card)] text-[var(--muted-foreground)]">
            {searchQuery ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد أذكار متاحة'}
          </div>
        ) : (
          <div className="space-y-4">
            {azkar.map((zekr, index) => (
              <div
                key={index}
                className="rounded-lg p-6 shadow-sm transition-all duration-300 bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)]"
              >
                <div className="text-right text-lg leading-relaxed font-arabic text-[var(--foreground)]">
                  {zekr.content}
                </div>

                {(zekr.description || zekr.count !== '1') && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    {zekr.description && (
                      <div className="text-sm p-2 rounded bg-[var(--card-hover)] text-[var(--muted-foreground)]">
                        {zekr.description}
                      </div>
                    )}

                    {zekr.count !== '1' && (
                      <span className="px-3 py-1 rounded-full text-sm bg-[var(--primary-bg)] text-[var(--primary)]">
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
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6" dir="rtl">
      <main className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 mt-[75px]">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-[var(--foreground)]">
            <FontAwesomeIcon
              icon={faBookQuran}
              className="ml-2 text-[var(--primary)]"
            />
            الأذكار اليومية
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
            مجموعة من الأذكار المأثورة من القرآن والسنة
          </p>
        </div>

        {selectedCategory && (
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-3 text-[var(--muted-foreground)]"
              />
              <input
                type="text"
                placeholder="ابحث في الأذكار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] focus:ring-[var(--primary)]"
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-4xl text-[var(--primary)]"
            />
            <p className="mt-4 text-[var(--muted-foreground)]">جاري تحميل الأذكار...</p>
          </div>
        )}

        {error && (
          <div className="border-l-4 p-4 mb-6 rounded bg-red-50 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-500 dark:text-red-200">
            <div className="flex items-start">
              <div>
                <p className="font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
                >
                  حاول مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {selectedCategory ? renderAzkar() : renderCategories()}
          </>
        )}
      </main>

      <footer className="mt-12 text-center text-xs text-[var(--muted-foreground)]">
        <div className="container mx-auto px-4">
          جميع الحقوق محفوظة © {new Date().getFullYear()} | بيانات الأذكار مقدمة من Nawaf Alqari
        </div>
      </footer>
    </div>
  );
};

export default DuaService;

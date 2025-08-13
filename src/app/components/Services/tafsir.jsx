"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookQuran, faSearch, faSpinner, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Tafsir = () => {
  const [surahNumber, setSurahNumber] = useState(1);
  const [tafsirData, setTafsirData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Complete list of Surah names
  const surahs = [
    { number: 1, name: "الفاتحة" },
    { number: 2, name: "البقرة" },
    { number: 3, name: "آل عمران" },
    // ... continue with all 114 surahs
    { number: 114, name: "الناس" }
  ];

  const fetchTafsir = async () => {
    try {
      setLoading(true);
      setError(null);
      setTafsirData([]);

      const response = await fetch(
        `https://quranenc.com/api/v1/translation/sura/arabic_moyassar/${surahNumber}`
      );

      if (!response.ok) throw new Error('فشل تحميل التفسير');

      const data = await response.json();
      setTafsirData(data.result || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching Tafsir:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTafsir();
  }, [surahNumber]);

  const handleSurahChange = (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num >= 1 && num <= 114) {
      setSurahNumber(num);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (/^\d+$/.test(value)) {
      const num = parseInt(value);
      if (num >= 1 && num <= 114) {
        setSurahNumber(num);
      }
    }
  };

  const navigateSurah = (direction) => {
    const newNumber = direction === 'next'
      ? Math.min(surahNumber + 1, 114)
      : Math.max(surahNumber - 1, 1);
    setSurahNumber(newNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-16 mt-[50px]" dir="rtl">
      <main className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <FontAwesomeIcon icon={faBookQuran} className="ml-2 text-blue-600" />
            تفسير القرآن الكريم
          </h1>
          <p className="text-gray-500">اختر سورة أو اكتب رقمها للاطلاع على التفسير</p>
        </div>

        {/* Search and Select */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="ابحث برقم السورة (1-114)..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={surahNumber}
              onChange={handleSurahChange}
              className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {surahs.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Surah Info Header */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-blue-600">
            سورة {surahs.find(s => s.number === surahNumber)?.name}
          </h2>
          <p className="text-gray-500">رقم السورة: {surahNumber}</p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin text-3xl text-blue-500 mb-4"
              />
              <p className="text-gray-600">جاري تحميل التفسير...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 text-center">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p className="font-medium">{error}</p>
                <button
                  onClick={fetchTafsir}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  حاول مرة أخرى
                </button>
              </div>
            </div>
          )}

          {/* Tafsir Content */}
          {!loading && !error && tafsirData.length > 0 && (
            <div className="divide-y divide-gray-200">
              {tafsirData.map((aya) => (
                <div key={aya.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-end mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      الآية {aya.aya}
                    </span>
                  </div>

                  <div className="text-xl mb-4 font-arabic text-right leading-loose text-gray-800">
                    {aya.arabic_text}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">التفسير:</h3>
                    <p className="text-gray-700">{aya.translation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Arrows - Bottom */}
        <div className="flex justify-between bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <button
            onClick={() => navigateSurah('prev')}
            disabled={surahNumber <= 1}
            className={`flex items-center px-4 py-2 rounded-lg ${surahNumber <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="ml-1" />
            السورة السابقة
          </button>

          <button
            onClick={() => navigateSurah('next')}
            disabled={surahNumber >= 114}
            className={`flex items-center px-4 py-2 rounded-lg ${surahNumber >= 114 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            السورة التالية
            <FontAwesomeIcon icon={faChevronRight} className="mr-1" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500 mt-8">
        <div className="container mx-auto px-4">
          جميع الحقوق محفوظة © {new Date().getFullYear()} تفسير القرآن الكريم
        </div>
      </footer>
    </div>
  );
};

export default Tafsir;
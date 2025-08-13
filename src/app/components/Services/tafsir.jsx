"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookQuran, faSearch, faSpinner, faChevronLeft, faChevronRight, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Tafsir = () => {
  const [surahNumber, setSurahNumber] = useState(1);
  const [tafsirData, setTafsirData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [theme, setTheme] = useState('dark');

  // Complete list of Surah names
  const surahs = [
    { number: 1, name: "الفاتحة" }, { number: 2, name: "البقرة" }, { number: 3, name: "آل عمران" },
    { number: 4, name: "النساء" }, { number: 5, name: "المائدة" }, { number: 6, name: "الأنعام" },
    { number: 7, name: "الأعراف" }, { number: 8, name: "الأنفال" }, { number: 9, name: "التوبة" },
    { number: 10, name: "يونس" }, { number: 11, name: "هود" }, { number: 12, name: "يوسف" },
    { number: 13, name: "الرعد" }, { number: 14, name: "إبراهيم" }, { number: 15, name: "الحجر" },
    { number: 16, name: "النحل" }, { number: 17, name: "الإسراء" }, { number: 18, name: "الكهف" },
    { number: 19, name: "مريم" }, { number: 20, name: "طه" }, { number: 21, name: "الأنبياء" },
    { number: 22, name: "الحج" }, { number: 23, name: "المؤمنون" }, { number: 24, name: "النور" },
    { number: 25, name: "الفرقان" }, { number: 26, name: "الشعراء" }, { number: 27, name: "النمل" },
    { number: 28, name: "القصص" }, { number: 29, name: "العنكبوت" }, { number: 30, name: "الروم" },
    { number: 31, name: "لقمان" }, { number: 32, name: "السجدة" }, { number: 33, name: "الأحزاب" },
    { number: 34, name: "سبأ" }, { number: 35, name: "فاطر" }, { number: 36, name: "يس" },
    { number: 37, name: "الصافات" }, { number: 38, name: "ص" }, { number: 39, name: "الزمر" },
    { number: 40, name: "غافر" }, { number: 41, name: "فصلت" }, { number: 42, name: "الشورى" },
    { number: 43, name: "الزخرف" }, { number: 44, name: "الدخان" }, { number: 45, name: "الجاثية" },
    { number: 46, name: "الأحقاف" }, { number: 47, name: "محمد" }, { number: 48, name: "الفتح" },
    { number: 49, name: "الحجرات" }, { number: 50, name: "ق" }, { number: 51, name: "الذاريات" },
    { number: 52, name: "الطور" }, { number: 53, name: "النجم" }, { number: 54, name: "القمر" },
    { number: 55, name: "الرحمن" }, { number: 56, name: "الواقعة" }, { number: 57, name: "الحديد" },
    { number: 58, name: "المجادلة" }, { number: 59, name: "الحشر" }, { number: 60, name: "الممتحنة" },
    { number: 61, name: "الصف" }, { number: 62, name: "الجمعة" }, { number: 63, name: "المنافقون" },
    { number: 64, name: "التغابن" }, { number: 65, name: "الطلاق" }, { number: 66, name: "التحريم" },
    { number: 67, name: "الملك" }, { number: 68, name: "القلم" }, { number: 69, name: "الحاقة" },
    { number: 70, name: "المعارج" }, { number: 71, name: "نوح" }, { number: 72, name: "الجن" },
    { number: 73, name: "المزمل" }, { number: 74, name: "المدثر" }, { number: 75, name: "القيامة" },
    { number: 76, name: "الإنسان" }, { number: 77, name: "المرسلات" }, { number: 78, name: "النبأ" },
    { number: 79, name: "النازعات" }, { number: 80, name: "عبس" }, { number: 81, name: "التكوير" },
    { number: 82, name: "الإنفطار" }, { number: 83, name: "المطففين" }, { number: 84, name: "الإنشقاق" },
    { number: 85, name: "البروج" }, { number: 86, name: "الطارق" }, { number: 87, name: "الأعلى" },
    { number: 88, name: "الغاشية" }, { number: 89, name: "الفجر" }, { number: 90, name: "البلد" },
    { number: 91, name: "الشمس" }, { number: 92, name: "الليل" }, { number: 93, name: "الضحى" },
    { number: 94, name: "الشرح" }, { number: 95, name: "التين" }, { number: 96, name: "العلق" },
    { number: 97, name: "القدر" }, { number: 98, name: "البينة" }, { number: 99, name: "الزلزلة" },
    { number: 100, name: "العاديات" }, { number: 101, name: "القارعة" }, { number: 102, name: "التكاثر" },
    { number: 103, name: "العصر" }, { number: 104, name: "الهمزة" }, { number: 105, name: "الفيل" },
    { number: 106, name: "قريش" }, { number: 107, name: "الماعون" }, { number: 108, name: "الكوثر" },
    { number: 109, name: "الكافرون" }, { number: 110, name: "النصر" }, { number: 111, name: "المسد" },
    { number: 112, name: "الإخلاص" }, { number: 113, name: "الفلق" }, { number: 114, name: "الناس" }
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

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleSurahChange = (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num) && num >= 1 && num <= 114) {
      setSurahNumber(num);
      setSearchInput(num.toString());
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
    setSearchInput(newNumber.toString());
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 pb-16 mt-[50px]" dir="rtl">
      {/* Header and Theme Toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-transparent shadow-none flex items-center justify-between px-4 py-2">
        <h1 className="text-lg font-bold text-foreground md:text-xl">
          <FontAwesomeIcon icon={faBookQuran} className="ml-2 text-primary" />
          تفسير القرآن الكريم
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Toggle dark mode"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-lg" />
        </button>
      </div>

      <main className="container mx-auto px-4 max-w-4xl">
        {/* Search and Select */}
        <div className="bg-card rounded-xl p-4 mb-6 border border-border/50 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/50">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="ابحث برقم السورة (1-114)..."
                className="w-full bg-background border border-border/50 text-foreground rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={surahNumber}
              onChange={handleSurahChange}
              className="bg-card border border-border/50 text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
        <div className="bg-card rounded-xl p-4 mb-6 border border-border/50 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-primary">
            سورة {surahs.find(s => s.number === surahNumber)?.name}
          </h2>
          <p className="text-foreground/50">رقم السورة: {surahNumber}</p>
        </div>

        {/* Content Area */}
        <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border/50 mb-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin text-3xl text-primary mb-4"
              />
              <p className="text-foreground/70">جاري تحميل التفسير...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-6 text-center">
              <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-4 rounded">
                <p className="font-medium">{error}</p>
                <button
                  onClick={fetchTafsir}
                  className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/80"
                >
                  حاول مرة أخرى
                </button>
              </div>
            </div>
          )}

          {/* Tafsir Content */}
          {!loading && !error && tafsirData.length > 0 && (
            <div className="divide-y divide-border/50">
              {tafsirData.map((aya) => (
                <div key={aya.id} className="p-6 hover:bg-card/5 transition-colors">
                  <div className="flex justify-end mb-3">
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                      الآية {aya.aya}
                    </span>
                  </div>

                  <div className="text-xl mb-4 font-arabic text-right leading-loose text-foreground">
                    {aya.arabic_text}
                  </div>

                  <div className="bg-card-foreground/5 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-foreground/50 mb-1">التفسير:</h3>
                    <p className="text-foreground">{aya.translation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Arrows - Bottom */}
        <div className="flex justify-between bg-card rounded-xl p-4 border border-border/50 shadow-sm">
          <button
            onClick={() => navigateSurah('prev')}
            disabled={surahNumber <= 1}
            className={`flex items-center px-4 py-2 rounded-lg ${surahNumber <= 1 ? 'text-foreground/40 cursor-not-allowed' : 'text-primary hover:bg-primary/5'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="ml-1" />
            السورة السابقة
          </button>

          <button
            onClick={() => navigateSurah('next')}
            disabled={surahNumber >= 114}
            className={`flex items-center px-4 py-2 rounded-lg ${surahNumber >= 114 ? 'text-foreground/40 cursor-not-allowed' : 'text-primary hover:bg-primary/5'}`}
          >
            السورة التالية
            <FontAwesomeIcon icon={faChevronRight} className="mr-1" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-3 text-center text-xs text-foreground/50 mt-8">
        <div className="container mx-auto px-4">
          جميع الحقوق محفوظة © {new Date().getFullYear()} تفسير القرآن الكريم
        </div>
      </footer>
    </div>
  );
};

export default Tafsir;
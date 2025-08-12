"use client";
import React, { useState, useEffect } from 'react';

const Hadith = () => {
  const [books] = useState([
    { id: 'bukhari', name: 'صحيح البخاري' },
    { id: 'muslim', name: 'صحيح مسلم' },
    { id: 'tirmidhi', name: 'سنن الترمذي' },
    { id: 'abudawud', name: 'سنن أبي داود' },
    { id: 'nasai', name: 'سنن النسائي' },
    { id: 'ibnumajah', name: 'سنن ابن ماجه' },
    { id: 'malik', name: 'موطأ مالك' },
    { id: 'darimi', name: 'سنن الدارمي' }
  ]);

  const [selectedBook, setSelectedBook] = useState('muslim');
  const [hadithRange, setHadithRange] = useState({ start: 1, end: 20 }); // تغيير من 5 إلى 20
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [arabicExplanation, setArabicExplanation] = useState({});

  const translateExplanation = (englishText) => {
    const translations = {
      "And it is the famous narration from the Messenger of Allah": "وهو الأثر المشهور عن رسول الله صلى الله عليه وسلم",
      "Whoever narrates a hadith from me that is thought to be a lie": "من حدث عني بحديث يرى أنه كذب",
      "then he is one of the liars": "فهو أحد الكاذبين",
      "Narrated by Abu Bakr bin Abi Shaybah": "رواه أبو بكر بن أبي شيبة",
      "This hadith has been transmitted by another chain of narrators": "هذا الحديث روي بأسانيد أخرى",
      "The Prophet (peace be upon him) said": "قال النبي صلى الله عليه وسلم",
      "The Messenger of Allah (peace be upon him) said": "قال رسول الله صلى الله عليه وسلم",
      "It was narrated that": "روي عن",
      "This is a sahih hadith": "هذا حديث صحيح",
      "This hadith is hasan": "هذا حديث حسن",
      "This hadith is da'if": "هذا حديث ضعيف",
    };

    return englishText.split('\n').map(line => {
      let translatedLine = line;
      Object.entries(translations).forEach(([eng, ar]) => {
        translatedLine = translatedLine.replace(new RegExp(eng, 'g'), ar);
      });
      return translatedLine;
    }).join('\n');
  };

  const fetchHadiths = async () => {
    try {
      setLoading(true);
      setError(null);
      setHadiths([]);

      const response = await fetch(
        `https://api.hadith.gading.dev/books/${selectedBook}?range=${hadithRange.start}-${hadithRange.end}`
      );

      if (!response.ok) {
        throw new Error('فشل في جلب الأحاديث');
      }

      const data = await response.json();

      if (data.data?.hadiths) {
        setHadiths(data.data.hadiths);
        const newExplanations = {};
        data.data.hadiths.forEach(hadith => {
          newExplanations[hadith.number] = translateExplanation(hadith.id || "No explanation available");
        });
        setArabicExplanation(newExplanations);
      } else {
        throw new Error('لا توجد أحاديث متاحة');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadiths();
  }, [selectedBook, hadithRange]);

  const handleRangeChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setHadithRange({
      start: value,
      end: Math.min(value + 19, 300) // تغيير من +4 إلى +19 ليكون المجموع 20 حديثًا
    });
  };

  const formatArabicText = (text) => {
    return text
      .replace(/\./g, '.\n')
      .replace(/،/g, '،\n')
      .split('\n')
      .map((line, i) => <p key={i} className="mb-3 text-justify">{line}</p>);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50 p-4 md:p-8 mt-[75px]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-emerald-100 rounded-full p-3 mb-4">
            <svg className="w-10 h-10 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3 font-sans">
            مكتبة الأحاديث النبوية
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            موسوعة علمية محكمة لأحاديث رسول الله صلى الله عليه وسلم
          </p>
        </header>

        {/* Search Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                اختر كتاب الحديث
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-medium transition duration-150"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                disabled={loading}
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id} className="text-lg">
                    {book.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                رقم الحديث (1-300)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center font-medium transition duration-150"
                  value={hadithRange.start}
                  onChange={handleRangeChange}
                  min="1"
                  max="281" // تغيير من 296 إلى 281 لأننا نريد أن ينتهي عند 300 عندما نضيف 19
                  disabled={loading}
                />
                <span className="text-gray-500 font-medium">إلى</span>
                <div className="flex-1 p-3 bg-emerald-50 rounded-lg text-center font-bold text-emerald-800 border border-emerald-100">
                  {hadithRange.end}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg flex items-start">
            <svg className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">حدث خطأ</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600 mb-5"></div>
            <p className="text-gray-600 font-medium text-lg">جاري تحميل الأحاديث...</p>
          </div>
        )}

        {/* Hadith Content */}
        {!loading && hadiths.length > 0 && (
          <div className="space-y-8">
            {hadiths.map((hadith) => (
              <div key={hadith.number} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-lg">
                {/* Hadith Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="bg-white text-emerald-800 font-bold rounded-full w-9 h-9 flex items-center justify-center mr-3 shadow-sm">
                      {hadith.number}
                    </span>
                    <span className="text-white font-bold text-xl">
                      {books.find(b => b.id === selectedBook)?.name}
                    </span>
                  </div>
                  <span className="bg-emerald-800 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    حديث شريف
                  </span>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'text' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      نص الحديث
                    </button>
                    <button
                      onClick={() => setActiveTab('explanation')}
                      className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'explanation' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      شرح الحديث
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-8">
                  {activeTab === 'text' ? (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        نص الحديث الشريف
                      </h3>
                      <div className="text-gray-800 text-2xl leading-loose font-arabic text-right">
                        {formatArabicText(hadith.arab)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                        <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        شرح الحديث
                      </h3>
                      <div className="text-gray-700 leading-relaxed text-lg">
                        {arabicExplanation[hadith.number] ? (
                          <div className="space-y-5">
                            {arabicExplanation[hadith.number].split('\n').map((paragraph, i) => (
                              <p key={i} className="text-justify">{paragraph}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                            <div className="flex items-start">
                              <svg className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <p className="text-yellow-700">جاري تحضير الشرح لهذا الحديث...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        {!loading && hadiths.length > 0 && (
          <div className="flex justify-between mt-6 mb-12">
            <button
              onClick={() => setHadithRange(prev => ({
                start: Math.max(1, prev.start - 20), // تغيير من -5 إلى -20
                end: Math.max(20, prev.end - 20) // تغيير من -5 إلى -20
              }))}
              disabled={hadithRange.start <= 1 || loading}
              className={`px-6 py-3 rounded-lg flex items-center transition duration-150 ${hadithRange.start <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              الصفحة السابقة
            </button>
            <button
              onClick={() => setHadithRange(prev => ({
                start: prev.start + 20, // تغيير من +5 إلى +20
                end: Math.min(prev.end + 20, 300) // تغيير من +5 إلى +20
              }))}
              disabled={hadithRange.end >= 300 || loading}
              className={`px-6 py-3 rounded-lg flex items-center transition duration-150 ${hadithRange.end >= 300 ? 'bg-emerald-400 text-white cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              الصفحة التالية
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && hadiths.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
            <div className="mx-auto h-28 w-28 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <svg className="h-14 w-14 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">لا توجد أحاديث</h3>
            <p className="text-gray-600 mb-5 text-lg">اختر كتاباً ونطاقاً مناسباً لعرض الأحاديث</p>
            <button
              onClick={() => setHadithRange({ start: 1, end: 20 })} // تغيير من 5 إلى 20
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-150 text-lg"
            >
              عرض الأحاديث الأولى
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex justify-center space-x-6 mb-5">
            <a href="#" className="text-gray-500 hover:text-emerald-600 transition duration-150">
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 transition duration-150">
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-emerald-600 transition duration-150">
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-gray-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} - مكتبة الأحاديث النبوية
          </p>
          <p className="text-xs text-gray-400 mt-2">
            مصمم بعناية لخدمة السنة النبوية الشريفة
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Hadith;
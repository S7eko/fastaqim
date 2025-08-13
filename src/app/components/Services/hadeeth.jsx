"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookQuran,
  faPlay,
  faPause,
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faExclamationTriangle,
  faInfoCircle,
  faSearch
} from '@fortawesome/free-solid-svg-icons';

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

  const [selectedBook, setSelectedBook] = useState('bukhari');
  const [hadithRange, setHadithRange] = useState({ start: 1, end: 20 });
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [arabicExplanation, setArabicExplanation] = useState({});

  // Local translation function for static English explanations
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
      setArabicExplanation({});

      const response = await fetch(
        `https://api.hadith.gading.dev/books/${selectedBook}?range=${hadithRange.start}-${hadithRange.end}`
      );

      if (!response.ok) {
        throw new Error('فشل في جلب الأحاديث. يرجى المحاولة مرة أخرى.');
      }

      const data = await response.json();

      if (data.data?.hadiths) {
        setHadiths(data.data.hadiths);
        const newExplanations = {};
        data.data.hadiths.forEach(hadith => {
          newExplanations[hadith.number] = translateExplanation(hadith.id || "لا يوجد شرح متاح لهذا الحديث.");
        });
        setArabicExplanation(newExplanations);
      } else {
        throw new Error('لا توجد أحاديث متاحة في هذا النطاق.');
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
      end: Math.min(value + 19, 300)
    });
  };

  const formatArabicText = (text) => {
    return text.split(/(?=[.،؟!])/).map((sentence, i) => (
      <p key={i} className="mb-4 text-justify leading-relaxed">
        {sentence.trim()}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12 mt-16 md:mt-24">
          <div className="inline-flex items-center justify-center text-primary-foreground bg-primary rounded-full p-4 mb-4 shadow-lg">
            <FontAwesomeIcon icon={faBookQuran} className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 font-tajawal">
            مكتبة الأحاديث النبوية
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            موسوعة علمية محكمة لأحاديث رسول الله صلى الله عليه وسلم
          </p>
        </header>

        {/* Search Controls */}
        <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 md:p-8 mb-12 border border-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <label className="block text-sm font-medium mb-2">
                اختر كتاب الحديث
              </label>
              <select
                className="w-full p-3 border border-card/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-lg font-medium bg-background transition-colors duration-200"
                value={selectedBook}
                onChange={(e) => {
                  setSelectedBook(e.target.value);
                  setHadithRange({ start: 1, end: 20 });
                }}
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
              <label className="block text-sm font-medium mb-2">
                نطاق الأحاديث
              </label>
              <div className="relative flex items-center space-x-4 rtl:space-x-reverse">
                <input
                  type="number"
                  className="w-24 p-3 border border-card/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-center font-medium bg-background transition-colors duration-200"
                  value={hadithRange.start}
                  onChange={handleRangeChange}
                  min="1"
                  max="281"
                  disabled={loading}
                />
                <span className="text-foreground/50 font-medium">إلى</span>
                <div className="p-3 w-24 bg-background rounded-lg text-center font-bold border border-card/50">
                  {hadithRange.end}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50/20 dark:bg-red-900/30 border-r-4 border-red-500 p-6 mb-8 rounded-lg flex items-start space-x-4 rtl:space-x-reverse">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-7 w-7 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-300">حدث خطأ</h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-5xl text-primary mb-6" />
            <p className="text-foreground/70 font-medium text-lg">جاري تحميل الأحاديث...</p>
          </div>
        )}

        {/* Hadith Content */}
        {!loading && hadiths.length > 0 && (
          <div className="space-y-12">
            {hadiths.map((hadith) => (
              <div
                key={hadith.number}
                className="bg-card text-card-foreground rounded-xl shadow-xl overflow-hidden border border-card/50 transition-all duration-300 transform hover:scale-[1.01]"
              >
                {/* Hadith Header */}
                <div className="bg-primary text-primary-foreground px-6 py-4 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="bg-white text-primary font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-sm text-xl">
                      {hadith.number}
                    </span>
                    <span className="font-bold text-xl">{books.find(b => b.id === selectedBook)?.name}</span>
                  </div>
                  <span className="bg-primary/80 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                    حديث شريف
                  </span>
                </div>

                {/* Tabs */}
                <div className="border-b border-card/50">
                  <nav className="flex justify-center md:justify-start">
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`px-6 py-4 text-base font-medium flex items-center transition-colors duration-200 ${activeTab === 'text' ? 'text-primary border-b-2 border-primary' : 'text-card-foreground/60 hover:text-card-foreground hover:bg-card/50'}`}
                    >
                      <FontAwesomeIcon icon={faBookQuran} className="w-5 h-5 ml-2" />
                      نص الحديث
                    </button>
                    <button
                      onClick={() => setActiveTab('explanation')}
                      className={`px-6 py-4 text-base font-medium flex items-center transition-colors duration-200 ${activeTab === 'explanation' ? 'text-primary border-b-2 border-primary' : 'text-card-foreground/60 hover:text-card-foreground hover:bg-card/50'}`}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5 ml-2" />
                      شرح الحديث
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-8">
                  {activeTab === 'text' ? (
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center space-x-3 rtl:space-x-reverse">
                        <FontAwesomeIcon icon={faBookQuran} className="w-6 h-6 text-primary" />
                        نص الحديث الشريف
                      </h3>
                      <div className="text-foreground/90 text-2xl leading-loose font-arabic text-right">
                        {formatArabicText(hadith.arab)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold mb-6 flex items-center space-x-3 rtl:space-x-reverse">
                        <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 text-primary" />
                        شرح الحديث
                      </h3>
                      <div className="text-foreground/80 leading-relaxed text-lg">
                        {arabicExplanation[hadith.number] ? (
                          <div className="space-y-5">
                            {arabicExplanation[hadith.number].split('\n').map((paragraph, i) => (
                              <p key={i} className="text-justify">{paragraph}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-accent/10 border-r-4 border-accent p-6 rounded-lg flex items-start space-x-4 rtl:space-x-reverse">
                            <FontAwesomeIcon icon={faInfoCircle} className="h-7 w-7 text-accent" />
                            <p className="text-accent-foreground text-lg">
                              لا يوجد شرح متاح لهذا الحديث.
                            </p>
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
          <div className="flex justify-between mt-12 mb-12">
            <button
              onClick={() => setHadithRange(prev => ({
                start: Math.max(1, prev.start - 20),
                end: Math.max(20, prev.end - 20)
              }))}
              disabled={hadithRange.start <= 1 || loading}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors duration-200 shadow-md ${hadithRange.start <= 1 ? 'bg-secondary/20 text-secondary-foreground/40 cursor-not-allowed' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
            >
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              <span>الصفحة السابقة</span>
            </button>
            <button
              onClick={() => setHadithRange(prev => ({
                start: prev.start + 20,
                end: Math.min(prev.end + 20, 300)
              }))}
              disabled={hadithRange.end >= 300 || loading}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors duration-200 shadow-md ${hadithRange.end >= 300 ? 'bg-secondary/20 text-secondary-foreground/40 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/80'}`}
            >
              <span>الصفحة التالية</span>
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && hadiths.length === 0 && !error && (
          <div className="bg-card text-card-foreground rounded-xl shadow-xl p-8 md:p-12 text-center border border-card/50">
            <div className="mx-auto h-28 w-28 text-primary bg-primary/20 rounded-full flex items-center justify-center mb-5">
              <FontAwesomeIcon icon={faBookQuran} className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-bold mb-3">لا توجد أحاديث</h3>
            <p className="text-foreground/70 mb-5 text-lg">اختر كتاباً ونطاقاً مناسباً لعرض الأحاديث.</p>
            <button
              onClick={() => {
                setHadithRange({ start: 1, end: 20 });
                fetchHadiths();
              }}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors duration-200 text-lg shadow-md"
            >
              عرض الأحاديث الأولى
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hadith;
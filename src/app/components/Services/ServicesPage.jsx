"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookQuran,
  faPlay,
  faPause,
  faCircleNotch,
  faChevronDown,
  faChevronUp,
  faSearch,
  faVolumeHigh,
  faBookOpen,
  faMoon, // New icon for dark mode toggle
  faSun   // New icon for light mode toggle
} from '@fortawesome/free-solid-svg-icons';

const ServicesPage = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [loadingReciters, setLoadingReciters] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('surahs');
  const [surahs, setSurahs] = useState([]);
  const [reciters, setReciters] = useState([]);
  const [filteredReciters, setFilteredReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [reciterAudios, setReciterAudios] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState(false);
  const [isReciterDropdownOpen, setIsReciterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('dark'); // Default to dark theme as requested
  const surahDropdownRef = useRef(null);
  const reciterDropdownRef = useRef(null);
  const pageInputRef = useRef(null);

  // Apply dark mode class to HTML element on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (surahDropdownRef.current && !surahDropdownRef.current.contains(event.target)) {
        setIsSurahDropdownOpen(false);
      }
      if (reciterDropdownRef.current && !reciterDropdownRef.current.contains(event.target)) {
        setIsReciterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus page input when pages tab is selected
  useEffect(() => {
    if (activeTab === 'pages' && pageInputRef.current) {
      pageInputRef.current.focus();
    }
  }, [activeTab]);

  // Filter reciters based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReciters(reciters);
    } else {
      const filtered = reciters.filter(reciter =>
        reciter.reciter_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReciters(filtered);
    }
  }, [searchQuery, reciters]);

  // Fetch all surahs
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://alquran.vip/APIs/surahs');
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setSurahs(data);
      } catch (err) {
        console.error('Error fetching surahs:', err);
        setError('فشل تحميل السور. يرجى المحاولة مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  // Fetch all reciters
  useEffect(() => {
    const fetchReciters = async () => {
      try {
        setLoadingReciters(true);
        const response = await fetch('https://alquran.vip/APIs/reciters');
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setReciters(data.reciters);
        setFilteredReciters(data.reciters);
      } catch (err) {
        console.error('Error fetching reciters:', err);
      } finally {
        setLoadingReciters(false);
      }
    };
    fetchReciters();
  }, []);

  // Fetch reciter audios when selected
  useEffect(() => {
    if (!selectedReciter) return;
    const fetchReciterAudios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://alquran.vip/APIs/reciterAudio?reciter_id=${selectedReciter}`);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setReciterAudios(data.audio_urls);
      } catch (err) {
        console.error('Error fetching reciter audios:', err);
        setError('فشل تحميل التلاوات.');
      } finally {
        setLoading(false);
      }
    };
    fetchReciterAudios();
  }, [selectedReciter]);

  // Fetch Ayahs when Surah is selected
  useEffect(() => {
    if (!selectedSurah) return;
    const fetchAyahs = async () => {
      try {
        setLoadingAyahs(true);
        const response = await fetch(`https://alquran.vip/APIs/ayah?number=${selectedSurah.number}`);
        if (!response.ok) throw new Error('Failed to fetch Ayahs');
        const data = await response.json();
        setAyahs(data);
      } catch (err) {
        console.error('Error fetching Ayahs:', err);
      } finally {
        setLoadingAyahs(false);
      }
    };
    fetchAyahs();
  }, [selectedSurah]);

  // Fetch Quran page when currentPage changes
  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoadingPages(true);
        const response = await fetch(`https://alquran.vip/APIs/quranPagesText?page=${currentPage}`);
        if (!response.ok) throw new Error('Failed to fetch page');
        const data = await response.json();
        setPages(data.data.ayahs);
      } catch (err) {
        console.error('Error fetching page:', err);
        setError('فشل تحميل الصفحة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoadingPages(false);
      }
    };
    if (activeTab === 'pages') fetchPage();
  }, [currentPage, activeTab]);

  // Audio controls
  const playAudio = (audioUrl, surahId) => {
    if (audioPlayer) {
      audioPlayer.pause();
      if (currentlyPlaying === surahId) {
        setCurrentlyPlaying(null);
        return;
      }
    }
    const newAudio = new Audio(audioUrl);
    newAudio.play();
    newAudio.onended = () => setCurrentlyPlaying(null);
    setAudioPlayer(newAudio);
    setCurrentlyPlaying(surahId);
  };

  const stopAudio = () => {
    if (audioPlayer) audioPlayer.pause();
    setCurrentlyPlaying(null);
  };

  // Handlers
  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah);
    setIsSurahDropdownOpen(false);
  };

  const handleReciterSelect = (reciter) => {
    setSelectedReciter(reciter.reciter_id);
    setIsReciterDropdownOpen(false);
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    const page = Math.max(1, Math.min(newPage, 604));
    setCurrentPage(page);
  };

  const handlePageInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setCurrentPage(Math.max(1, Math.min(value, 604)));
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = parseInt(e.target.value);
      if (!isNaN(value)) {
        handlePageChange(value);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Render functions
  const renderError = () => (
    <div className="bg-card text-card-foreground p-4 md:p-6 rounded-lg shadow-md text-center border border-border">
      <div className="text-red-500 font-medium mb-3 md:mb-4">{error}</div>
      <button
        onClick={() => window.location.reload()}
        className="bg-card hover:bg-card-hover text-card-foreground px-3 py-1 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  const renderSurahDropdown = () => (
    <div className="relative mb-4 md:mb-6" ref={surahDropdownRef}>
      <button
        onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
        className="w-full flex justify-between items-center bg-card text-card-foreground border border-border rounded-lg p-3 md:p-4 text-right hover:bg-card-foreground/5 transition-colors shadow-sm"
      >
        <span className="text-sm md:text-base">
          {selectedSurah ? `${selectedSurah.number}. ${selectedSurah.name_ar}` : 'اختر سورة من القائمة'}
        </span>
        <FontAwesomeIcon
          icon={isSurahDropdownOpen ? faChevronUp : faChevronDown}
          className="text-foreground/50 text-sm"
        />
      </button>

      {isSurahDropdownOpen && (
        <div className="absolute z-30 w-full mt-1 bg-card text-card-foreground border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {surahs.map(surah => (
            <button
              key={surah.id}
              onClick={() => handleSurahSelect(surah)}
              className={`w-full text-right p-3 md:p-4 hover:bg-card-foreground/5 transition-colors text-sm md:text-base ${selectedSurah?.id === surah.id ? 'bg-primary/10 text-primary' : 'text-card-foreground'
                }`}
            >
              <span className="text-foreground/50 mr-2">{surah.number}.</span>
              <span className="font-medium">{surah.name_ar}</span>
              <span className="text-foreground/40 text-xs md:text-sm mr-2">({surah.name_en_translation})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderReciterDropdown = () => (
    <div className="relative mb-4 md:mb-6" ref={reciterDropdownRef}>
      <button
        onClick={() => setIsReciterDropdownOpen(!isReciterDropdownOpen)}
        className="w-full flex justify-between items-center bg-card text-card-foreground border border-border rounded-lg p-3 md:p-4 text-right hover:bg-card-foreground/5 transition-colors shadow-sm"
        disabled={loadingReciters}
      >
        <span className="text-sm md:text-base">
          {loadingReciters ? 'جاري تحميل القراء...' :
            selectedReciter ?
              reciters.find(r => r.reciter_id === selectedReciter)?.reciter_name :
              'اختر قارئًا من القائمة'}
        </span>
        {!loadingReciters && (
          <FontAwesomeIcon
            icon={isReciterDropdownOpen ? faChevronUp : faChevronDown}
            className="text-foreground/50 text-sm"
          />
        )}
      </button>

      {isReciterDropdownOpen && !loadingReciters && (
        <div className="absolute z-30 w-full mt-1 bg-card text-card-foreground border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="sticky top-0 bg-card p-2 border-b border-border">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-foreground/50 text-sm" />
              <input
                type="text"
                placeholder="ابحث عن قارئ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-foreground/5 text-card-foreground rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          {filteredReciters.length > 0 ? (
            filteredReciters.map(reciter => (
              <button
                key={reciter.reciter_id}
                onClick={() => handleReciterSelect(reciter)}
                className={`w-full text-right p-3 md:p-4 hover:bg-card-foreground/5 transition-colors text-sm md:text-base ${selectedReciter === reciter.reciter_id ? 'bg-primary/10 text-primary' : 'text-card-foreground'
                  }`}
              >
                {reciter.reciter_name}
              </button>
            ))
          ) : (
            <div className="p-4 text-foreground/50 text-center text-sm md:text-base">لا توجد نتائج</div>
          )}
        </div>
      )}
    </div>
  );

  const renderSurahContent = () => {
    if (!selectedSurah) return (
      <div className="bg-card rounded-lg p-4 md:p-6 text-center border border-border shadow-sm">
        <p className="text-foreground/50 text-sm md:text-base">اختر سورة من القائمة لعرض محتواها</p>
      </div>
    );

    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
        <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border gap-2 md:gap-3">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-card-foreground">{selectedSurah.name_ar}</h3>
            <p className="text-primary mt-1 text-sm md:text-base">{selectedSurah.name_en_translation}</p>
          </div>
          <div className="flex gap-1 md:gap-2">
            <span className="bg-foreground/5 text-primary px-2 py-1 rounded-full text-xs md:text-sm">
              {selectedSurah.type === 'Meccan' ? 'مكية' : 'مدنية'}
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs md:text-sm">
              {selectedSurah.ayat_count} آيات
            </span>
          </div>
        </div>

        {loadingAyahs ? (
          <div className="flex justify-center py-8 md:py-12">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-xl md:text-2xl text-primary" />
          </div>
        ) : ayahs.length > 0 ? (
          <div className="p-4 md:p-6 font-arabic">
            {selectedSurah.number !== '9' && (
              <p className="text-center text-2xl md:text-3xl font-bold my-4 md:my-6 text-primary">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            )}

            <div className="text-xl md:text-2xl leading-loose text-card-foreground" style={{ lineHeight: '2.5rem' }}>
              {ayahs.map(ayah => (
                <React.Fragment key={ayah.id}>
                  <span>{ayah.text}</span>
                  <span className="text-primary font-bold mx-1 text-base md:text-lg">
                    {' ('}{new Intl.NumberFormat('ar-EG').format(ayah.number_in_surah)}{') '}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-foreground/50 text-center py-8 md:py-12 text-sm md:text-base">لا توجد آيات متاحة لهذه السورة</p>
        )}
      </div>
    );
  };

  const renderAudioList = () => {
    if (!selectedReciter) return (
      <div className="bg-card rounded-lg p-4 md:p-6 text-center border border-border shadow-sm">
        <p className="text-foreground/50 text-sm md:text-base">اختر قارئًا من القائمة لعرض التلاوات المتاحة</p>
      </div>
    );

    return (
      <div className="space-y-2 md:space-y-3">
        {loading ? (
          <div className="flex justify-center py-8 md:py-12">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-xl md:text-2xl text-primary" />
          </div>
        ) : reciterAudios.length > 0 ? (
          reciterAudios.map(audio => (
            <div
              key={audio.surah_id}
              className="bg-card rounded-lg border border-border p-3 md:p-4 flex justify-between items-center hover:bg-card-foreground/5 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-primary/10 p-1 md:p-2 rounded-full">
                  <FontAwesomeIcon icon={faVolumeHigh} className="text-primary text-sm md:text-base" />
                </div>
                <div>
                  <p className="font-medium text-card-foreground text-sm md:text-base">{audio.surah_name_ar}</p>
                  <p className="text-foreground/50 text-xs md:text-sm mt-1">{audio.surah_name_en}</p>
                </div>
              </div>
              <button
                onClick={() => playAudio(audio.audio_url, audio.surah_id)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-md transition-all ${currentlyPlaying === audio.surah_id
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-primary-foreground'
                  }`}
                aria-label={currentlyPlaying === audio.surah_id ? 'إيقاف' : 'تشغيل'}
              >
                <FontAwesomeIcon
                  icon={currentlyPlaying === audio.surah_id ? faPause : faPlay}
                  className="text-sm md:text-lg"
                />
              </button>
            </div>
          ))
        ) : (
          <p className="text-foreground/50 text-center py-6 md:py-8 text-sm md:text-base">لا توجد تلاوات متاحة لهذا القارئ</p>
        )}
      </div>
    );
  };

  const renderPageContent = () => {
    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
        {/* Page Number Display - Top */}
        <div className="flex justify-center items-center py-3 bg-card-foreground/5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-card-foreground font-medium text-sm md:text-base">الصفحة:</span>
            <input
              ref={pageInputRef}
              type="number"
              min="1"
              max="604"
              value={currentPage}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputKeyDown}
              className="w-16 md:w-20 px-2 py-1 text-center text-sm md:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            />
            <span className="text-card-foreground text-xs md:text-sm">من 604</span>
          </div>
        </div>

        {/* Quranic Text Content */}
        {loadingPages ? (
          <div className="flex justify-center items-center py-12 md:py-16">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-3xl md:text-4xl text-primary" />
          </div>
        ) : pages.length > 0 ? (
          <div className="p-4 md:p-6 font-uthmanic-hafs">
            <div className="text-lg md:text-xl leading-[2.2rem] md:leading-[3rem] text-card-foreground text-right">
              {pages.map(ayah => (
                <React.Fragment key={ayah.number}>
                  <span>{ayah.text}</span>
                  {ayah.numberInSurah && (
                    <span className="inline-block relative top-[-0.2em] mx-1 text-primary font-bold text-sm md:text-base">
                      {' ('}{new Intl.NumberFormat('ar-EG').format(ayah.numberInSurah)}{') '}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-foreground/50 text-center py-8 md:py-12 text-sm md:text-base">لا توجد آيات متاحة لهذه الصفحة</p>
        )}

        {/* Navigation Arrows - Bottom */}
        <div className="flex justify-between items-center py-3 bg-card-foreground/5 border-t border-border px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${currentPage <= 1
              ? 'text-foreground/40 cursor-not-allowed'
              : 'text-primary hover:bg-card-foreground/5'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm">السابقة</span>
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= 604}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${currentPage >= 604
              ? 'text-foreground/40 cursor-not-allowed'
              : 'text-primary hover:bg-card-foreground/5'
              }`}
          >
            <span className="text-sm">التالية</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (error) return renderError();

    switch (activeTab) {
      case 'surahs':
        return (
          <div className="space-y-4 md:space-y-6">
            {renderSurahDropdown()}
            {renderSurahContent()}
          </div>
        );
      case 'audio':
        return (
          <div className="space-y-4 md:space-y-6">
            {renderReciterDropdown()}
            {renderAudioList()}
          </div>
        );
      case 'pages':
        return renderPageContent();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20 pb-24 md:pt-24 md:pb-32" dir="rtl">
      {/* Header/Theme Toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm flex items-center justify-between px-3 md:px-6 py-2">
        <h1 className="text-lg font-bold text-foreground md:text-xl">
          <FontAwesomeIcon icon={faBookQuran} className="ml-2 text-primary" />
          منصة القرآن الكريم
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Toggle dark mode"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-lg" />
        </button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-3 md:px-4 max-w-4xl">
        {/* Tab Navigation */}
        <div className="bg-card rounded-lg md:rounded-xl shadow-lg overflow-hidden mb-6 md:mb-8 border border-border">
          <div className="flex">
            {[
              { id: 'surahs', icon: faBookQuran, label: 'السور' },
              { id: 'audio', icon: faPlay, label: 'التلاوات' },
              { id: 'pages', icon: faBookOpen, label: 'صفحات المصحف' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  stopAudio();
                }}
                className={`flex-1 py-3 md:py-4 flex flex-col items-center justify-center transition-all relative group ${activeTab === tab.id
                  ? 'text-primary'
                  : 'text-foreground/50 hover:text-primary/70'
                  }`}
              >
                <FontAwesomeIcon
                  icon={tab.icon}
                  className={`text-base md:text-lg mb-1 md:mb-2 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''
                    }`}
                />
                <span className="text-xs md:text-sm font-medium">{tab.label}</span>
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-primary transform transition-transform duration-300 ${activeTab === tab.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                ></div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 border border-border">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border py-2 md:py-3 text-center text-xs text-foreground/50 shadow-lg">
        جميع الحقوق محفوظة © {new Date().getFullYear()} منصة القرآن الكريم
      </footer>
    </div>
  );
};

export default ServicesPage;
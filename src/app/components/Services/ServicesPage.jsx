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
  faSearch
} from '@fortawesome/free-solid-svg-icons';

const ServicesPage = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [loadingReciters, setLoadingReciters] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
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
  const [isSurahDropdownOpen, setIsSurahDropdownOpen] = useState(false);
  const [isReciterDropdownOpen, setIsReciterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const surahDropdownRef = useRef(null);
  const reciterDropdownRef = useRef(null);

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

  // Render functions
  const renderError = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow text-center border border-gray-700">
      <div className="text-red-400 font-medium mb-4">{error}</div>
      <button
        onClick={() => window.location.reload()}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  const renderSurahDropdown = () => (
    <div className="relative mb-6" ref={surahDropdownRef}>
      <button
        onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
        className="w-full flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg p-4 text-right hover:bg-gray-700 transition-colors"
      >
        <span className="text-gray-200">
          {selectedSurah ? `${selectedSurah.number}. ${selectedSurah.name_ar}` : 'اختر سورة من القائمة'}
        </span>
        <FontAwesomeIcon
          icon={isSurahDropdownOpen ? faChevronUp : faChevronDown}
          className="text-gray-400"
        />
      </button>

      {isSurahDropdownOpen && (
        <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {surahs.map(surah => (
            <button
              key={surah.id}
              onClick={() => handleSurahSelect(surah)}
              className={`w-full text-right p-4 hover:bg-gray-700 transition-colors ${selectedSurah?.id === surah.id ? 'bg-gray-700 text-emerald-300' : 'text-gray-300'}`}
            >
              <span className="text-gray-400 mr-2">{surah.number}.</span>
              <span className="font-medium">{surah.name_ar}</span>
              <span className="text-gray-400 text-sm mr-2">({surah.name_en_translation})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderReciterDropdown = () => (
    <div className="relative mb-6" ref={reciterDropdownRef}>
      <button
        onClick={() => setIsReciterDropdownOpen(!isReciterDropdownOpen)}
        className="w-full flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg p-4 text-right hover:bg-gray-700 transition-colors"
        disabled={loadingReciters}
      >
        <span className="text-gray-200">
          {loadingReciters ? 'جاري تحميل القراء...' :
            selectedReciter ?
              reciters.find(r => r.reciter_id === selectedReciter)?.reciter_name :
              'اختر قارئًا من القائمة'}
        </span>
        {!loadingReciters && (
          <FontAwesomeIcon
            icon={isReciterDropdownOpen ? faChevronUp : faChevronDown}
            className="text-gray-400"
          />
        )}
      </button>

      {isReciterDropdownOpen && !loadingReciters && (
        <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 p-2 border-b border-gray-700">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن قارئ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
          {filteredReciters.length > 0 ? (
            filteredReciters.map(reciter => (
              <button
                key={reciter.reciter_id}
                onClick={() => handleReciterSelect(reciter)}
                className={`w-full text-right p-4 hover:bg-gray-700 transition-colors ${selectedReciter === reciter.reciter_id ? 'bg-gray-700 text-emerald-300' : 'text-gray-300'}`}
              >
                {reciter.reciter_name}
              </button>
            ))
          ) : (
            <div className="p-4 text-gray-400 text-center">لا توجد نتائج</div>
          )}
        </div>
      )}
    </div>
  );

  const renderSurahContent = () => {
    if (!selectedSurah) return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <p className="text-gray-400">اختر سورة من القائمة لعرض محتواها</p>
      </div>
    );

    return (
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 gap-3">
          <div>
            <h3 className="text-2xl font-bold text-white">{selectedSurah.name_ar}</h3>
            <p className="text-emerald-400 mt-1">{selectedSurah.name_en_translation}</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-gray-700 text-emerald-300 px-3 py-1 rounded-full text-sm">
              {selectedSurah.type === 'Meccan' ? 'مكية' : 'مدنية'}
            </span>
            <span className="bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full text-sm">
              {selectedSurah.ayat_count} آيات
            </span>
          </div>
        </div>

        {loadingAyahs ? (
          <div className="flex justify-center py-12">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-emerald-400" />
          </div>
        ) : ayahs.length > 0 ? (
          <div className="p-6 font-arabic">
            {selectedSurah.number !== '9' && (
              <p className="text-center text-3xl font-bold my-8 text-emerald-300">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            )}

            <div className="text-2xl leading-loose text-gray-100" style={{ lineHeight: '3' }}>
              {ayahs.map(ayah => (
                <React.Fragment key={ayah.id}>
                  <span>{ayah.text}</span>
                  <span className="text-emerald-400/80 font-bold mx-1 text-xl">
                    {' ('}{new Intl.NumberFormat('ar-EG').format(ayah.number_in_surah)}{') '}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">لا توجد آيات متاحة لهذه السورة</p>
        )}
      </div>
    );
  };

  const renderAudioList = () => {
    if (!selectedReciter) return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <p className="text-gray-400">اختر قارئًا من القائمة لعرض التلاوات المتاحة</p>
      </div>
    );

    return (
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-emerald-400" />
          </div>
        ) : reciterAudios.length > 0 ? (
          reciterAudios.map(audio => (
            <div
              key={audio.surah_id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
            >
              <div>
                <p className="font-medium text-white">{audio.surah_name_ar}</p>
                <p className="text-sm text-gray-400 mt-1">{audio.surah_name_en}</p>
              </div>
              <button
                onClick={() => playAudio(audio.audio_url, audio.surah_id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${currentlyPlaying === audio.surah_id
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600/80 text-white hover:bg-emerald-500'
                  }`}
                aria-label={currentlyPlaying === audio.surah_id ? 'إيقاف' : 'تشغيل'}
              >
                <FontAwesomeIcon
                  icon={currentlyPlaying === audio.surah_id ? faPause : faPlay}
                  className="text-lg"
                />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-8">لا توجد تلاوات متاحة لهذا القارئ</p>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    if (error) return renderError();

    switch (activeTab) {
      case 'surahs':
        return (
          <div className="space-y-6">
            {renderSurahDropdown()}
            {renderSurahContent()}
          </div>
        );
      case 'audio':
        return (
          <div className="space-y-6">
            {renderReciterDropdown()}
            {renderAudioList()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-20" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white shadow-md mt-[62px] z-10 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">منصة القرآن الكريم</h1>
          <div className="text-center mt-2 space-y-1">
            <p className="text-emerald-300 text-sm">تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ</p>
            <p className="text-gray-400 text-xs">وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 border border-gray-700 mt-[90px]">
          <div className="flex">
            {[
              { id: 'surahs', icon: faBookQuran, label: 'السور' },
              { id: 'audio', icon: faPlay, label: 'التلاوات' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  stopAudio();
                }}
                className={`flex-1 py-5 flex flex-col items-center justify-center transition-colors ${activeTab === tab.id
                  ? 'bg-gray-700 text-emerald-300'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                  }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="text-lg mb-2" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-3 text-center text-xs text-gray-400">
        جميع الحقوق محفوظة © {new Date().getFullYear()} منصة القرآن الكريم
      </footer>
    </div>
  );
};

export default ServicesPage;
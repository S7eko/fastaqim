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
  faVolumeHigh
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
    <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
      <div className="text-red-500 font-medium mb-4">{error}</div>
      <button
        onClick={() => window.location.reload()}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  const renderSurahDropdown = () => (
    <div className="relative mb-6" ref={surahDropdownRef}>
      <button
        onClick={() => setIsSurahDropdownOpen(!isSurahDropdownOpen)}
        className="w-full flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 text-right hover:bg-gray-50 transition-colors shadow-sm"
      >
        <span className="text-gray-700">
          {selectedSurah ? `${selectedSurah.number}. ${selectedSurah.name_ar}` : 'اختر سورة من القائمة'}
        </span>
        <FontAwesomeIcon
          icon={isSurahDropdownOpen ? faChevronUp : faChevronDown}
          className="text-gray-500"
        />
      </button>

      {isSurahDropdownOpen && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {surahs.map(surah => (
            <button
              key={surah.id}
              onClick={() => handleSurahSelect(surah)}
              className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${selectedSurah?.id === surah.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
            >
              <span className="text-gray-500 mr-2">{surah.number}.</span>
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
        className="w-full flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 text-right hover:bg-gray-50 transition-colors shadow-sm"
        disabled={loadingReciters}
      >
        <span className="text-gray-700">
          {loadingReciters ? 'جاري تحميل القراء...' :
            selectedReciter ?
              reciters.find(r => r.reciter_id === selectedReciter)?.reciter_name :
              'اختر قارئًا من القائمة'}
        </span>
        {!loadingReciters && (
          <FontAwesomeIcon
            icon={isReciterDropdownOpen ? faChevronUp : faChevronDown}
            className="text-gray-500"
          />
        )}
      </button>

      {isReciterDropdownOpen && !loadingReciters && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن قارئ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {filteredReciters.length > 0 ? (
            filteredReciters.map(reciter => (
              <button
                key={reciter.reciter_id}
                onClick={() => handleReciterSelect(reciter)}
                className={`w-full text-right p-4 hover:bg-gray-50 transition-colors ${selectedReciter === reciter.reciter_id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
              >
                {reciter.reciter_name}
              </button>
            ))
          ) : (
            <div className="p-4 text-gray-500 text-center">لا توجد نتائج</div>
          )}
        </div>
      )}
    </div>
  );

  const renderSurahContent = () => {
    if (!selectedSurah) return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
        <p className="text-gray-500">اختر سورة من القائمة لعرض محتواها</p>
      </div>
    );

    return (
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 gap-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{selectedSurah.name_ar}</h3>
            <p className="text-blue-600 mt-1">{selectedSurah.name_en_translation}</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-gray-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {selectedSurah.type === 'Meccan' ? 'مكية' : 'مدنية'}
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {selectedSurah.ayat_count} آيات
            </span>
          </div>
        </div>

        {loadingAyahs ? (
          <div className="flex justify-center py-12">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-blue-500" />
          </div>
        ) : ayahs.length > 0 ? (
          <div className="p-6 font-arabic">
            {selectedSurah.number !== '9' && (
              <p className="text-center text-3xl font-bold my-8 text-blue-600">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            )}

            <div className="text-2xl leading-loose text-gray-800" style={{ lineHeight: '3' }}>
              {ayahs.map(ayah => (
                <React.Fragment key={ayah.id}>
                  <span>{ayah.text}</span>
                  <span className="text-blue-500 font-bold mx-1 text-xl">
                    {' ('}{new Intl.NumberFormat('ar-EG').format(ayah.number_in_surah)}{') '}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">لا توجد آيات متاحة لهذه السورة</p>
        )}
      </div>
    );
  };

  const renderAudioList = () => {
    if (!selectedReciter) return (
      <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
        <p className="text-gray-500">اختر قارئًا من القائمة لعرض التلاوات المتاحة</p>
      </div>
    );

    return (
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <FontAwesomeIcon icon={faCircleNotch} className="animate-spin text-2xl text-blue-500" />
          </div>
        ) : reciterAudios.length > 0 ? (
          reciterAudios.map(audio => (
            <div
              key={audio.surah_id}
              className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FontAwesomeIcon icon={faVolumeHigh} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{audio.surah_name_ar}</p>
                  <p className="text-sm text-gray-500 mt-1">{audio.surah_name_en}</p>
                </div>
              </div>
              <button
                onClick={() => playAudio(audio.audio_url, audio.surah_id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${currentlyPlaying === audio.surah_id
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'}`}
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
          <p className="text-gray-500 text-center py-8">لا توجد تلاوات متاحة لهذا القارئ</p>
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-sm z-10 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">منصة القرآن الكريم</h1>
          <div className="text-center mt-2 space-y-1">
            <p className="text-blue-600 text-sm">تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ</p>
            <p className="text-gray-500 text-xs">وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-200">
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
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="text-lg mb-2" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        جميع الحقوق محفوظة © {new Date().getFullYear()} منصة القرآن الكريم
      </footer>
    </div>
  );
};

export default ServicesPage;
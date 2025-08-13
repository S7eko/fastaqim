"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeXmark,
  faCircleNotch,
  faRotateRight
} from '@fortawesome/free-solid-svg-icons';

const RadioPlayer = () => {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRadio, setCurrentRadio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef(null);

  // Fetch radio data
  useEffect(() => {
    const fetchRadios = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://data-rosy.vercel.app/radio.json');
        if (!response.ok) {
          throw new Error('فشل في تحميل الإذاعات. الرجاء التحقق من اتصالك بالإنترنت.');
        }
        const data = await response.json();
        setRadios(data.radios);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRadios();
  }, []);

  // Handle play/pause
  const togglePlay = (radio) => {
    if (currentRadio?.id === radio.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentRadio(radio);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.play();
        }
      }, 50);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };

  // Retry loading
  const retryLoading = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  return (
    <div
      className={`mt-[62px] mb-[62px] min-h-screen transition-colors duration-300 
      bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6`}
      dir="rtl"
    >
      <div className="container mx-auto max-w-5xl pb-24">
        {/* Audio element */}
        <audio
          ref={audioRef}
          src={currentRadio?.url}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          volume={volume}
        />

        {/* Header */}
        <header className="text-center mb-10 relative">
          <h1 className="text-4xl font-extrabold mb-2 text-blue-600 dark:text-blue-400">
            مشغل الإذاعات القرآنية 📻
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            استمع إلى أجمل التلاوات من مشاهير القراء
          </p>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="animate-spin text-5xl text-blue-600 dark:text-blue-400"
            />
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              جاري تحميل الإذاعات...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="border-r-4 p-6 mb-8 rounded-lg bg-red-50 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-400 dark:text-red-200">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faRotateRight} className="text-red-500 dark:text-red-300 text-2xl ml-4 mt-1" />
              <div className="flex-1">
                <p className="font-medium text-lg">{error}</p>
                <button
                  onClick={retryLoading}
                  className="mt-3 flex items-center font-medium transition-colors duration-200 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FontAwesomeIcon icon={faRotateRight} className="ml-2" />
                  حاول مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Radio stations list */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {radios.map((radio) => (
              <div
                key={radio.id}
                className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] 
                ${currentRadio?.id === radio.id ? 'ring-4 ring-blue-500 dark:ring-blue-400 ring-offset-2' : ''} 
                bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-xl`}
                onClick={() => togglePlay(radio)}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <img
                      src={radio.img}
                      alt={radio.name}
                      className="w-16 h-16 rounded-full object-cover ml-4 border-4 border-blue-500 dark:border-blue-400 shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-right text-gray-800 dark:text-gray-100">
                        {radio.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {radio.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Player controls */}
        {currentRadio && (
          <div className="fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl border-t p-4">
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={currentRadio.img}
                    alt={currentRadio.name}
                    className="w-14 h-14 rounded-full object-cover ml-4 border-4 border-blue-500 dark:border-blue-400"
                  />
                  <div className="flex-1 text-center sm:text-right">
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">
                      {currentRadio.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isPlaying ? 'جاري التشغيل الآن' : 'متوقف'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-6 rtl:space-x-reverse justify-center w-full sm:w-auto">
                  <button
                    onClick={() => togglePlay(currentRadio)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors 
                      ${isPlaying
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                      } text-white shadow-lg`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-xl" />
                  </button>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-md"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-28 sm:w-36 h-2 rounded-full appearance-none transition-colors accent-blue-500 bg-gray-300 dark:bg-gray-600"
                      aria-label="Volume control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadioPlayer;

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeXmark,
  faCircleNotch,
  faTriangleExclamation,
  faRadio,
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
  const audioRef = useRef(null);

  // Fetch radio data
  useEffect(() => {
    const fetchRadios = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://data-rosy.vercel.app/radio.json');
        if (!response.ok) {
          throw new Error('Failed to load radio stations');
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
        audioRef.current.play();
      }, 0);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    audioRef.current.volume = isMuted ? volume : 0;
    setIsMuted(!isMuted);
  };

  // Retry loading
  const retryLoading = () => {
    setError(null);
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-6" dir="rtl">
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
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-blue-600 text-white shadow-lg">
            <FontAwesomeIcon icon={faRadio} className="text-3xl" />
          </div>
          <h1 className="text-4xl font-bold mb-3">مشغل الإذاعات القرآنية</h1>
          <p className="text-lg text-gray-700">استمع إلى أجمل التلاوات من مشاهير القراء</p>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="animate-spin text-4xl text-blue-600 mb-4"
            />
            <p className="text-gray-600">جاري تحميل الإذاعات...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-start">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-red-500 mt-1 mr-3"
              />
              <div>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={retryLoading}
                  className="mt-2 text-red-600 hover:text-red-800 flex items-center"
                >
                  <FontAwesomeIcon icon={faRotateRight} className="ml-1" />
                  حاول مرة أخرى
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Radio stations list */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {radios.map((radio) => (
              <div
                key={radio.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${currentRadio?.id === radio.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                  } cursor-pointer`}
                onClick={() => togglePlay(radio)}
              >
                <div className="p-4">
                  <div className="flex items-center">
                    <img
                      src={radio.img}
                      alt={radio.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{radio.name}</h3>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${currentRadio?.id === radio.id && isPlaying
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                      <FontAwesomeIcon
                        icon={currentRadio?.id === radio.id && isPlaying ? faPause : faPlay}
                        className="text-lg"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Player controls */}
        {currentRadio && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center">
                <img
                  src={currentRadio.img}
                  alt={currentRadio.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{currentRadio.name}</h4>
                  <p className="text-sm text-gray-600">
                    {isPlaying ? 'جاري التشغيل الآن' : 'متوقف'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => togglePlay(currentRadio)}
                    className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                  </button>
                  <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300"
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
                    className="w-24 accent-blue-500"
                  />
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
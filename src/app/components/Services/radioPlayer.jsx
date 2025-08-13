"use client";
import React, { useState, useEffect } from 'react';

const RadioPlayer = () => {
  const [radios, setRadios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRadio, setCurrentRadio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const audioRef = React.useRef(null);

  // Fetch radio data from API
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

  // Sync dark mode state with HTML class for Tailwind
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle play/pause logic
  const togglePlay = (radio) => {
    // If the same radio is selected, just toggle play/pause
    if (currentRadio?.id === radio.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // A new radio is selected
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentRadio(radio);
      setIsPlaying(true);
      // Wait for audio element to be updated with new source
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.volume = isMuted ? 0 : volume;
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
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
    }
    setIsMuted(!isMuted);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Retry loading
  const retryLoading = () => {
    setError(null);
    setLoading(true);
    // Reload the page to refetch data
    window.location.reload();
  };

  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  const VolumeHighIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );

  const VolumeXmarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .9-.2 1.74-.56 2.5l2.48 2.48C21.6 15.42 22 13.71 22 12c0-4.65-3.03-8.58-7-9.81v2.06c2.89.86 5 3.54 5 6.75zm-1.25 0l-2.45-2.45v2.21c-.05.21-.07.43-.07.66l2.52 2.52zm-3.8-9.9v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77zM9.48 4.08L7.96 5.59 7 4.5V2.02l2.44 2.06zM3.46 2.85l1.69 1.69c-.2.27-.38.56-.54.88L3 6.94V9h3l4-4.01V2.02L5.86 2.1c-1.12-.04-2.15.22-3.4.75zM2.5 5.5l1.58 1.58L3.13 6.74V9h.37L3 9.47v.88l-1.54-1.54C1.19 8.24 1 7.21 1 6.13c0-1.12.26-2.15.75-3.2L.44 1.44 1.44.44 2.5 1.5zM15 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63z" />
    </svg>
  );

 

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 9.25 14.18c-.61-.85-.92-1.83-.92-2.88 0-3.31 2.69-6 6-6a10 10 0 0 0-21.25 4.7z" />
    </svg>
  );

  const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 transition-colors duration-300" dir="rtl">
      <div className="container mx-auto max-w-5xl pb-24">
        {/* Audio element for playback */}
        <audio
          ref={audioRef}
          src={currentRadio?.url}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          volume={volume}
        />

        {/* Header */}
        <header className="text-center mb-12 mt-16 md:mt-24 relative">
        
          <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-primary text-primary-foreground shadow-lg">
            <h1 className="text-3xl font-extrabold font-tajawal">📻</h1>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 font-tajawal">
            مشغل الإذاعات القرآنية
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            استمع إلى أجمل التلاوات من مشاهير القراء
          </p>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-6 text-lg text-foreground/70">
              جاري تحميل الإذاعات...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 dark:bg-red-950 border-r-4 border-red-500 p-6 rounded-lg text-right flex items-start space-x-4 rtl:space-x-reverse">
            <div className="text-red-500 text-2xl mt-1 flex-shrink-0">
              <WarningIcon />
            </div>
            <div className="flex-1">
              <p className="font-medium text-lg text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={retryLoading}
                className="mt-3 flex items-center font-medium transition-colors duration-200 text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
              >
                <RotateRightIcon />
                حاول مرة أخرى
              </button>
            </div>
          </div>
        )}

        {/* Radio stations list */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {radios.map((radio) => (
              <div
                key={radio.id}
                className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${currentRadio?.id === radio.id ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : ''} bg-card hover:bg-card/80 text-card-foreground shadow-xl border border-card/50`}
                onClick={() => togglePlay(radio)}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    {/* Placeholder for the image to avoid broken links */}
                    <img
                      src={radio.img}
                      alt={radio.name}
                      className="w-16 h-16 rounded-full object-cover ml-4 border-4 border-primary shadow-md"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/2563eb/ffffff?text=📻"; }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-right">{radio.name}</h3>
                      <p className="text-sm text-card-foreground/70">{radio.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Player controls (fixed at the bottom) */}
        {currentRadio && (
          <div className="fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300 bg-card text-card-foreground border-t border-border shadow-2xl p-4 md:p-6">
            <div className="container mx-auto max-w-5xl">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                  {/* Placeholder for the image to avoid broken links */}
                  <img
                    src={currentRadio.img}
                    alt={currentRadio.name}
                    className="w-14 h-14 rounded-full object-cover ml-4 border-4 border-primary"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/56x56/2563eb/ffffff?text=📻"; }}
                  />
                  <div className="flex-1 text-center sm:text-right">
                    <h4 className="font-bold text-lg">{currentRadio.name}</h4>
                    <p className="text-sm text-card-foreground/70">
                      {isPlaying ? 'جاري التشغيل الآن' : 'متوقف'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 rtl:space-x-reverse justify-center w-full sm:w-auto">
                  <button
                    onClick={() => togglePlay(currentRadio)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-lg
                      ${isPlaying ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground' : 'bg-primary hover:bg-primary/80 text-primary-foreground'}`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-background hover:bg-background/80 shadow-md text-foreground/70 hover:text-foreground"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeXmarkIcon /> : <VolumeHighIcon />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-28 sm:w-36 h-2 rounded-full appearance-none transition-colors accent-primary bg-foreground/30"
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

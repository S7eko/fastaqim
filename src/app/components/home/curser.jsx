"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const IslamicSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [theme, setTheme] = useState('dark');

  const islamicSlides = [
    {
      id: 1,
      src: '/1.jpeg',
      alt: 'تعليم القرآن الكريم',
      title: 'تعلم التلاوة الصحيحة',
      verse: '﴿وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا﴾ - المزمل: 4'
    },
    {
      id: 2,
      src: '/2.jpeg',
      alt: 'تجويد القرآن الكريم',
      title: 'إتقان أحكام التجويد',
      verse: '﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾ - الحجر: 9'
    },
    {
      id: 3,
      src: '/3.jpeg',
      alt: 'حفظ القرآن الكريم',
      title: 'حفظ كتاب الله',
      verse: '﴿بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ﴾ - العنكبوت: 49'
    }
  ];

  // Apply dark mode class to HTML element on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auto-rotate with smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % islamicSlides.length);
        setIsAnimating(false);
      }, 800);
    }, 6000);
    return () => clearInterval(interval);
  }, [islamicSlides.length]);

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Toggle dark mode"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="text-lg" />
        </button>
      </div>

      <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden rounded-2xl shadow-xl mt-[75px]">
        {/* Slides container */}
        <div className="relative w-full h-full">
          {islamicSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.83,0,0.17,1)] ${index === currentIndex
                ? 'opacity-100 z-10 scale-100'
                : 'opacity-0 z-0 scale-105'
                } ${isAnimating && (index === currentIndex || index === (currentIndex + 1) % islamicSlides.length)
                  ? 'opacity-70'
                  : ''
                }`}
            >
              {/* Background image with parallax effect */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className={`object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.33,1,0.68,1)] ${index === currentIndex ? 'scale-100' : 'scale-110'
                    }`}
                  priority={index < 2}
                  quality={100}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              </div>

              {/* Content with glass morphism effect */}
              <div className="relative h-full flex items-end justify-center pb-12 md:pb-16 px-6">
                <div className="w-full max-w-4xl mx-auto">
                  <div className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
                    <h2 className="text-white text-2xl md:text-4xl font-bold mb-3 text-center font-tajawal">
                      {slide.title}
                    </h2>
                    <p className="text-amber-300/90 text-xl md:text-2xl text-center font-scheherazade leading-relaxed">
                      {slide.verse}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots with improved interaction */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {islamicSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-out ${currentIndex === index
                ? 'bg-white w-8 scale-125'
                : 'bg-white/40 hover:bg-white/60'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows with hover effects */}
        <button
          onClick={() => goToSlide((currentIndex - 1 + islamicSlides.length) % islamicSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goToSlide((currentIndex + 1) % islamicSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default IslamicSlider;
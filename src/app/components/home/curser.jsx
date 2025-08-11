"use client";
import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

const ImageSlider = () => {
  // بيانات الشرائح مع تحسينات
  const slides = [
    {
      id: 1,
      title: "التعلم التفاعلي",
      description: "طريقة مبتكرة لتحفيظ القرآن الكريم عبر منصتنا التفاعلية",
      image: "/1.jpeg",
      overlayColor: "rgba(0, 0, 0, 0.4)"
    },
    {
      id: 2,
      title: "تتبع التقدم",
      description: "تابع تقدمك في الحفظ والمراجعة بسهولة",
      image: "/2.jpeg",
      overlayColor: "rgba(0, 0, 0, 0.4)"
    },
    {
      id: 3,
      title: "اختبارات دورية",
      description: "اختبر حفظك وتعلمك مع نظام التقييم الذكي",
      image: "/3.jpeg",
      overlayColor: "rgba(0, 0, 0, 0.4)"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // التحكم بالسحب على الهاتف
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartPos(e.touches[0].clientX);
    setCurrentTranslate(-currentSlide * 100);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startPos;
    setCurrentTranslate(-currentSlide * 100 + (diff / window.innerWidth) * 100);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 0.15;
    if (currentTranslate < -currentSlide * 100 - threshold * 100) {
      nextSlide();
    } else if (currentTranslate > -currentSlide * 100 + threshold * 100) {
      prevSlide();
    }
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden rounded-2xl shadow-2xl group mt-[80px]">
      {/* الشرائح */}
      <div
        className={`flex h-full transition-transform duration-300 ease-out ${isDragging ? 'duration-0' : ''}`}
        style={{ transform: `translateX(${isDragging ? currentTranslate : -currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 h-full relative"
          >
            {/* الصورة المعدلة بدون تضارب في الخصائص */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                className="object-cover"
                draggable="false"
                priority={currentSlide === slide.id - 1}
              />
            </div>

            {/* طبقة شفافة مع تحسينات */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, transparent 0%, ${slide.overlayColor} 100%)`
              }}
            >
              {/* المحتوى مع تحسينات */}
              <div className="container mx-auto h-full flex flex-col items-center justify-center px-8 text-center">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl max-w-2xl border border-white/20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/90">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* أزرار التحكم مع تحسينات */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-lg hover:scale-110"
        aria-label="الشريحة السابقة"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-lg hover:scale-110"
        aria-label="الشريحة التالية"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
      </button>

      {/* مؤشرات الشرائح مع تحسينات */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'}`}
            aria-label={`انتقل إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
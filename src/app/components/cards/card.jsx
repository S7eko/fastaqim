"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookQuran,
  faMicrophoneLines,
  faMosque,
  faPray,
  faHandsPraying,
  faCalendarDays,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons';

const IslamicEducationCards = () => {
  const [theme, setTheme] = useState('dark');

  const cards = [
    {
      id: 1,
      title: "حفظ القرآن",
      description: "برنامج متكامل لحفظ القرآن الكريم مع نظام التتبع والتقييم الذكي",
      icon: faBookQuran,
      color: "from-emerald-500/10 to-emerald-500/20",
      iconColor: "text-emerald-500"
    },
    {
      id: 2,
      title: "تعلم التجويد",
      description: "دروس متقنة لأحكام التجويد مع مشايخ متخصصين ومعتمدين",
      icon: faMicrophoneLines,
      color: "from-blue-500/10 to-blue-500/20",
      iconColor: "text-blue-500"
    },
    {
      id: 3,
      title: "الفقه الإسلامي",
      description: "إتقان الأحكام الفقهية مع شروحات تطبيقية وحالات عملية",
      icon: faMosque,
      color: "from-purple-500/10 to-purple-500/20",
      iconColor: "text-purple-500"
    },
    {
      id: 4,
      title: "السيرة النبوية",
      description: "دراسة شاملة لحياة الرسول ﷺ وأخلاقه وهديه",
      icon: faPray,
      color: "from-amber-500/10 to-amber-500/20",
      iconColor: "text-amber-500"
    },
    {
      id: 5,
      title: "الأدعية والأذكار",
      description: "المجموعة الكاملة للأدعية والأذكار الموثوقة يومياً",
      icon: faHandsPraying,
      color: "from-green-500/10 to-green-500/20",
      iconColor: "text-green-500"
    },
    {
      id: 6,
      title: "المناسبات الإسلامية",
      description: "كل ما يتعلق بالمناسبات الإسلامية وأحكامها الشرعية",
      icon: faCalendarDays,
      color: "from-rose-500/10 to-rose-500/20",
      iconColor: "text-rose-500"
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

      <div className="max-w-7xl mx-auto px-5 py-16 sm:px-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground font-arabic mb-4">
            منصتنا التعليمية الشاملة
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-arabic">
            نقدم لكم خدمات تعليمية متكاملة وفق أعلى معايير الجودة والموثوقية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`bg-gradient-to-br ${card.color} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border relative group`}
            >
              <div className="p-8 relative z-10 h-full flex flex-col">
                {/* Icon with subtle background */}
                <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${card.iconColor} bg-background/50 shadow-sm`}>
                  <FontAwesomeIcon icon={card.icon} className="text-2xl" />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-card-foreground font-arabic">{card.title}</h3>
                  <p className="text-foreground/70 mb-6 leading-relaxed font-arabic text-lg">{card.description}</p>
                </div>

                {/* Button */}
                <div className="mt-auto">
                  <button className={`inline-flex items-center ${card.iconColor} font-semibold group-hover:underline transition-all`}>
                    ابدأ الرحلة التعليمية
                    <svg className="mr-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 mix-blend-overlay">
                <div className="absolute -right-10 -top-10 opacity-40">
                  <FontAwesomeIcon
                    icon={card.icon}
                    className={`text-6xl ${card.iconColor}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
            سجل الآن واحصل على نسخة تجريبية مجانية
          </button>
        </div>
      </div>
    </div>
  );
};

export default IslamicEducationCards;
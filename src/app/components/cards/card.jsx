import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookQuran,
  faMicrophoneLines,
  faMosque,
  faPray,
  faHandsPraying,
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';

const IslamicEducationCards = () => {
  const cards = [
    {
      id: 1,
      title: "حفظ القرآن",
      description: "برنامج متكامل لحفظ القرآن الكريم مع نظام التتبع والتقييم الذكي",
      icon: faBookQuran,
      color: "from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      id: 2,
      title: "تعلم التجويد",
      description: "دروس متقنة لأحكام التجويد مع مشايخ متخصصين ومعتمدين",
      icon: faMicrophoneLines,
      color: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      id: 3,
      title: "الفقه الإسلامي",
      description: "إتقان الأحكام الفقهية مع شروحات تطبيقية وحالات عملية",
      icon: faMosque,
      color: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      title: "السيرة النبوية",
      description: "دراسة شاملة لحياة الرسول ﷺ وأخلاقه وهديه",
      icon: faPray,
      color: "from-amber-50 to-amber-100",
      iconColor: "text-amber-600"
    },
    {
      id: 5,
      title: "الأدعية والأذكار",
      description: "المجموعة الكاملة للأدعية والأذكار الموثوقة يومياً",
      icon: faHandsPraying,
      color: "from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      id: 6,
      title: "المناسبات الإسلامية",
      description: "كل ما يتعلق بالمناسبات الإسلامية وأحكامها الشرعية",
      icon: faCalendarDays,
      color: "from-rose-50 to-rose-100",
      iconColor: "text-rose-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 py-16 sm:px-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 font-arabic mb-4">
          منصتنا التعليمية الشاملة
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-arabic">
          نقدم لكم خدمات تعليمية متكاملة وفق أعلى معايير الجودة والموثوقية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-gradient-to-br ${card.color} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-opacity-20 border-gray-200 relative group`}
          >
            <div className="p-8 relative z-10 h-full flex flex-col">
              {/* Icon with subtle background */}
              <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center ${card.iconColor} bg-white bg-opacity-50 shadow-sm`}>
                <FontAwesomeIcon icon={card.icon} className="text-2xl" />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 font-arabic">{card.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed font-arabic text-lg">{card.description}</p>
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
                  className={`text-48 ${card.iconColor}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <button className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
          سجل الآن واحصل على نسخة تجريبية مجانية
        </button>
      </div>
    </div>
  );
};

export default IslamicEducationCards;
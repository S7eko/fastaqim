"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faChartLine,
  faUserCheck,
  faFileAlt,
  faQuestionCircle,
  faBook,
  faHome,
  faQuran,
  faMosque,
  faUserGraduate
} from "@fortawesome/free-solid-svg-icons";
import Exame from "../addExame/addExme";
import QuestionBank from "../questions/questionBank";
import ProgressTracker from "../progres/progressTracker";

const HomeDashboard = () => {
  const [selectedAction, setSelectedAction] = useState(null);

  const actions = [
    { id: "question-bank", icon: faFileAlt, label: "بنك أسئلة" },
    { id: "add-session", icon: faPlus, label: "اداره الاسئله" },
    { id: "grades", icon: faChartLine, label: "تتبع التقدم" },
    { id: "approve", icon: faUserCheck, label: "قبول الطلاب" },
    { id: "reports", icon: faFileAlt, label: "التقارير" },
    

    { id: "students", icon: faUserGraduate, label: "إدارة الطلاب" }
  ];

  const handleActionClick = (actionId) => {
    setSelectedAction(actionId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-[73px]">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-green-700 to-green-800 shadow-xl  sticky top-[73px] h-[calc(100vh-73px)] flex flex-col">
        <div className="p-5 border-b border-green-600 flex flex-col items-center">
          <FontAwesomeIcon icon={faQuran} className="text-2xl text-white mb-2" />
          <h1 className="text-xl font-bold text-center text-white">لوحة التحكم القرآنية</h1>
        </div>

        {/* Navigation with scroll */}
        <nav className="p-4 flex-1 overflow-y-auto">
          {/* Home button */}
          <button
            onClick={() => setSelectedAction(null)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 mb-4 ${!selectedAction
                ? "bg-green-600 text-white font-semibold shadow-md"
                : "hover:bg-green-600/50 text-white/90 hover:text-white"
              }`}
          >
            <FontAwesomeIcon icon={faHome} className="text-lg" />
            <span>الصفحة الرئيسية</span>
          </button>

          <h2 className="text-lg font-semibold text-white/80 mb-4 px-2">القائمة الرئيسية</h2>
          <ul className="space-y-2">
            {actions.map((action) => (
              <li key={action.id}>
                <button
                  onClick={() => handleActionClick(action.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${selectedAction === action.id
                      ? "bg-white text-green-700 font-semibold shadow-md"
                      : "hover:bg-green-600/50 text-white hover:shadow-md"
                    }`}
                >
                  <FontAwesomeIcon icon={action.icon} className="text-lg" />
                  <span>{action.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-green-600 text-white/80 text-sm text-center">
          <div className="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faMosque} />
            <span>المدرسة القرآنية</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <main className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-120px)]">
          {!selectedAction && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">نظرة عامة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
                  <h3 className="text-lg font-medium">عدد الجلسات</h3>
                  <p className="text-3xl font-bold mt-2">24</p>
                  <p className="text-sm opacity-80 mt-1">+3 عن الشهر الماضي</p>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-lg shadow-lg text-white">
                  <h3 className="text-lg font-medium">معدل الحفظ</h3>
                  <p className="text-3xl font-bold mt-2">78%</p>
                  <p className="text-sm opacity-80 mt-1">+8% عن الشهر السابق</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
                  <h3 className="text-lg font-medium">طلبات الانتظار</h3>
                  <p className="text-3xl font-bold mt-2">5</p>
                  <p className="text-sm opacity-80 mt-1">طلبات تسجيل جديدة</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">أحدث النشاطات</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 hover:bg-gray-100 rounded-lg transition">
                    <div className="bg-green-100 p-2 rounded-full text-green-700">
                      <FontAwesomeIcon icon={faQuran} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">تمت إضافة جلسة جديدة</h4>
                      <p className="text-sm text-gray-600">جلسة مراجعة سورة البقرة</p>
                      <p className="text-xs text-gray-500 mt-1">منذ يومين</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 hover:bg-gray-100 rounded-lg transition">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                      <FontAwesomeIcon icon={faUserGraduate} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">طالب جديد</h4>
                      <p className="text-sm text-gray-600">محمد أحمد سجل في دورة التجويد</p>
                      <p className="text-xs text-gray-500 mt-1">منذ 3 أيام</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 hover:bg-gray-100 rounded-lg transition">
                    <div className="bg-amber-100 p-2 rounded-full text-amber-700">
                      <FontAwesomeIcon icon={faChartLine} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">تقدم في الحفظ</h4>
                      <p className="text-sm text-gray-600">3 طلاب أكملوا حفظ جزء عم</p>
                      <p className="text-xs text-gray-500 mt-1">منذ أسبوع</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Content */}
          <div className="mt-6">
            {selectedAction === "question-bank" && <QuestionBank />}
            {selectedAction === "add-session" && <Exame />}
            {selectedAction === "grades" && <ProgressTracker />}
              
            
            {selectedAction === "approve" && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">قبول الطلاب</h3>
                <p className="text-gray-600">قائمة بطلبات التسجيل الجديدة للمراجعة...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeDashboard;
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faAward, faUserGraduate, faQuran } from '@fortawesome/free-solid-svg-icons';

const ProgressTracker = () => {
  const [selectedPart, setSelectedPart] = useState('');
  const [students, setStudents] = useState([]);

  const parts = [
    'جزء عم',
    'جزء تبارك',
    'جزء قد سمع',
    'جزء البقرة',
    'جزء آل عمران'
  ];

  const sampleStudents = [
    { id: 1, name: 'محمد أحمد', score: 95, part: 'جزء عم' },
    { id: 2, name: 'أحمد محمود', score: 88, part: 'جزء عم' },
    { id: 3, name: 'علي حسن', score: 92, part: 'جزء عم' },
    { id: 4, name: 'محمود خالد', score: 85, part: 'جزء عم' },
    { id: 5, name: 'خالد وليد', score: 78, part: 'جزء عم' },
    { id: 6, name: 'وليد سامي', score: 90, part: 'جزء تبارك' },
    { id: 7, name: 'سامي كريم', score: 82, part: 'جزء تبارك' },
    { id: 8, name: 'كريم عماد', score: 94, part: 'جزء تبارك' },
    { id: 9, name: 'عماد ناصر', score: 87, part: 'جزء تبارك' },
    { id: 10, name: 'رامي علاء', score: 89, part: 'جزء تبارك' },
    { id: 11, name: 'عماد ناصر', score: 87, part: 'جزء قد سمع' },
    { id: 12, name: 'ناصر رامي', score: 91, part: 'جزء قد سمع' },
    { id: 13, name: 'خالد رامي', score: 85, part: 'جزء قد سمع' },
    { id: 14, name: 'مصطفى طارق', score: 88, part: 'جزء قد سمع' },
    { id: 15, name: 'طارق سامح', score: 90, part: 'جزء قد سمع' },
    { id: 16, name: 'عبدالله محمد', score: 93, part: 'جزء البقرة' },
    { id: 17, name: 'محمد طارق', score: 80, part: 'جزء البقرة' },
    { id: 18, name: 'أحمد علي', score: 77, part: 'جزء البقرة' },
    { id: 19, name: 'علي محمود', score: 85, part: 'جزء البقرة' },
    { id: 20, name: 'حسن يوسف', score: 89, part: 'جزء البقرة' },
    { id: 21, name: 'يوسف جمال', score: 92, part: 'جزء آل عمران' },
    { id: 22, name: 'جمال عمرو', score: 84, part: 'جزء آل عمران' },
    { id: 23, name: 'عمرو سعيد', score: 88, part: 'جزء آل عمران' },
    { id: 24, name: 'سعيد أحمد', score: 90, part: 'جزء آل عمران' },
    { id: 25, name: 'أحمد سعيد', score: 86, part: 'جزء آل عمران' },
    { id: 26, name: 'إسلام فؤاد', score: 81, part: 'جزء عم' },
    { id: 27, name: 'فؤاد هاني', score: 79, part: 'جزء تبارك' },
    { id: 28, name: 'هاني شريف', score: 94, part: 'جزء قد سمع' },
    { id: 29, name: 'شريف ماجد', score: 83, part: 'جزء البقرة' },
    { id: 30, name: 'ماجد سامي', score: 87, part: 'جزء آل عمران' },
  ];

  const handlePartChange = (e) => {
    const part = e.target.value;
    setSelectedPart(part);
    const filteredStudents = sampleStudents
      .filter(student => student.part === part)
      .sort((a, b) => b.score - a.score);
    setStudents(filteredStudents);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 dark:text-yellow-400 text-2xl" />;
      case 1:
        return <FontAwesomeIcon icon={faMedal} className="text-gray-400 dark:text-gray-300 text-2xl" />;
      case 2:
        return <FontAwesomeIcon icon={faAward} className="text-amber-700 dark:text-amber-500 text-2xl" />;
      default:
        return <span className="text-gray-600 dark:text-gray-300 font-medium">{index + 1}</span>;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 dark:bg-yellow-900';
      case 1:
        return 'bg-gray-200 dark:bg-gray-800';
      case 2:
        return 'bg-amber-200 dark:bg-amber-900';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white">
            <FontAwesomeIcon icon={faQuran} className="text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">ترتيب الطلاب</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">تتبع أداء الطلاب حسب الأجزاء القرآنية</p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 text-right mb-2">
                    اختر الجزء القرآني
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPart}
                      onChange={handlePartChange}
                      className="block w-full p-4 pr-12 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg text-right appearance-none bg-white dark:bg-gray-900 dark:text-gray-100"
                    >
                      <option value="">-- اختر جزء --</option>
                      {parts.map((part, index) => (
                        <option key={index} value={part}>{part}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students List */}
          {selectedPart && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-right mb-2">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full">
                    {selectedPart}
                  </span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-right">
                  عدد الطلاب: {students.length} | أعلى درجة: {students.length > 0 ? students[0].score : 0}
                </p>
              </div>

              <div className="space-y-3">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${getRankColor(index)} border border-gray-100 dark:border-gray-700`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center">
                          {getRankIcon(index)}
                        </div>
                        <div className="text-right">
                          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">{student.name}</h4>
                          <p className="text-gray-600 dark:text-gray-300">الدرجة: {student.score}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-gray-400 dark:text-gray-300" />
                        <span className="text-gray-500 dark:text-gray-300">طالب</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-300">
                    لا يوجد طلاب مسجلين لهذا الجزء بعد
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

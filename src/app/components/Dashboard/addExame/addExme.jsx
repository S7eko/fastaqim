import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuran, faCheckCircle, faBook } from '@fortawesome/free-solid-svg-icons';

const Exame = () => {
  const [examName, setExamName] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // قائمة بأسماء الامتحانات المتاحة (يمكن جلبها من API)
  const availableExams = [
    'امتحان منتصف الفصل - التجويد',
    'امتحان نهاية الفصل - الحفظ',
    'اختبار شهري - التفسير',
    'امتحان تجريبي - القرآن الكريم'
  ];

  // نموذج لأسئلة قرآنية
  const quranicQuestions = {
    'جزء عم': [
      { id: 1, text: 'ما هي السورة التي تبدأ ب "سبح اسم ربك الأعلى"؟', options: ['العلق', 'الأعلى', 'الغاشية', 'الفجر'], answer: 1 },
      { id: 2, text: 'كم عدد آيات سورة النبأ؟', options: ['20 آية', '30 آية', '40 آية', '50 آية'], answer: 2 },
      { id: 3, text: 'ما هي آخر سورة في جزء عم؟', options: ['الناس', 'البلد', 'الفجر', 'الماعون'], answer: 0 }
    ],
    'جزء تبارك': [
      { id: 4, text: 'ما هي السورة التي تسمى "المجادلة"؟', options: ['الحديد', 'المجادلة', 'الحشر', 'الصف'], answer: 1 },
      { id: 5, text: 'في أي سورة توجد آية الكرسي؟', options: ['البقرة', 'آل عمران', 'النساء', 'المائدة'], answer: 0 },
      { id: 6, text: 'كم عدد السور في جزء تبارك؟', options: ['10 سور', '11 سورة', '12 سورة', '13 سورة'], answer: 1 }
    ]
  };

  const handlePartChange = (e) => {
    const part = e.target.value;
    setSelectedPart(part);
    setQuestions(quranicQuestions[part] || []);
    setSelectedQuestions([]);
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!examName) {
      alert('الرجاء اختيار اسم الامتحان');
      return;
    }
    if (selectedQuestions.length === 0) {
      alert('الرجاء اختيار أسئلة على الأقل');
      return;
    }

    const selectedQuestionsData = questions.filter(q => selectedQuestions.includes(q.id));
    const examData = {
      examName,
      part: selectedPart,
      questions: selectedQuestionsData,
      date: new Date().toISOString(),
      totalPoints: selectedQuestionsData.length * 5 // 5 نقاط لكل سؤال (يمكن تعديلها)
    };

    console.log('Exam Data:', examData);
    alert(`تم إضافة ${selectedQuestions.length} سؤال إلى "${examName}" بنجاح`);

    // إعادة تعيين النموذج
    setExamName('');
    setSelectedPart('');
    setQuestions([]);
    setSelectedQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <FontAwesomeIcon icon={faQuran} className="text-4xl text-green-600 mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">إضافة أسئلة إلى امتحان قرآني</h2>
          <p className="mt-2 text-lg text-gray-600">اختر الامتحان والجزء ثم حدد الأسئلة المطلوبة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* اختيار اسم الامتحان */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700 text-right">
              اختر اسم الامتحان
            </label>
            <div className="relative">
              
              <select
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-lg text-right"
                required
              >
                <option value="">-- اختر امتحان --</option>
                {availableExams.map((exam, index) => (
                  <option key={index} value={exam}>{exam}</option>
                ))}
              </select>
            </div>
          </div>

          {/* اختيار الجزء */}
          <div className="space-y-2">
            <label className="block text-lg font-medium text-gray-700 text-right">
              اختر الجزء القرآني
            </label>
            <select
              value={selectedPart}
              onChange={handlePartChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-lg text-right"
              required
            >
              <option value="">-- اختر جزء --</option>
              <option value="جزء عم">جزء عم</option>
              <option value="جزء تبارك">جزء تبارك</option>
              <option value="جزء قد سمع">جزء قد سمع</option>
              <option value="جزء البقرة">جزء البقرة</option>
              <option value="جزء آل عمران">جزء آل عمران</option>
            </select>
          </div>

          {/* عرض الأسئلة عند اختيار جزء */}
          {selectedPart && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800 text-right">
                  أسئلة {selectedPart}
                </h3>
                {examName && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {examName}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg transition-all ${selectedQuestions.includes(question.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800 text-right mb-2">{question.text}</p>
                        <ul className="space-y-1 text-right">
                          {question.options.map((option, idx) => (
                            <li key={idx} className="text-gray-600">
                              {option} {idx === question.answer && (
                                <span className="text-green-600 text-sm mr-1">(الإجابة الصحيحة)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleQuestionSelection(question.id)}
                        className={`ml-4 p-2 rounded-full ${selectedQuestions.includes(question.id) ? 'text-green-600 bg-green-100' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className={`text-xl ${selectedQuestions.includes(question.id) ? 'opacity-100' : 'opacity-50 hover:opacity-70'}`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* زر الإرسال */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!examName || selectedQuestions.length === 0}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${examName && selectedQuestions.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {examName && selectedQuestions.length > 0 ? (
                `إضافة ${selectedQuestions.length} سؤال إلى "${examName}"`
              ) : examName ? (
                'اختر أسئلة لإضافتها'
              ) : (
                'اختر امتحان أولا'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Exame;
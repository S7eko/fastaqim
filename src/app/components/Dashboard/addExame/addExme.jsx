import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuran, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Exame = () => {
  const [examName, setExamName] = useState('');
  const [selectedPart, setSelectedPart] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const availableExams = [
    'امتحان منتصف الفصل - التجويد',
    'امتحان نهاية الفصل - الحفظ',
    'اختبار شهري - التفسير',
    'امتحان تجريبي - القرآن الكريم'
  ];

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
    setSelectedQuestions(prev =>
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
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
      totalPoints: selectedQuestionsData.length * 5
    };

    console.log('Exam Data:', examData);
    alert(`تم إضافة ${selectedQuestions.length} سؤال إلى "${examName}" بنجاح`);

    setExamName('');
    setSelectedPart('');
    setQuestions([]);
    setSelectedQuestions([]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto bg-[var(--card)] p-8 rounded-lg shadow-lg text-[var(--card-foreground)]">
        <div className="text-center mb-8">
          <FontAwesomeIcon icon={faQuran} className="text-4xl text-[var(--primary)] mb-3" />
          <h2 className="text-3xl font-bold">إضافة أسئلة إلى امتحان قرآني</h2>
          <p className="mt-2 text-lg opacity-80">اختر الامتحان والجزء ثم حدد الأسئلة المطلوبة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg font-medium text-right">
              اختر اسم الامتحان
            </label>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="block w-full p-3 border border-[var(--primary)] rounded-md shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] text-lg text-right bg-[var(--background)] text-[var(--foreground)]"
              required
            >
              <option value="">-- اختر امتحان --</option>
              {availableExams.map((exam, index) => (
                <option key={index} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-lg font-medium text-right">
              اختر الجزء القرآني
            </label>
            <select
              value={selectedPart}
              onChange={handlePartChange}
              className="block w-full p-3 border border-[var(--primary)] rounded-md shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] text-lg text-right bg-[var(--background)] text-[var(--foreground)]"
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

          {selectedPart && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  أسئلة {selectedPart}
                </h3>
                {examName && (
                  <span className="bg-[var(--primary-foreground)] text-[var(--primary)] px-3 py-1 rounded-full text-sm">
                    {examName}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg transition-all ${selectedQuestions.includes(question.id)
                        ? 'border-[var(--primary)] bg-[var(--primary-foreground)]'
                        : 'border-gray-300 hover:border-[var(--primary)]'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-right mb-2">{question.text}</p>
                        <ul className="space-y-1 text-right">
                          {question.options.map((option, idx) => (
                            <li key={idx}>
                              {option} {idx === question.answer && (
                                <span className="text-[var(--primary)] text-sm mr-1">(الإجابة الصحيحة)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleQuestionSelection(question.id)}
                        className={`ml-4 p-2 rounded-full ${selectedQuestions.includes(question.id)
                            ? 'text-[var(--primary)] bg-[var(--primary-foreground)]'
                            : 'text-gray-400 hover:text-[var(--primary)]'
                          }`}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!examName || selectedQuestions.length === 0}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-[var(--primary-foreground)] ${examName && selectedQuestions.length > 0
                  ? 'bg-[var(--primary)] hover:opacity-90'
                  : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {examName && selectedQuestions.length > 0
                ? `إضافة ${selectedQuestions.length} سؤال إلى "${examName}"`
                : examName
                  ? 'اختر أسئلة لإضافتها'
                  : 'اختر امتحان أولا'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Exame;

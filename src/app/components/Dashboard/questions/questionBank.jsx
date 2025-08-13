import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuran, faPlus, faTrash, faSave, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const QuestionBank = () => {
  const initialParts = [
    'جزء عم',
    'جزء تبارك',
    'جزء قد سمع',
    'جزء البقرة',
    'جزء آل عمران'
  ];

  const [parts, setParts] = useState(initialParts);
  const [selectedPart, setSelectedPart] = useState('');
  const [newPartName, setNewPartName] = useState('');
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [questions, setQuestions] = useState([{
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  }]);

  const handleAddPart = () => {
    if (newPartName.trim() && !parts.includes(newPartName.trim())) {
      setParts([...parts, newPartName.trim()]);
      setSelectedPart(newPartName.trim());
      setNewPartName('');
      setShowAddPartForm(false);
    }
  };

  const handlePartChange = (e) => setSelectedPart(e.target.value);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = answerIndex;
    setQuestions(newQuestions);
  };

  const addNewQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedPart) {
      alert('الرجاء اختيار أو إضافة جزء قرآني');
      return;
    }

    const emptyQuestions = questions.some(q =>
      !q.text || q.options.some(opt => !opt)
    );

    if (emptyQuestions) {
      alert('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    const dataToSubmit = {
      part: selectedPart,
      questions: questions,
      date: new Date().toISOString()
    };

    console.log('Submitted Data:', dataToSubmit);
    alert(`تم حفظ ${questions.length} سؤال في جزء ${selectedPart}`);

    setSelectedPart('');
    setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 p-6 rounded-xl shadow-sm bg-[var(--card)] text-[var(--card-foreground)]">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
            <FontAwesomeIcon icon={faQuran} className="text-3xl" />
          </div>
          <h2 className="text-3xl font-bold mb-2">بنك الأسئلة القرآنية</h2>
          <p className="text-lg opacity-80">أضف أجزاء وأسئلة جديدة بسهولة</p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl shadow-lg overflow-hidden bg-[var(--card)] text-[var(--card-foreground)]">
          {/* Part Selection */}
          <div className="p-6 border-b border-[var(--foreground)]/10">
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-lg font-medium text-right mb-2">
                    اختر الجزء القرآني
                  </label>
                  <select
                    value={selectedPart}
                    onChange={handlePartChange}
                    className="block w-full p-4 pr-12 border border-[var(--foreground)]/20 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-lg text-right bg-[var(--background)]"
                  >
                    <option value="">-- اختر جزء --</option>
                    {parts.map((part, index) => (
                      <option key={index} value={part}>{part}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddPartForm(!showAddPartForm)}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-lg shadow-md transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>{showAddPartForm ? 'إخفاء' : 'جزء جديد'}</span>
                </button>
              </div>

              {/* Add Part Form */}
              {showAddPartForm && (
                <div className="mt-4 p-4 rounded-lg border border-[var(--foreground)]/20 bg-[var(--background)]">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-right mb-1">
                        اسم الجزء الجديد
                      </label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faBookOpen}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60"
                        />
                        <input
                          type="text"
                          value={newPartName}
                          onChange={(e) => setNewPartName(e.target.value)}
                          className="block w-full p-4 pl-12 border border-[var(--foreground)]/20 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] text-lg text-right bg-[var(--background)]"
                          placeholder="أدخل اسم الجزء الجديد"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPart}
                      disabled={!newPartName.trim()}
                      className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg shadow-md transition-all duration-300 ${newPartName.trim() ? 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                      <FontAwesomeIcon icon={faSave} />
                      <span>حفظ الجزء</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Questions Section */}
          {selectedPart && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-right mb-2">
                  <span className="px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                    {selectedPart}
                  </span>
                </h3>
                <p className="opacity-80 text-right">قم بإضافة الأسئلة للجزء المحدد</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="border border-[var(--foreground)]/20 rounded-xl p-5 space-y-4 bg-[var(--background)] shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold">
                          {qIndex + 1}
                        </span>
                        <h3 className="text-lg font-semibold">السؤال</h3>
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>

                    <textarea
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      className="w-full p-4 border border-[var(--foreground)]/20 rounded-lg text-right focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)]"
                      rows={3}
                      placeholder="أدخل نص السؤال هنا..."
                      required
                    />

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-right mb-2">
                        الخيارات (حدد الإجابة الصحيحة)
                      </label>
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            name={`correctAnswer-${qIndex}`}
                            checked={question.correctAnswer === oIndex}
                            onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                            className="h-5 w-5 text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--foreground)]/30"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            className="flex-1 p-3 border border-[var(--foreground)]/20 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--background)] text-right"
                            placeholder={`الخيار ${oIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={addNewQuestion}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-lg shadow-md transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>إضافة سؤال جديد</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-lg shadow-md transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    <span>حفظ الأسئلة ({questions.length})</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;

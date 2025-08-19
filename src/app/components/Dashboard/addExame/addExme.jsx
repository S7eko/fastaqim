import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuran, faPlus, faEdit, faTrash, faSave, faTimes, faCheckCircle,
  faBookOpen, faListUl, faClock, faAward, faCheck, faSearch, faStar, faTrophy
} from '@fortawesome/free-solid-svg-icons';

// Sample data (unchanged as it's static)
const quranicQuestions = {
  'جزء عم': [
    { id: 1, text: 'ما هي السورة التي تبدأ ب "سبح اسم ربك الأعلى"؟', options: ['العلق', 'الأعلى', 'الغاشية', 'الفجر'], answer: 1, difficulty: 'easy' },
    { id: 2, text: 'كم عدد آيات سورة النبأ؟', options: ['20 آية', '30 آية', '40 آية', '50 آية'], answer: 2, difficulty: 'medium' },
    { id: 3, text: 'ما هي آخر سورة في جزء عم؟', options: ['الناس', 'البلد', 'الفجر', 'الماعون'], answer: 0, difficulty: 'easy' }
  ],
  'جزء تبارك': [
    { id: 4, text: 'ما هي السورة التي تسمى "المجادلة"؟', options: ['الحديد', 'المجادلة', 'الحشر', 'الصف'], answer: 1, difficulty: 'easy' },
    { id: 5, text: 'في أي سورة توجد آية الكرسي؟', options: ['البقرة', 'آل عمران', 'النساء', 'المائدة'], answer: 0, difficulty: 'easy' },
    { id: 6, text: 'كم عدد السور في جزء تبارك؟', options: ['10 سور', '11 سورة', '12 سورة', '13 سورة'], answer: 1, difficulty: 'hard' }
  ],
  'جزء قد سمع': [
    { id: 7, text: 'ما هي السورة التي تسمى "المنافقون"؟', options: ['المنافقون', 'التغابن', 'الجمعة', 'الصف'], answer: 0, difficulty: 'medium' },
    { id: 8, text: 'في أي سورة توجد آية "إن الله مع الصابرين"؟', options: ['البقرة', 'آل عمران', 'الأنفال', 'النحل'], answer: 0, difficulty: 'hard' }
  ],
  'جزء البقرة': [
    { id: 9, text: 'ما هي أطول آية في القرآن؟', options: ['آية الدين', 'آية الكرسي', 'آية الصيام', 'آية الميراث'], answer: 0, difficulty: 'medium' },
    { id: 10, text: 'كم عدد آيات سورة البقرة؟', options: ['286 آية', '200 آية', '176 آية', '150 آية'], answer: 0, difficulty: 'easy' }
  ],
  'جزء آل عمران': [
    { id: 11, text: 'ما هي السورة التي تسمى "التوحيد"؟', options: ['الإخلاص', 'الفلق', 'الناس', 'الكافرون'], answer: 0, difficulty: 'easy' },
    { id: 12, text: 'في أي سورة توجد آية "كنتم خير أمة أخرجت للناس"؟', options: ['البقرة', 'آل عمران', 'النساء', 'المائدة'], answer: 1, difficulty: 'medium' }
  ]
};
const allParts = Object.keys(quranicQuestions);

// Custom hook to manage local storage state
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : initialValue;
    } catch (error) {
      console.error('Failed to parse local storage value:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// Reusable Stat Card component
const StatCard = ({ icon, color, title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow flex items-center">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 bg-${color}-100`}>
      <FontAwesomeIcon icon={icon} className={`text-${color}-600`} />
    </div>
    <div>
      <h4 className="text-xl font-bold">{value}</h4>
      <p className="text-gray-600">{title}</p>
    </div>
  </div>
);

// Main component
const Exame = () => {
  const [exams, setExams] = useLocalStorage('quranicExams', []);
  const [viewMode, setViewMode] = useState('list');
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    examName: '', description: '', duration: '', examDate: '', examTime: '', selectedParts: [], selectedQuestions: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Reset form data
  const resetForm = () => setFormData({
    examName: '', description: '', duration: '', examDate: '', examTime: '', selectedParts: [], selectedQuestions: []
  });

  // Effect to populate form when editing
  useEffect(() => {
    if (editingExam) {
      setFormData({
        examName: editingExam.examName,
        description: editingExam.description,
        duration: editingExam.duration,
        examDate: editingExam.examDateTime ? editingExam.examDateTime.substring(0, 10) : '',
        examTime: editingExam.examDateTime ? editingExam.examDateTime.substring(11, 16) : '',
        selectedParts: editingExam.parts,
        selectedQuestions: editingExam.questions.map(q => q.id)
      });
    } else {
      resetForm();
    }
  }, [editingExam]);

  // Derived state for available questions based on selected parts
  const availableQuestions = useMemo(() => {
    const questionsByPart = {};
    formData.selectedParts.forEach(part => {
      questionsByPart[part] = quranicQuestions[part] || [];
    });
    return questionsByPart;
  }, [formData.selectedParts]);

  // Utility function for notifications
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  // Handlers
  const handlePartToggle = (part) => {
    setFormData(prev => ({
      ...prev,
      selectedParts: prev.selectedParts.includes(part)
        ? prev.selectedParts.filter(p => p !== part)
        : [...prev.selectedParts, part]
    }));
  };

  const toggleQuestionSelection = (questionId) => {
    setFormData(prev => ({
      ...prev,
      selectedQuestions: prev.selectedQuestions.includes(questionId)
        ? prev.selectedQuestions.filter(id => id !== questionId)
        : [...prev.selectedQuestions, questionId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.examName || formData.selectedQuestions.length === 0) {
      showNotification('الرجاء إدخال اسم الامتحان واختيار الأسئلة');
      return;
    }

    const allQuestions = Object.values(availableQuestions).flat();
    const selectedQuestionsData = allQuestions.filter(q => formData.selectedQuestions.includes(q.id));
    const examData = {
      id: editingExam?.id || Date.now(),
      ...formData,
      examDateTime: formData.examDate && formData.examTime ? new Date(`${formData.examDate}T${formData.examTime}`).toISOString() : null,
      questions: selectedQuestionsData,
      totalPoints: selectedQuestionsData.length * 5,
      createdAt: new Date().toISOString()
    };

    if (editingExam) {
      setExams(exams.map(exam => exam.id === editingExam.id ? examData : exam));
      showNotification(`تم تحديث الامتحان "${examData.examName}" بنجاح`);
    } else {
      setExams([...exams, examData]);
      showNotification(`تم إنشاء الامتحان "${examData.examName}" بنجاح`);
    }

    setEditingExam(null);
    setViewMode('list');
    resetForm();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف الامتحان "${name}"؟`)) {
      setExams(exams.filter(exam => exam.id !== id));
      showNotification('تم حذف الامتحان بنجاح');
    }
  };

  const filteredExams = useMemo(() =>
    exams.filter(exam =>
      exam.examName.toLowerCase().includes(searchTerm.toLowerCase())
    ), [exams, searchTerm]);

  const totalQuestionsAvailable = useMemo(() =>
    Object.values(quranicQuestions).flat().length, []);

  const getDifficultyColor = (difficulty) => {
    const colors = { easy: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', hard: 'bg-red-100 text-red-800' };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {notification.show && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center">
          <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-emerald-100">
            <FontAwesomeIcon icon={faQuran} className="text-3xl text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">نظام الامتحانات القرآنية</h2>
          <p className="text-lg text-gray-600 mb-6">منصة متكاملة لإنشاء وإدارة الاختبارات القرآنية</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg flex items-center" onClick={() => { setViewMode('form'); setEditingExam(null); }}>
              <FontAwesomeIcon icon={faPlus} className="ml-2" />إنشاء امتحان جديد
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center" onClick={() => setViewMode('list')}>
              <FontAwesomeIcon icon={faListUl} className="ml-2" />عرض الامتحانات
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-emerald-600 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <FontAwesomeIcon icon={viewMode === 'list' ? faBookOpen : (editingExam ? faEdit : faPlus)} className="ml-2" />
              {viewMode === 'list' ? 'قائمة الامتحانات' : (editingExam ? 'تعديل الامتحان' : 'إنشاء امتحان جديد')}
            </h3>
            {viewMode === 'list' && (
              <div className="relative mt-2 sm:mt-0">
                <input type="text" placeholder="ابحث عن امتحان..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 pl-8 rounded-lg bg-white/20 text-white placeholder-white/70" />
                <FontAwesomeIcon icon={faSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70" />
              </div>
            )}
          </div>

          <div className="p-4">
            {viewMode === 'list' ? (
              filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredExams.map(exam => (
                    <div key={exam.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-emerald-50 p-3 border-b flex justify-between">
                        <div>
                          <h4 className="font-bold">{exam.examName}</h4>
                          <p className="text-sm text-gray-600">{exam.description || 'لا يوجد وصف'}</p>
                        </div>
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs self-start">
                          {exam.questions.length} أسئلة
                        </span>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span><FontAwesomeIcon icon={faClock} /> {exam.duration} دقيقة</span>
                          <span><FontAwesomeIcon icon={faAward} /> {exam.totalPoints} نقطة</span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingExam(exam); setViewMode('form'); }} className="p-2 bg-amber-500 text-white rounded-lg"><FontAwesomeIcon icon={faEdit} /></button>
                          <button onClick={() => handleDelete(exam.id, exam.examName)} className="p-2 bg-red-500 text-white rounded-lg"><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center"><FontAwesomeIcon icon={faBookOpen} className="text-2xl text-emerald-600" /></div>
                  <h4 className="text-xl font-bold mb-2">لا توجد امتحانات</h4>
                  <button onClick={() => { setViewMode('form'); setEditingExam(null); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center mx-auto">
                    <FontAwesomeIcon icon={faPlus} className="ml-2" />إنشاء امتحان جديد
                  </button>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold mb-4 flex items-center"><FontAwesomeIcon icon={faEdit} className="ml-2" />تفاصيل الامتحان</h4>
                    <div className="space-y-4">
                      <div><label className="block mb-1">اسم الامتحان *</label><input type="text" value={formData.examName} onChange={(e) => setFormData({ ...formData, examName: e.target.value })} className="w-full p-2 border rounded-lg" required /></div>
                      <div><label className="block mb-1">وصف الامتحان</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-lg" rows="3" /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="block mb-1">المدة (دقائق) *</label><input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full p-2 border rounded-lg" required /></div>
                        <div><label className="block mb-1">تاريخ البدء</label><input type="date" value={formData.examDate} onChange={(e) => setFormData({ ...formData, examDate: e.target.value })} className="w-full p-2 border rounded-lg" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-bold mb-4 flex items-center"><FontAwesomeIcon icon={faListUl} className="ml-2" />الأجزاء القرآنية</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {allParts.map(part => (
                        <div key={part} onClick={() => handlePartToggle(part)} className={`p-2 border rounded-lg cursor-pointer flex justify-between items-center ${formData.selectedParts.includes(part) ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-50'}`}>
                          <span>{part}</span>
                          {formData.selectedParts.includes(part) && <FontAwesomeIcon icon={faCheck} className="text-emerald-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {formData.selectedParts.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold flex items-center"><FontAwesomeIcon icon={faStar} className="ml-2 text-amber-500" />أسئلة الامتحان</h4>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">{formData.selectedQuestions.length} سؤالاً مختاراً</span>
                    </div>
                    <div className="space-y-4">
                      {Object.entries(availableQuestions).map(([part, questions]) => (
                        <div key={part} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 p-2"><h5 className="font-bold">أسئلة {part}</h5></div>
                          <div className="divide-y">
                            {questions.map(question => (
                              <div key={question.id} onClick={() => toggleQuestionSelection(question.id)} className={`p-3 cursor-pointer flex items-start ${formData.selectedQuestions.includes(question.id) ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                                <div className={`w-5 h-5 mt-1 rounded border flex items-center justify-center ${formData.selectedQuestions.includes(question.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
                                  {formData.selectedQuestions.includes(question.id) && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                                </div>
                                <div className="mr-2 flex-1">
                                  <div className="flex justify-between mb-1"><p>{question.text}</p><span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>{question.difficulty === 'easy' ? 'سهل' : question.difficulty === 'medium' ? 'متوسط' : 'صعب'}</span></div>
                                  <ul className="text-sm text-gray-600">
                                    {question.options.map((option, idx) => (<li key={idx} className="flex items-start"><span className={`inline-block w-3 h-3 rounded-full mr-1 mt-1 ${idx === question.answer ? 'bg-green-500' : 'border border-gray-300'}`}></span>{option}</li>))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => { setViewMode('list'); setEditingExam(null); }} className="px-4 py-2 border rounded-lg"><FontAwesomeIcon icon={faTimes} className="ml-2" />إلغاء</button>
                  <button type="submit" disabled={!formData.examName || formData.selectedQuestions.length === 0} className={`px-6 py-2 text-white rounded-lg ${formData.examName && formData.selectedQuestions.length > 0 ? 'bg-emerald-600' : 'bg-gray-400 cursor-not-allowed'}`}>
                    <FontAwesomeIcon icon={editingExam ? faSave : faPlus} className="ml-2" />{editingExam ? 'حفظ التعديلات' : 'إنشاء الامتحان'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={faBookOpen} color="emerald" title="امتحان مخلوق" value={exams.length} />
          <StatCard icon={faQuran} color="blue" title="جزء قرآني" value={allParts.length} />
          <StatCard icon={faTrophy} color="amber" title="سؤال متاح" value={totalQuestionsAvailable} />
        </div>
      </div>
    </div>
  );
};

export default Exame;
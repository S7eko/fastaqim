"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuran,
  faPlus,
  faTrash,
  faSave,
  faEdit,
  faCheckCircle,
  faTimes,
  faBookOpen,
  faListUl,
  faStar,
  faMosque
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

// Initial data
const initialParts = ['جزء عم', 'جزء تبارك', 'جزء قد سمع', 'جزء البقرة', 'جزء آل عمران'];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const QuestionBank = () => {
  const [parts, setParts] = useState(() => {
    const savedParts = JSON.parse(localStorage.getItem('questionBankParts')) || initialParts;
    return savedParts;
  });
  const [selectedPart, setSelectedPart] = useState('');
  const [newPartName, setNewPartName] = useState('');

  const [questions, setQuestions] = useState([]);
  const [storedQuestions, setStoredQuestions] = useState(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('questionBankQuestions')) || {};
    return savedQuestions;
  });

  const [bulkQuestionsForm, setBulkQuestionsForm] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: 0, tempId: Date.now() }
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const [viewMode, setViewMode] = useState('add');
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  useEffect(() => {
    if (selectedPart) {
      setQuestions(storedQuestions[selectedPart] || []);
    } else {
      setQuestions([]);
    }
    resetBulkForm();
    setViewMode('add');
  }, [selectedPart, storedQuestions]);

  useEffect(() => {
    localStorage.setItem('questionBankParts', JSON.stringify(parts));
    localStorage.setItem('questionBankQuestions', JSON.stringify(storedQuestions));
  }, [parts, storedQuestions]);

  const handlePartChange = (part) => {
    setSelectedPart(part);
  };

  const handleAddPart = () => {
    if (newPartName.trim() && !parts.includes(newPartName.trim())) {
      const newPart = newPartName.trim();
      setParts([...parts, newPart]);
      setStoredQuestions({ ...storedQuestions, [newPart]: [] });
      setNewPartName('');
      setSelectedPart(newPart);
    }
  };

  const handleBulkFormChange = (index, field, value) => {
    const newForms = [...bulkQuestionsForm];
    if (field === 'options') {
      newForms[index].options[value.optionIndex] = value.text;
    } else {
      newForms[index][field] = value;
    }
    setBulkQuestionsForm(newForms);
  };

  const addNewQuestionForm = () => {
    setBulkQuestionsForm([...bulkQuestionsForm, { text: '', options: ['', '', '', ''], correctAnswer: 0, tempId: Date.now() }]);
  };

  const removeQuestionForm = (index) => {
    const newForms = bulkQuestionsForm.filter((_, i) => i !== index);
    setBulkQuestionsForm(newForms);
  };

  const saveBulkQuestions = () => {
    const newQuestions = bulkQuestionsForm.filter(q => q.text.trim() && q.options.every(opt => opt.trim()));
    if (newQuestions.length === 0) {
      alert('الرجاء إدخال سؤال واحد على الأقل بشكل صحيح.');
      return;
    }

    let updatedQuestions;
    if (isEditing) {
      updatedQuestions = questions.map(q => {
        if (q.id === editingQuestionId) {
          const editedQ = newQuestions[0];
          return {
            ...q,
            text: editedQ.text,
            options: editedQ.options,
            correctAnswer: editedQ.correctAnswer
          };
        }
        return q;
      });
    } else {
      updatedQuestions = [...questions, ...newQuestions.map(q => ({ ...q, id: Date.now() + Math.random() }))];
    }

    setQuestions(updatedQuestions);
    setStoredQuestions({
      ...storedQuestions,
      [selectedPart]: updatedQuestions,
    });
    resetBulkForm();
    setViewMode('manage');
  };

  const selectQuestionForEdit = (question) => {
    setEditingQuestionId(question.id);
    setIsEditing(true);
    setBulkQuestionsForm([{
      text: question.text,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      tempId: question.id,
    }]);
    setViewMode('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteQuestion = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      setStoredQuestions({
        ...storedQuestions,
        [selectedPart]: updatedQuestions,
      });
      if (editingQuestionId === id) {
        resetBulkForm();
        setEditingQuestionId(null);
      }
    }
  };

  const resetBulkForm = () => {
    setBulkQuestionsForm([
      { text: '', options: ['', '', '', ''], correctAnswer: 0, tempId: Date.now() }
    ]);
    setIsEditing(false);
    setEditingQuestionId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 font-cairo">
      {/* Floating decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-100 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}
            animate={{
              y: [0, Math.random() * 20 - 10],
              x: [0, Math.random() * 20 - 10],
              rotate: [0, Math.random() * 360]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <FontAwesomeIcon icon={faStar} />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 p-8 rounded-2xl shadow-xl bg-secondary text-secondary-foreground relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><text x='20' y='50' font-family='Arial' font-size='20' fill='white'>﷽</text></svg>')" }}></div>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center justify-center w-24 h-24 mb-4 rounded-full bg-secondary-foreground text-secondary shadow-lg"
          >
            <FontAwesomeIcon icon={faMosque} className="text-4xl" />
          </motion.div>
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-5xl font-extrabold mb-2"
          >
            بنك الأسئلة القرآنية
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl mt-2 text-secondary-foreground/90"
          >
            نظام احترافي لإدارة الأسئلة حسب الأجزاء القرآنية
          </motion.p>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_3fr] gap-10">
          {/* Left Column: Part Selection */}
          <div className="">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-card rounded-2xl shadow-2xl p-8 sticky top-10 border border-border min-w-[320px]"
            >
              <motion.h3 variants={slideUp} className="text-2xl font-bold text-card-foreground mb-6 pb-4 border-b border-border text-right">
                الأجزاء القرآنية
              </motion.h3>
              <motion.div variants={staggerContainer} className="space-y-4 mb-6 text-right">
                {parts.map((part, index) => (
                  <motion.button
                    key={index}
                    variants={slideUp}
                    onClick={() => handlePartChange(part)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between w-full text-right py-4 px-6 rounded-xl transition-all duration-300 ${selectedPart === part ?
                      'bg-secondary text-secondary-foreground font-bold shadow-lg' :
                      'bg-background text-foreground hover:bg-card/80'}`}
                  >
                    <span className="truncate flex-1 text-right">{part}</span>
                    <span className="text-sm bg-accent text-accent-foreground px-2 py-1 rounded-full font-bold min-w-[30px] flex-shrink-0">
                      {storedQuestions[part]?.length || 0}
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Add New Part */}
              <motion.div variants={slideUp} className="mt-8 p-5 rounded-xl border border-dashed border-border bg-card/80 text-right">
                <label className="block text-sm font-medium text-card-foreground mb-2">إضافة جزء جديد</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    className="flex-1 p-3 border border-border rounded-lg shadow-sm focus:ring-primary focus:border-primary text-right bg-background text-foreground placeholder-gray-400"
                    placeholder="اسم الجزء..."
                  />
                  <motion.button
                    type="button"
                    onClick={handleAddPart}
                    disabled={!newPartName.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg shadow-md transition-all duration-200 ${newPartName.trim() ?
                      'bg-secondary text-secondary-foreground hover:bg-secondary-hover' :
                      'bg-border text-foreground/50 cursor-not-allowed'}`}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Questions Management */}
          <div className="">
            {!selectedPart ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-2xl shadow-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px] border border-border"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <FontAwesomeIcon icon={faBookOpen} className="text-7xl text-border mb-6" />
                </motion.div>
                <p className="text-2xl font-bold text-card-foreground mb-2">الرجاء اختيار جزء من القائمة</p>
                <p className="text-md text-foreground/70">أو أضف جزءًا جديدًا لبدء العمل.</p>
              </motion.div>
            ) : (
              <div className="space-y-10">
                {/* Tabs for Add/Manage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center bg-card p-2 rounded-xl shadow-md border border-border"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setViewMode('add'); resetBulkForm(); }}
                    className={`flex-1 py-3 text-center rounded-lg font-bold transition-colors ${viewMode === 'add' ?
                      'bg-secondary text-secondary-foreground shadow-inner' :
                      'text-foreground hover:bg-card/80'}`}
                  >
                    <FontAwesomeIcon icon={faPlus} className="ml-2" />
                    إضافة أسئلة جديدة
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setViewMode('manage'); resetBulkForm(); }}
                    className={`flex-1 py-3 text-center rounded-lg font-bold transition-colors ${viewMode === 'manage' ?
                      'bg-secondary text-secondary-foreground shadow-inner' :
                      'text-foreground hover:bg-card/80'}`}
                  >
                    <FontAwesomeIcon icon={faListUl} className="ml-2" />
                    إدارة الأسئلة الحالية
                  </motion.button>
                </motion.div>

                {/* Add Questions Section */}
                {viewMode === 'add' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-2xl shadow-2xl p-8 border border-border"
                  >
                    <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                      <h3 className="text-2xl font-bold text-card-foreground">
                        {isEditing ? (
                          <span>
                            تعديل السؤال في <span className="text-secondary">{selectedPart}</span>
                          </span>
                        ) : (
                          <span>
                            إضافة أسئلة إلى <span className="text-secondary">{selectedPart}</span>
                          </span>
                        )}
                      </h3>
                      {isEditing && (
                        <motion.button
                          onClick={resetBulkForm}
                          whileHover={{ scale: 1.05 }}
                          className="text-red-500 hover:text-red-600 font-medium flex items-center"
                        >
                          <FontAwesomeIcon icon={faTimes} className="ml-2" />
                          إلغاء التعديل
                        </motion.button>
                      )}
                    </div>

                    {/* Bulk question forms */}
                    <div className="space-y-6">
                      <AnimatePresence>
                        {bulkQuestionsForm.map((question, index) => (
                          <motion.div
                            key={question.tempId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="bg-background p-6 rounded-xl border border-border transition-all duration-300 hover:border-secondary"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-lg font-semibold text-card-foreground">سؤال رقم {index + 1}</h4>
                              {bulkQuestionsForm.length > 1 && !isEditing && (
                                <motion.button
                                  onClick={() => removeQuestionForm(index)}
                                  whileHover={{ scale: 1.1 }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </motion.button>
                              )}
                            </div>
                            <div className="space-y-4">
                              <textarea
                                value={question.text}
                                onChange={(e) => handleBulkFormChange(index, 'text', e.target.value)}
                                className="w-full p-3 border border-border rounded-lg text-right focus:ring-primary focus:border-primary bg-background text-foreground placeholder-gray-400"
                                rows={2}
                                placeholder="أدخل نص السؤال هنا..."
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {question.options.map((option, optionIndex) => (
                                  <motion.div
                                    key={optionIndex}
                                    whileHover={{ scale: 1.02 }}
                                    className="relative flex items-center"
                                  >
                                    <input
                                      type="radio"
                                      name={`correctAnswer-${question.tempId}`}
                                      checked={question.correctAnswer === optionIndex}
                                      onChange={() => handleBulkFormChange(index, 'correctAnswer', optionIndex)}
                                      className="h-5 w-5 text-secondary focus:ring-primary border-border bg-background"
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => handleBulkFormChange(index, 'options', { optionIndex, text: e.target.value })}
                                      className="flex-1 p-3 border border-border rounded-lg text-right focus:ring-primary focus:border-primary mr-2 bg-background text-foreground placeholder-gray-400"
                                      placeholder={`الخيار ${optionIndex + 1}`}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 mt-8">
                      {!isEditing && (
                        <motion.button
                          onClick={addNewQuestionForm}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-card-foreground/10 text-card-foreground rounded-lg hover:bg-card-foreground/20 transition-colors flex items-center"
                        >
                          <FontAwesomeIcon icon={faPlus} className="ml-2" />
                          أضف سؤالًا آخر
                        </motion.button>
                      )}
                      <motion.button
                        onClick={saveBulkQuestions}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg shadow-md hover:bg-secondary-hover transition-colors flex items-center"
                      >
                        <FontAwesomeIcon icon={faSave} className="ml-2" />
                        {isEditing ? 'حفظ التعديلات' : `حفظ ${bulkQuestionsForm.length} أسئلة`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Manage Questions Section */}
                {viewMode === 'manage' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-2xl shadow-2xl p-8 border border-border"
                  >
                    <h3 className="text-2xl font-bold text-card-foreground mb-6 border-b border-border pb-4">
                      إدارة الأسئلة في: <span className="text-secondary">{selectedPart}</span>
                    </h3>
                    {questions.length > 0 ? (
                      <div className="space-y-6">
                        <AnimatePresence>
                          {questions.map((question) => (
                            <motion.div
                              key={question.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.3 }}
                              className="p-6 bg-background rounded-xl border border-border shadow-sm hover:border-secondary transition-all duration-200"
                            >
                              <p className="text-lg text-right font-medium text-card-foreground mb-2">
                                {question.text}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right text-sm text-foreground/70">
                                {question.options.map((option, idx) => (
                                  <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${question.correctAnswer === idx ?
                                      'bg-secondary/10 border border-secondary text-secondary font-bold' :
                                      'bg-background border border-border'}`}
                                  >
                                    {question.correctAnswer === idx && (
                                      <motion.span
                                        animate={{
                                          scale: [1, 1.2, 1],
                                          rotate: [0, 10, -10, 0]
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-secondary" />
                                      </motion.span>
                                    )}
                                    <span>{option}</span>
                                  </motion.div>
                                ))}
                              </div>
                              <div className="flex justify-end mt-4 pt-4 border-t border-border">
                                <motion.button
                                  onClick={() => selectQuestionForEdit(question)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 text-primary hover:text-primary/80 transition-colors flex items-center"
                                >
                                  <FontAwesomeIcon icon={faEdit} className="ml-2" />
                                  تعديل
                                </motion.button>
                                <motion.button
                                  onClick={() => deleteQuestion(question.id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors flex items-center"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="ml-2" />
                                  حذف
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10 bg-background rounded-lg border border-dashed border-border"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            y: [0, -5, 0]
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'reverse'
                          }}
                        >
                          <FontAwesomeIcon icon={faBookOpen} className="text-4xl text-border mb-3" />
                        </motion.div>
                        <p className="text-foreground/80">لا توجد أسئلة مخزنة في هذا الجزء.</p>
                        <p className="text-foreground/50 text-sm mt-1">يمكنك إضافة أسئلة من خلال الضغط على زر "إضافة أسئلة جديدة" أعلاه.</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
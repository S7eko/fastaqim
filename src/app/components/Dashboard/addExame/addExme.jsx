import React, { useState } from 'react';

const Exame = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [points, setPoints] = useState(1);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to an API
    const mcqData = {
      question,
      options,
      correctAnswer,
      points
    };
    console.log('Submitted MCQ:', mcqData);
    // Reset form after submission
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setPoints(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Add MCQ Question</h2>
          <p className="mt-2 text-sm text-gray-600">Fill in the details for your multiple choice question</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Question Field */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <textarea
                id="question"
                name="question"
                rows={3}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            {/* Options Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (Mark the correct answer)
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="correctAnswer"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                    />
                    <input
                      type="text"
                      className="ml-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Points Field */}
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                id="points"
                name="points"
                type="number"
                min="1"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add MCQ Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Exame;
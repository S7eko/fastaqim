"use client";
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookQuran, faMosque, faPray, faSearch, faSpinner, faExclamationTriangle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const DuaService = () => {
  // State management
  const [duas, setDuas] = useState([]);
  const [azkar, setAzkar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('duas');
  const [searchQuery, setSearchQuery] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // API endpoints
  const API_ENDPOINTS = {
    duas: '/api/duas', // Using the new proxy endpoint
    azkar: '/api/azkar' // Using the new proxy endpoint
  };

  // Fetch data with retry mechanism
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [duasResponse, azkarResponse] = await Promise.all([
        fetch(API_ENDPOINTS.duas),
        fetch(API_ENDPOINTS.azkar)
      ]);

      // Validate responses
      if (!duasResponse.ok || !azkarResponse.ok) {
        throw new Error('فشل في تحميل البيانات من الخادم');
      }

      const [duasData, azkarData] = await Promise.all([
        duasResponse.json(),
        azkarResponse.json()
      ]);

      // Validate data structure
      if (!duasData?.quran_duas || !azkarData?.adhan_azkar) {
        throw new Error('بيانات غير صالحة من الخادم');
      }

      setDuas(duasData.quran_duas);
      setAzkar(azkarData.adhan_azkar);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      // Auto-retry up to 3 times
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and retry on count change
  useEffect(() => {
    fetchData();
  }, [retryCount]);

  // Filter data based on search query
  const filterData = (data) => {
    return data.filter(item =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Error component
  const ErrorMessage = () => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-400 mr-2"
        />
        <div>
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              fetchData();
            }}
            className="mt-2 text-red-600 hover:text-red-800 flex items-center"
          >
            <FontAwesomeIcon icon={faSyncAlt} className="mr-1" />
            حاول مرة أخرى
          </button>
        </div>
      </div>
    </div>
  );

  // Loading component
  const LoadingIndicator = () => (
    <div className="flex justify-center py-12">
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin text-4xl text-blue-500"
      />
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 text-gray-500">
      لا توجد بيانات متاحة حاليًا
    </div>
  );

  // Tab content component
  const TabContent = ({ data, type }) => {
    const filteredData = filterData(data);

    if (filteredData.length === 0) {
      return searchQuery ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد نتائج تطابق بحثك
        </div>
      ) : (
        <EmptyState />
      );
    }

    return (
      <>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FontAwesomeIcon
            icon={type === 'duas' ? faPray : faMosque}
            className="ml-2"
            color={type === 'duas' ? '#3B82F6' : '#10B981'}
          />
          {type === 'duas' ? 'الأدعية القرآنية' : 'أذكار الأذان'}
        </h2>

        {filteredData.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-6 mb-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-right text-lg leading-relaxed text-gray-800 font-arabic">
              {item.text}
            </div>
            <div className="mt-4 flex justify-end">
              <span className={`px-3 py-1 rounded-full text-sm ${type === 'duas'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-green-100 text-green-600'
                }`}>
                {item.count} مرة
              </span>
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-24 pb-16" dir="rtl">
      <main className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">الأدعية والأذكار</h1>
          <p className="text-gray-600">مجموعة من الأدعية القرآنية وأذكار الأذان</p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage />}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('duas')}
              className={`flex-1 py-5 flex flex-col items-center justify-center transition-all ${activeTab === 'duas'
                ? 'bg-gradient-to-b from-blue-50 to-blue-100 text-blue-600 border-b-2 border-blue-500 shadow-inner'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-500'
                }`}
            >
              <FontAwesomeIcon
                icon={faBookQuran}
                className={`text-lg mb-2 transition-all ${activeTab === 'duas' ? 'scale-110' : ''}`}
              />
              <span className="text-sm font-medium">الأدعية القرآنية</span>
            </button>

            <button
              onClick={() => setActiveTab('azkar')}
              className={`flex-1 py-5 flex flex-col items-center justify-center transition-all ${activeTab === 'azkar'
                ? 'bg-gradient-to-b from-green-50 to-green-100 text-green-600 border-b-2 border-green-500 shadow-inner'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-green-500'
                }`}
            >
              <FontAwesomeIcon
                icon={faMosque}
                className={`text-lg mb-2 transition-all ${activeTab === 'azkar' ? 'scale-110' : ''}`}
              />
              <span className="text-sm font-medium">أذكار الأذان</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="ابحث في الأدعية أو الأذكار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <TabContent
              data={activeTab === 'duas' ? duas : azkar}
              type={activeTab}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500 shadow-lg">
        <div className="container mx-auto px-4">
          جميع الحقوق محفوظة © {new Date().getFullYear()} منصة القرآن الكريم
        </div>
      </footer>
    </div>
  );
};

export default DuaService;
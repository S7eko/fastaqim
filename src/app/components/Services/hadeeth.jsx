"use client";

import React, { useState, useEffect } from "react";

const Hadith = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookDetails, setBookDetails] = useState(null);

  // fetch helper
  const fetchWithErrorHandling = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`فشل في جلب البيانات: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  // get collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWithErrorHandling("/api/sunnah/collections");
        setCollections(data.data);
      } catch (err) {
        setError("تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.");
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // get books
  useEffect(() => {
    if (selectedCollection) {
      const fetchBooks = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await fetchWithErrorHandling(
            `/api/sunnah/collections/${selectedCollection}/books`
          );
          setBooks(data.data);
        } catch (err) {
          setError("تعذر تحميل الأبواب. يرجى المحاولة مرة أخرى.");
        } finally {
          setLoading(false);
        }
      };
      fetchBooks();
    }
  }, [selectedCollection]);

  // get hadiths
  const fetchHadiths = async (page = 1) => {
    if (selectedBook && selectedCollection) {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchWithErrorHandling(
          `/api/sunnah/collections/${selectedCollection}/books/${selectedBook}/hadiths?page=${page}&limit=20`
        );

        const mappedHadiths = (data.data || []).map((item) => {
          const arabicHadith = item.hadith.find((h) => h.lang === "ar");
          let arabicText = arabicHadith?.body || "";

          arabicText = arabicText
            .replace(/<a\b[^>]*>(.*?)<\/a>/g, "$1") // remove links
            .replace(/<[^>]+>/g, "") // remove tags
            .replace(/\s+/g, " ")
            .trim();

          return {
            hadithNumber: item.hadithNumber,
            arabicText,
          };
        });

        setHadiths(mappedHadiths);
        setTotalPages(
          data.pagination
            ? Math.ceil(data.pagination.total / data.pagination.limit)
            : 1
        );
        setCurrentPage(page);
      } catch (err) {
        setError("تعذر تحميل الأحاديث. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    }
  };

  // get book details
  useEffect(() => {
    if (selectedBook && selectedCollection) {
      const fetchBookDetails = async () => {
        try {
          const data = await fetchWithErrorHandling(
            `/api/sunnah/collections/${selectedCollection}/books/${selectedBook}`
          );
          setBookDetails(data.data);
        } catch (err) {
          console.error("فشل في جلب تفاصيل الكتاب:", err);
        }
      };
      fetchBookDetails();
      fetchHadiths(1);
    }
  }, [selectedBook, selectedCollection]);

  // filter hadiths
  const filteredHadiths = hadiths.filter((hadith) =>
    hadith.arabicText?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // collection names
  const getCollectionName = (name) => {
    const collectionNames = {
      bukhari: "صحيح البخاري",
      muslim: "صحيح مسلم",
      abudawud: "سنن أبي داود",
      tirmidhi: "سنن الترمذي",
      nasai: "سنن النسائي",
      ibnmajah: "سنن ابن ماجه",
      malik: "موطأ مالك",
      riyadussalihin: "رياض الصالحين",
      adab: "الأدب المفرد",
      qudsi: "الأحاديث القدسية",
      nawawi: "الأربعون النووية",
    };
    return collectionNames[name] || name;
  };

  // extract sanad and matn
  const extractSanad = (text) => {
    let sanadEndIndex = text.indexOf("قال رسول الله");
    if (sanadEndIndex === -1) sanadEndIndex = text.indexOf("قال النبي");

    if (sanadEndIndex !== -1) {
      return {
        sanad: text.substring(0, sanadEndIndex).trim(),
        matn: text.substring(sanadEndIndex).trim(),
      };
    }
    return { sanad: "", matn: text };
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6 md:p-10 mt-[75px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-[var(--secondary)] shadow-lg">
            <span className="text-white text-5xl">📖</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--secondary)] mb-4">
            موسوعة الأحاديث النبوية
          </h1>
          <p className="text-lg text-[var(--foreground)]/80">
            من أصح الكتب – مع واجهة حديثة وألوان متناسقة
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-400 p-4 rounded-xl mb-8 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-lg p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Collection */}
            <div>
              <label className="block text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 text-right">
                📚 اختر كتاب الحديث
              </label>
              <select
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] text-right focus:ring-2 focus:ring-[var(--secondary)]"
                value={selectedCollection}
                onChange={(e) => {
                  setSelectedCollection(e.target.value);
                  setSelectedBook("");
                  setHadiths([]);
                  setBookDetails(null);
                }}
              >
                <option value="">-- اختر كتاب الحديث --</option>
                {collections.map((collection) => (
                  <option
                    key={collection.name}
                    value={collection.name}
                    className="text-black dark:text-white"
                  >
                    {getCollectionName(collection.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Book */}
            <div>
              <label className="block text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 text-right">
                🏛️ اختر الباب
              </label>
              <select
                className="w-full p-4 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] text-right focus:ring-2 focus:ring-[var(--secondary)]"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                disabled={!selectedCollection}
              >
                <option value="">-- اختر الباب --</option>
                {books.map((book) => (
                  <option
                    key={book.bookNumber}
                    value={book.bookNumber}
                    className="text-black dark:text-white"
                  >
                    {
                      // نفضل الاسم العربي لو موجود
                      (book.book.find((b) => b.lang === "ar")?.name) ||
                      (book.book.find((b) => b.lang === "en")?.name) ||
                      `الكتاب رقم ${book.bookNumber}`
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Details */}
          {bookDetails && (
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-yellow-300 to-yellow-400 border border-yellow-500 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {bookDetails.arabicName || bookDetails.name}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 font-semibold">
                عدد الأحاديث: {bookDetails.hadiths}
              </p>
            </div>
          )}

          {/* Search */}
          {selectedBook && (
            <div className="mt-6">
              <label className="block text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 text-right">
                🔍 بحث في الأحاديث
              </label>
              <input
                type="text"
                placeholder="ابحث هنا..."
                className="w-full p-4 rounded-xl border border-[var(--border)] text-right focus:ring-2 focus:ring-[var(--primary)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Hadiths */}
        {hadiths.length > 0 && (
          <div className="space-y-8">
            {filteredHadiths.map((hadith) => {
              const { sanad, matn } = extractSanad(hadith.arabicText);
              return (
                <div
                  key={hadith.hadithNumber}
                  className="p-6 rounded-2xl shadow-md bg-[var(--card)] border border-[var(--border)] hover:shadow-lg transition"
                >
                  <div className="mb-4 text-center">
                    <span className="bg-[var(--secondary)] text-[var(--secondary-foreground)] px-4 py-1 rounded-full shadow">
                      رقم الحديث: {hadith.hadithNumber}
                    </span>
                  </div>

                  {sanad && (
                    <p className="mb-4 text-right text-gray-700 dark:text-gray-300 leading-loose border-r-4 border-[var(--accent)] pr-3">
                      {sanad}
                    </p>
                  )}

                  <p className="text-right text-2xl leading-loose font-[Scheherazade] text-gray-900 dark:text-gray-100">
                    {matn.startsWith("قال") && (
                      <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-lg font-extrabold shadow-md mr-2">
                        قال رسول الله ﷺ
                      </span>
                    )}
                    {matn.replace("قال رسول الله", "").trim()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hadith;

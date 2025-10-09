
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import DashboardLayout from './DashboardLayout';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function SearchResults() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await API.get(`/public-books/search?query=${query}`);
        setBooks(response.data);
      } catch (err) {
        setError(t('Failed to fetch search results.'));
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
    return <DashboardLayout><div className="text-center text-xl mt-10">{t('Loading search results...')}</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center text-red-500 text-xl mt-10">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('Search Results for')} "{query}"</h1>
        {books.length === 0 ? (
          <p className="text-center text-lg dark:text-gray-300">{t('No books found.')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                <div className="relative">
                  <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/300x400.png?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 truncate">{book.author}</p>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default SearchResults;

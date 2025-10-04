import React, { useState, useEffect } from 'react';
import API from '../api';
import DashboardLayout from './DashboardLayout';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function PublicLibrary() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoritedBooks, setFavoritedBooks] = useState([]);

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        const response = await API.get('/public-books');
        setBooks(response.data);
      } catch (err) {
        setError(t('Failed to fetch public books.'));
        console.error('Error fetching public books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBooks();
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await API.get('/favorites');
      setFavoritedBooks(response.data.map(book => book._id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleAddToPersonalLibrary = async (bookId) => {
    try {
      await API.post(`/collections/add-from-public/${bookId}`);
    } catch (err) {
      setError(t('Failed to add book to personal library.'));
      console.error('Error adding book to personal library:', err);
    }
  };

  const handleAddToFavorites = async (bookId) => {
    // Optimistic UI update
    setFavoritedBooks([...favoritedBooks, bookId]);

    try {
      await API.post('/favorites', { bookId });
    } catch (err) {
      // Revert UI update on error
      setFavoritedBooks(favoritedBooks.filter(id => id !== bookId));
      setError(t('Failed to add book to favorites.'));
    }
  };

  const handleRateBook = async (bookId, rating) => {
    try {
      const response = await API.post(`/public-books/${bookId}/rate`, { rating });
      const updatedBook = response.data;
      setBooks(books.map(book => book._id === bookId ? updatedBook : book));
    } catch (err) {
      setError(t('Failed to rate book.'));
      console.error('Error rating book:', err);
    }
  };

  if (loading) {
    return <DashboardLayout><div className="text-center text-xl mt-10">{t('Loading public library...')}</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center text-red-500 dark:text-red-400 text-xl mt-10">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">{t('Public Library')}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
              <div className="relative">
                <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5000/${book.coverImageURL}` : `http://localhost:5000${book.coverImageURL}`) : `https://via.placeholder.com/300x400.png?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover" />
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAddToFavorites(book._id)}>
                  <FaHeart className={favoritedBooks.includes(book._id) ? 'text-red-500' : 'text-gray-400'} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 truncate">{book.author}</p>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} onClick={() => handleRateBook(book._id, i + 1)} style={{ cursor: 'pointer' }} />
                  ))}
                </div>
                <button onClick={() => handleAddToPersonalLibrary(book._id)} className="w-full px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">{t('Add to Personal Library')}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination can be added here */}
      </div>
    </DashboardLayout>
  );
}

export default PublicLibrary;

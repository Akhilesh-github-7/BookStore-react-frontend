import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';
import API from '../api';
import { useTranslation } from 'react-i18next';

function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await API.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      setError(t('Failed to fetch favorites.'));
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    // Optimistic UI update
    const originalFavorites = [...favorites];
    setFavorites(favorites.filter((book) => book._id !== bookId));

    try {
      await API.delete(`/favorites/${bookId}`);
    } catch (err) {
      // Revert UI update on error
      setFavorites(originalFavorites);
      setError(t('Failed to remove favorite.'));
      console.error('Error removing favorite:', err);
    }
  };

  if (loading) {
    return <DashboardLayout><div className="text-center text-xl mt-10">{t('Loading favorites...')}</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center text-red-500 dark:text-red-400 text-xl mt-10">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('Favorites')}</h1>
        {favorites.length === 0 ? (
          <p className="text-center text-lg dark:text-gray-300">{t('You have no favorite books yet.')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((book) => (
              <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                <div className="relative">
                  <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5002/${book.coverImageURL}` : `http://localhost:5002${book.coverImageURL}`) : `https://via.placeholder.com/300x400.png?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover" />
                  <div className="absolute top-2 right-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md" onClick={() => handleRemoveFavorite(book._id)}>
                      <FaHeart className="text-red-500" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{book.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 truncate">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Favorites;

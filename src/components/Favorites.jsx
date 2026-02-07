import React, { useState, useEffect } from 'react';
import API from '../api';
import DashboardLayout from './DashboardLayout';
import { useTranslation } from 'react-i18next';
import BookCard from './BookCard';
import BookDetailModal from './BookDetailModal';
import SkeletonLoader from './SkeletonLoader';
import { FaHeart, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, [t]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await API.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      setError(t('Failed to fetch favorites.'));
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (bookId) => {
    // Since we are on the Favorites page, "toggling" usually means removing
    const originalFavorites = [...favorites];
    setFavorites(favorites.filter((book) => book._id !== bookId));

    try {
      await API.delete(`/favorites/${bookId}`);
    } catch (err) {
      setFavorites(originalFavorites);
      console.error('Error removing favorite:', err);
    }
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight relative">
            {t('Favorites')}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <SkeletonLoader type="card" count={8} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight relative pb-2 inline-block">
            {t('Your Favorites')}
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('All the books you have loved and saved.')}</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {favorites.map((book) => (
              <BookCard 
                key={book._id} 
                book={book} 
                onClick={openModal} 
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
              <FaHeart className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('No favorites yet')}</h3>
            <p className="text-slate-500 max-w-sm mb-6">{t('Heart books while exploring to build your personal list of favorites.')}</p>
            <Link 
              to="/public-library" 
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
            >
              <FaPlus className="text-xs" /> {t('Discover Books')}
            </Link>
          </div>
        )}

        {isModalOpen && (
          <BookDetailModal 
            book={selectedBook} 
            onClose={closeModal} 
            handleAddToFavorites={handleToggleFavorite} 
            favoritedBooks={favorites.map(fav => fav._id)} 
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default Favorites;

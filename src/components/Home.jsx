import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';
import API from '../api';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newlyAddedBooks, setNewlyAddedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, newlyAddedRes, historyRes, favoritesRes] = await Promise.all([
          API.get('/personal-books/trending'),
          API.get('/public-books?sortBy=createdAt&limit=6'),
          API.get('/history'),
          API.get('/favorites')
        ]);
        setTrendingBooks(trendingRes.data);
        setNewlyAddedBooks(newlyAddedRes.data);
        setHistory(historyRes.data);
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {/* Trending Books */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('Trending Books')}</h3>
          <Link to="#" className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
          {trendingBooks.map((book) => (
            <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5000/${book.coverImageURL}` : `http://localhost:5000${book.coverImageURL}`) : `https://via.placeholder.com/150x200?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{book.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{book.author}</p>
              <div className="flex items-center text-yellow-500 text-xs mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
                ({book.averageRating.toFixed(1)})
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newly Added Books */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('Newly Added Books')}</h3>
          <Link to="#" className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {newlyAddedBooks.map((book) => (
            <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
              <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5000/${book.coverImageURL}` : `http://localhost:5000${book.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
              <p className="text-xs font-semibold text-gray-800 dark:text-white">{book.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('History')}</h3>
          <Link to="#" className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {history.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
              <img src={item.book.coverImageURL ? (item.book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5000/${item.book.coverImageURL}` : `http://localhost:5000${item.book.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${item.book.title.replace(/\s/g, '+')}`} alt={item.book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
              <p className="text-xs font-semibold text-gray-800 dark:text-white">{item.book.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Favourites */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('Favourites')}</h3>
          <Link to="#" className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {favorites.map((book) => (
            <div key={book._id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-3">
              <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5000/${book.coverImageURL}` : `http://localhost:5000${book.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md">
                <FaHeart className="text-rose-500" />
              </div>
              <p className="text-xs font-semibold text-gray-800 dark:text-white">{book.title}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default Home;
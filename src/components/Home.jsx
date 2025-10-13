import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';
import API from '../api';
import { useTranslation } from 'react-i18next';
import BookDetailModal from './BookDetailModal'; // Import the modal component
import { useSocket } from '../context/SocketContext';
import SkeletonLoader from './SkeletonLoader';

function Home() {
  const { t } = useTranslation();
  const socket = useSocket();
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [showAllTrending, setShowAllTrending] = useState(false);
  const [newlyAddedBooks, setNewlyAddedBooks] = useState([]);
  const [showAllNewlyAdded, setShowAllNewlyAdded] = useState(false);
  const [history, setHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllNewlyAddedBooks = async () => {
    try {
      const response = await API.get('/public-books?sortBy=createdAt'); // Fetch all without limit
      setNewlyAddedBooks(response.data.books);
      setShowAllNewlyAdded(true);
    } catch (err) {
      console.error('Error fetching all newly added books:', err);
    }
  };

  const fetchAllTrendingBooks = async () => {
    try {
      const response = await API.get('/personal-books/trending'); // Fetch all without limit
      setTrendingBooks(response.data);
      setShowAllTrending(true);
    } catch (err) {
      console.error('Error fetching all trending books:', err);
    }
  };

  const fetchAllHistory = async () => {
    try {
      const response = await API.get('/history'); // Fetch all without limit
      setHistory(response.data);
      setShowAllHistory(true);
    } catch (err) {
      console.error('Error fetching all history:', err);
    }
  };

  const fetchAllFavorites = async () => {
    try {
      const response = await API.get('/favorites'); // Fetch all without limit
      setFavorites(response.data);
      setShowAllFavorites(true);
    } catch (err) {
      console.error('Error fetching all favorites:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, newlyAddedRes, historyRes, favoritesRes] = await Promise.all([
          API.get('/personal-books/trending?limit=4'), // Initial limit for trending
          API.get('/public-books?sortBy=createdAt&limit=4'), // Initial limit for newly added
          API.get('/history?limit=4'), // Initial limit for history
          API.get('/favorites?limit=4') // Initial limit for favorites
        ]);
        setTrendingBooks(trendingRes.data);
        setNewlyAddedBooks(newlyAddedRes.data.books);
        setHistory(historyRes.data);
        setFavorites(favoritesRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on('rating_updated', (updatedBook) => {
      setTrendingBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        )
      );
      setNewlyAddedBooks((prevBooks) =>
        Array.isArray(prevBooks) ? prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        ) : prevBooks
      );
    });

    socket.on('readers_count_updated', (updatedBook) => {
      setTrendingBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        )
      );
      setNewlyAddedBooks((prevBooks) =>
        Array.isArray(prevBooks) ? prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        ) : prevBooks
      );
      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.book && item.book._id === updatedBook._id ? { ...item, book: updatedBook } : item
        )
      );
    });

    return () => {
      socket.off('rating_updated');
      socket.off('readers_count_updated');
    };
  }, [socket]);

  const handleAddToFavorites = async (bookId) => {
    // Optimistic UI update
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(book => book._id === bookId)) {
        return prevFavorites;
      }
      const bookToAdd = trendingBooks.find(book => book._id === bookId) || newlyAddedBooks.find(book => book._id === bookId) || history.find(item => item.book._id === bookId)?.book;
      return bookToAdd ? [...prevFavorites, bookToAdd] : prevFavorites;
    });

    try {
      await API.post('/favorites', { bookId });
    } catch (err) {
      // Revert UI update on error
      setFavorites((prevFavorites) => prevFavorites.filter(book => book._id !== bookId));
      console.error('Error adding book to favorites:', err);
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

  return (
    <DashboardLayout>
      {/* Trending Books */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('Trending Books')}</h3>
          {!showAllTrending && (
            <Link to="#" onClick={fetchAllTrendingBooks} className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
          )}
          {showAllTrending && (
            <Link to="#" onClick={() => setShowAllTrending(false)} className="text-rose-500 hover:underline leading-none">{t('Show Less')}</Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
          {loading ? (
            <SkeletonLoader type="card" count={5} />
          ) : (
            (showAllTrending ? trendingBooks : trendingBooks.slice(0, 4)).map((book) => (
              <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer" onClick={() => openModal(book)}>
                <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/150x200?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{book.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{book.author}</p>
                <div className="flex items-center text-yellow-500 text-xs mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                  ({book.averageRating ? book.averageRating.toFixed(1) : 'N/A'})
                  <span className="ml-2 text-gray-600 dark:text-gray-300 text-xs">| {book.uniqueReadersCount || 0} {t('readers')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Newly Added Books */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('Newly Added Books')}</h3>
          {!showAllNewlyAdded && (
            <Link to="#" onClick={fetchAllNewlyAddedBooks} className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
          )}
          {showAllNewlyAdded && (
            <Link to="#" onClick={() => setShowAllNewlyAdded(false)} className="text-rose-500 hover:underline leading-none">{t('Show Less')}</Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : (
            (showAllNewlyAdded ? newlyAddedBooks : newlyAddedBooks.slice(0, 4)).map((book) => (
              <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 cursor-pointer" onClick={() => openModal(book)}>
                <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
                <p className="text-xs font-semibold text-gray-800 dark:text-white">{book.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{book.author}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* History */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('History')}</h3>
          {!showAllHistory && (
            <Link to="#" onClick={fetchAllHistory} className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
          )}
          {showAllHistory && (
            <Link to="#" onClick={() => setShowAllHistory(false)} className="text-rose-500 hover:underline leading-none">{t('Show Less')}</Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : (
            (showAllHistory ? history : history.slice(0, 4)).map((item) => (
              item.book && (
                <div key={item.book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 cursor-pointer" onClick={() => openModal(item.book)}>
                  <img src={item.book.coverImageURL ? (item.book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${item.book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${item.book.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${item.book.title.replace(/\s/g, '+')}`} alt={item.book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
                  <p className="text-xs font-semibold text-gray-800 dark:text-white">{item.book.title}</p>
                </div>
              )
            ))
          )}
        </div>
      </section>

      {/* Favourites */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white leading-none">{t('Favourites')}</h3>
          {!showAllFavorites && (
            <Link to="#" onClick={fetchAllFavorites} className="text-rose-500 hover:underline leading-none">{t('View all')}</Link>
          )}
          {showAllFavorites && (
            <Link to="#" onClick={() => setShowAllFavorites(false)} className="text-rose-500 hover:underline leading-none">{t('Show Less')}</Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-4">
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : (
            (showAllFavorites ? favorites : favorites.slice(0, 4)).map((book) => (
              <div key={book._id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-3 cursor-pointer" onClick={() => openModal(book)}>
                <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover rounded-lg mb-2" />
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md">
                  <FaHeart className="text-rose-500" />
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-white">{book.title}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {isModalOpen && (
        <BookDetailModal book={selectedBook} onClose={closeModal} handleAddToFavorites={handleAddToFavorites} favoritedBooks={favorites.map(fav => fav._id)} />
      )}
    </DashboardLayout>
  );
}

export default Home;
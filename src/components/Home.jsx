import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import DashboardLayout from './DashboardLayout';
import API from '../api';
import { useTranslation } from 'react-i18next';
import BookDetailModal from './BookDetailModal';
import { useSocket } from '../context/SocketContext';
import SkeletonLoader from './SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import BookCard from './BookCard';

function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
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
      const response = await API.get('/public-books?sortBy=createdAt');
      setNewlyAddedBooks(response.data.books);
      setShowAllNewlyAdded(true);
    } catch (err) {
      console.error('Error fetching all newly added books:', err);
    }
  };

  const fetchAllTrendingBooks = async () => {
    try {
      const response = await API.get('/personal-books/trending');
      setTrendingBooks(response.data);
      setShowAllTrending(true);
    } catch (err) {
      console.error('Error fetching all trending books:', err);
    }
  };

  const fetchAllHistory = async () => {
    try {
      const response = await API.get('/history');
      setHistory(response.data);
      setShowAllHistory(true);
    } catch (err) {
      console.error('Error fetching all history:', err);
    }
  };

  const fetchAllFavorites = async () => {
    try {
      const response = await API.get('/favorites');
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
          API.get('/personal-books/trending?limit=4'),
          API.get('/public-books?sortBy=createdAt&limit=4'),
          API.get('/history?limit=4'),
          API.get('/favorites?limit=4')
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
      const updateBooks = (books) => Array.isArray(books) ? books.map(book => book._id === updatedBook._id ? updatedBook : book) : books;
      setTrendingBooks(prev => updateBooks(prev));
      setNewlyAddedBooks(prev => updateBooks(prev));
    });

    socket.on('readers_count_updated', (updatedBook) => {
      const updateBooks = (books) => Array.isArray(books) ? books.map(book => book._id === updatedBook._id ? updatedBook : book) : books;
      setTrendingBooks(prev => updateBooks(prev));
      setNewlyAddedBooks(prev => updateBooks(prev));
      setHistory(prev => prev.map(item => item.book && item.book._id === updatedBook._id ? { ...item, book: updatedBook } : item));
    });

    return () => {
      socket.off('rating_updated');
      socket.off('readers_count_updated');
    };
  }, [socket]);

  const handleAddToFavorites = async (bookId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(book => book._id === bookId)) return prevFavorites;
      const bookToAdd = trendingBooks.find(book => book._id === bookId) || newlyAddedBooks.find(book => book._id === bookId) || history.find(item => item.book._id === bookId)?.book;
      return bookToAdd ? [...prevFavorites, bookToAdd] : prevFavorites;
    });

    try {
      await API.post('/favorites', { bookId });
    } catch (err) {
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

  const SectionHeader = ({ title, showAll, onToggle, hasData }) => (
    <div className="flex justify-between items-end mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-none relative">
        {title}
        <span className="absolute -bottom-2.5 left-0 w-1/3 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
      </h3>
      {hasData && (
        <button 
          onClick={onToggle} 
          className="group flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
        >
          {showAll ? t('Show Less') : t('View All')}
          <FaArrowRight className={`ml-2 transform transition-transform duration-300 ${showAll ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      )}
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
      <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    </div>
  );

  const GridContainer = ({ children }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
      {children}
    </div>
  );

  const renderBookGrid = (books, showAll, limit) => {
    const displayBooks = showAll ? books : books.slice(0, limit);
    return (
      <GridContainer>
        {displayBooks.map((book) => (
          <BookCard 
            key={book._id} 
            book={book} 
            onClick={openModal} 
            isFavorite={favorites.some(fav => fav._id === book._id)}
          />
        ))}
      </GridContainer>
    );
  };

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="relative mb-10 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            {t('Welcome back')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-200">{user?.username || 'Reader'}</span>! 👋
          </h1>
          <p className="text-slate-200 text-lg mb-6 leading-relaxed">
            {t('Discover your next favorite story among thousands of books. What will you read today?')}
          </p>
          <div className="flex gap-4">
            <Link to="/public-library" className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all transform hover:-translate-y-0.5">
              {t('Explore Library')}
            </Link>
            <Link to="/personal-library" className="px-6 py-2.5 bg-indigo-700/50 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-indigo-700/70 transition-all">
              {t('My Collection')}
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Books */}
      <section className="mb-12">
        <SectionHeader 
          title={t('Trending Now')} 
          showAll={showAllTrending} 
          onToggle={showAllTrending ? () => setShowAllTrending(false) : fetchAllTrendingBooks} 
          hasData={trendingBooks.length > 0}
        />
        {loading ? (
          <GridContainer>
            <SkeletonLoader type="card" count={6} />
          </GridContainer>
        ) : trendingBooks.length > 0 ? (
          renderBookGrid(trendingBooks, showAllTrending, 4)
        ) : (
          <EmptyState message={t('No trending books found at the moment.')} />
        )}
      </section>

      {/* Newly Added Books */}
      <section className="mb-12">
        <SectionHeader 
          title={t('Fresh Arrivals')} 
          showAll={showAllNewlyAdded} 
          onToggle={showAllNewlyAdded ? () => setShowAllNewlyAdded(false) : fetchAllNewlyAddedBooks}
          hasData={newlyAddedBooks.length > 0} 
        />
        {loading ? (
          <GridContainer>
            <SkeletonLoader type="card" count={6} />
          </GridContainer>
        ) : newlyAddedBooks.length > 0 ? (
          renderBookGrid(newlyAddedBooks, showAllNewlyAdded, 4)
        ) : (
          <EmptyState message={t('No new books added recently.')} />
        )}
      </section>

      {/* History */}
      <section className="mb-12">
        <SectionHeader 
          title={t('Continue Reading')} 
          showAll={showAllHistory} 
          onToggle={showAllHistory ? () => setShowAllHistory(false) : fetchAllHistory}
          hasData={history.length > 0} 
        />
        {loading ? (
          <GridContainer>
            <SkeletonLoader type="card" count={6} />
          </GridContainer>
        ) : history.length > 0 ? (
          <GridContainer>
            {(showAllHistory ? history : history.slice(0, 4)).map((item) => (
              item.book && (
                <BookCard 
                  key={item.book._id} 
                  book={item.book} 
                  onClick={openModal}
                  isFavorite={favorites.some(fav => fav._id === item.book._id)}
                />
              )
            ))}
          </GridContainer>
        ) : (
          <EmptyState message={t("You haven't read any books yet. Start exploring!")} />
        )}
      </section>

      {/* Favourites */}
      <section className="mb-12">
        <SectionHeader 
          title={t('Your Favorites')} 
          showAll={showAllFavorites} 
          onToggle={showAllFavorites ? () => setShowAllFavorites(false) : fetchAllFavorites}
          hasData={favorites.length > 0} 
        />
        {loading ? (
          <GridContainer>
            <SkeletonLoader type="card" count={6} />
          </GridContainer>
        ) : favorites.length > 0 ? (
          renderBookGrid(favorites, showAllFavorites, 4)
        ) : (
          <EmptyState message={t('No favorites yet. Heart a book to see it here!')} />
        )}
      </section>

      {isModalOpen && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={closeModal} 
          handleAddToFavorites={handleAddToFavorites} 
          favoritedBooks={favorites.map(fav => fav._id)} 
        />
      )}
    </DashboardLayout>
  );
}

export default Home;
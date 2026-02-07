import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import API from '../api';
import DashboardLayout from './DashboardLayout';
import { useTranslation } from 'react-i18next';
import BookDetailModal from './BookDetailModal';
import SkeletonLoader from './SkeletonLoader';
import BookCard from './BookCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function PublicLibrary() {
  const { t } = useTranslation();
  const socket = useSocket();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoritedBooks, setFavoritedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/public-books?page=${page}&limit=${booksPerPage}`);
        setBooks(response.data.books);
        setTotalPages(response.data.pages);
        setTotalBooksCount(response.data.totalBooks);
      } catch (err) {
        setError(t('Failed to fetch public books.'));
        console.error('Error fetching public books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBooks();
    fetchFavorites();

    socket.on('rating_updated', (updatedBook) => {
      setBooks((prevBooks) => {
        return prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        );
      });
    });

    socket.on('readers_count_updated', (updatedBook) => {
      setBooks((prevBooks) => {
        return prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        );
      });
    });

    return () => {
      socket.off('rating_updated');
    };
  }, [page, socket, t, booksPerPage]);

  const fetchFavorites = async () => {
    try {
      const response = await API.get('/favorites');
      setFavoritedBooks(response.data.map(book => book._id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleAddToFavorites = useCallback(async (bookId) => {
    setFavoritedBooks((prevFavoritedBooks) => {
      if (prevFavoritedBooks.includes(bookId)) {
        return prevFavoritedBooks;
      }
      return [...prevFavoritedBooks, bookId];
    });

    try {
      await API.post('/favorites', { bookId });
    } catch {
      setFavoritedBooks((prevFavoritedBooks) => prevFavoritedBooks.filter(id => id !== bookId));
      setError(t('Failed to add book to favorites.'));
    }
  }, [setFavoritedBooks, setError, t]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight relative">
            {t('Public Library')}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <SkeletonLoader type="card" count={booksPerPage} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center text-red-500 dark:text-red-400 text-xl font-medium bg-red-50 dark:bg-red-900/20 px-6 py-4 rounded-xl border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4 sm:mb-0 tracking-tight relative pb-2">
            {t('Public Library')}
            <span className="absolute bottom-0 left-0 w-24 h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
          </h1>
          
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
            {t('Showing')} <span className="text-indigo-600 dark:text-indigo-400 font-bold">{Math.min(booksPerPage * page, totalBooksCount)}</span> {t('of')} <span className="font-bold">{totalBooksCount}</span> {t('books')}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book._id} 
              book={book} 
              onClick={openModal} 
              isFavorite={favoritedBooks.includes(book._id)}
            />
          ))} 
        </div>

        {isModalOpen && (
          <BookDetailModal 
            book={selectedBook} 
            onClose={closeModal} 
            handleAddToFavorites={handleAddToFavorites} 
            favoritedBooks={favoritedBooks} 
          />
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FaChevronLeft className="mr-2" />
              {t('Previous')}
            </button>
            
            <div className="hidden sm:flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                    page === i + 1 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                      : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {t('Next')}
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PublicLibrary;

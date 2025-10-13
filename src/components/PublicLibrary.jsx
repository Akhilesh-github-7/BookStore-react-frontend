import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import API from '../api';
import DashboardLayout from './DashboardLayout';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import BookDetailModal from './BookDetailModal';
import SkeletonLoader from './SkeletonLoader';

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
  const [booksPerPage] = useState(4); // Display 4 books per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  const openModal = (bookId) => {
    const bookFromState = books.find(b => b._id === bookId);
    console.log('openModal: bookFromState', bookFromState);
    setSelectedBook(bookFromState);
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
        const newBooks = prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        );
        console.log('Frontend updating books state:', newBooks);
        return newBooks;
      });
    });

    socket.on('readers_count_updated', (updatedBook) => {
      setBooks((prevBooks) => {
        const newBooks = prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        );
        console.log('Frontend updating books state with new readers count:', newBooks);
        return newBooks;
      });
    });

    return () => {
      socket.off('rating_updated');
    };
  }, [page, socket, t, booksPerPage]);

  useEffect(() => {
    if (isModalOpen && selectedBook) {
      const updatedSelectedBook = books.find(book => book._id === selectedBook._id);
      if (updatedSelectedBook) {
        console.log('useEffect: updatedSelectedBook', updatedSelectedBook);
        setSelectedBook(updatedSelectedBook);
      }
    }
  }, [books, isModalOpen, selectedBook]);

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

  const handleAddToFavorites = useCallback(async (bookId) => {
    // Optimistic UI update
    setFavoritedBooks((prevFavoritedBooks) => {
      if (prevFavoritedBooks.includes(bookId)) {
        return prevFavoritedBooks;
      }
      return [...prevFavoritedBooks, bookId];
    });

    try {
      await API.post('/favorites', { bookId });
    } catch (err) {
      // Revert UI update on error
      setFavoritedBooks((prevFavoritedBooks) => prevFavoritedBooks.filter(id => id !== bookId));
      setError(t('Failed to add book to favorites.'));
    }
  }, [setFavoritedBooks, setError, t]);

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

  console.log('Type of handleAddToFavorites before render:', typeof handleAddToFavorites);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('Public Library')}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={booksPerPage} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return <DashboardLayout><div className="text-center text-red-500 dark:text-red-400 text-xl mt-10">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout key={JSON.stringify(books)}>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">{t('Public Library')}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id + '_' + book.averageRating + '_' + book.numberOfRatings} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer" onClick={() => openModal(book._id)}>
              <div className="relative">
                <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/300x400.png?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover" />
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => {e.stopPropagation(); handleAddToFavorites(book._id);}}>
                  <FaHeart className={favoritedBooks.includes(book._id) ? 'text-red-500' : 'text-gray-400'} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 truncate">{book.author}</p>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} onClick={(e) => {e.stopPropagation(); handleRateBook(book._id, i + 1);}} style={{ cursor: 'pointer' }} />
                  ))}
                  <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">{book.averageRating ? book.averageRating.toFixed(1) : 'N/A'} ({book.numberOfRatings || 0})</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">| {book.uniqueReadersCount || 0} {t('readers')}</span>
                </div>
                <button onClick={(e) => {e.stopPropagation(); handleAddToPersonalLibrary(book._id);}} className="w-full px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">{t('Add to Personal Library')}</button>
              </div>
            </div>
          ))} 
        </div>

        {isModalOpen && <BookDetailModal book={selectedBook} onClose={closeModal} handleAddToFavorites={handleAddToFavorites} favoritedBooks={favoritedBooks} />}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">{t('Showing')} {Math.min(booksPerPage, books.length)} {t('from')} {totalBooksCount} {t('data')}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {t('Previous')}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 text-sm font-medium ${page === i + 1 ? 'text-white bg-purple-600 border border-purple-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'} rounded-md hover:bg-gray-50 dark:hover:bg-gray-600`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {t('Next')}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PublicLibrary;

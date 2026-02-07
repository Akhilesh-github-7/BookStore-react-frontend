
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import DashboardLayout from './DashboardLayout';
import { useTranslation } from 'react-i18next';
import BookCard from './BookCard';
import BookDetailModal from './BookDetailModal';
import SkeletonLoader from './SkeletonLoader';

function CategoryPage() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favoritedBooks, setFavoritedBooks] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchBooksByCategory = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/public-books/search?genre=${categoryName}`);
        setBooks(response.data);
      } catch (err) {
        setError(t('Failed to fetch books for this category.'));
        console.error('Error fetching books by category:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await API.get('/favorites');
        setFavoritedBooks(response.data.map(book => book._id));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    if (categoryName) {
      fetchBooksByCategory();
      fetchFavorites();
    }
  }, [categoryName, t]);

  const handleAddToFavorites = async (bookId) => {
    setFavoritedBooks((prev) => prev.includes(bookId) ? prev : [...prev, bookId]);
    try {
      await API.post('/favorites', { bookId });
    } catch {
      setFavoritedBooks((prev) => prev.filter(id => id !== bookId));
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
            {t('Category:')} {categoryName}
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
            {t('Category:')} {categoryName}
            <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
          </h1>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('No books found in this category.')}</p>
          </div>
        ) : (
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
        )}

        {isModalOpen && (
          <BookDetailModal 
            book={selectedBook} 
            onClose={closeModal} 
            handleAddToFavorites={handleAddToFavorites} 
            favoritedBooks={favoritedBooks} 
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default CategoryPage;

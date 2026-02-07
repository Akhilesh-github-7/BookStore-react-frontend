import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import { FaStar, FaHeart, FaPlus, FaTrash, FaGlobe, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SkeletonLoader from './SkeletonLoader';
import { HiOutlineUpload } from 'react-icons/hi';

function PersonalLibrary() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const socket = useSocket();
  const [personalBooks, setPersonalBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    summary: '',
    isPublic: false,
    bookPdf: null,
    coverImage: null,
  });

  const [favoritedBooks, setFavoritedBooks] = useState([]);
  const [filterBy, setFilterBy] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await API.delete(`/personal-books/${bookToDelete}`);
        fetchPersonalBooks(currentPage);
        setShowDeleteModal(false);
        setBookToDelete(null);
      } catch (err) {
        setError(t('Failed to delete book.'));
        console.error('Error deleting book:', err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchPersonalBooks(currentPage);
      fetchFavorites();
    }

    socket.on('rating_updated', (updatedBook) => {
      setPersonalBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? updatedBook : book
        )
      );
    });

    return () => {
      socket.off('rating_updated');
    };
  }, [user, filterBy, sortBy, socket, currentPage]);

  const fetchFavorites = async () => {
    try {
      const response = await API.get('/favorites');
      setFavoritedBooks(response.data.map(book => book._id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchPersonalBooks = async (page) => {
    setLoading(true);
    try {
      const response = await API.get(`/personal-books?page=${page}&limit=${booksPerPage}&filterBy=${filterBy}&sortBy=${sortBy}`);
      setPersonalBooks(response.data.books || []);
      setTotalPages(response.data.pages);
      setTotalBooksCount(response.data.totalBooks || 0);
    } catch (err) {
      setError(t('Failed to fetch personal books.'));
      console.error('Error fetching personal books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('genre', newBook.genre);
    formData.append('summary', newBook.summary);
    formData.append('isPublic', newBook.isPublic);
    if (newBook.bookPdf) {
      formData.append('bookPdf', newBook.bookPdf);
    }
    if (newBook.coverImage) {
      formData.append('coverImage', newBook.coverImage);
    }

    try {
      await API.post('/personal-books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewBook({
        title: '',
        author: '',
        genre: '',
        summary: '',
        isPublic: false,
        bookPdf: null,
        coverImage: null,
      });
      setShowAddBookForm(false);
      fetchPersonalBooks(currentPage);
    } catch (err) {
      setError(t('Failed to add book.'));
      console.error('Error adding book:', err);
    }
  };

  const handleAddToPublic = async (bookId) => {
    try {
      await API.put(`/personal-books/${bookId}`, { isPublic: true });
      fetchPersonalBooks(currentPage);
    } catch {
      setError(t('Failed to add book to public library.'));
    }
  };

  const handleAddToFavorites = async (bookId) => {
    setFavoritedBooks((prevFavoritedBooks) => {
      if (prevFavoritedBooks.includes(bookId)) {
        return prevFavoritedBooks;
      }
      return [...prevFavoritedBooks, bookId];
    });

    try {
      await API.post('/favorites', { bookId });
    } catch {
      setFavoritedBooks(favoritedBooks.filter(id => id !== bookId));
      setError(t('Failed to add book to favorites.'));
    }
  };

  if (loading && !personalBooks.length) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight relative">
            {t('My Library')}
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <SkeletonLoader type="card" count={booksPerPage} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight relative pb-2 inline-block">
              {t('My Library')}
              <span className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"></span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your personal collection and uploads.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              {['', 'today', 'thisWeek', 'thisMonth'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setFilterBy(filter)} 
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                    filterBy === filter 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {filter === '' ? t('All') : t(filter.replace(/([A-Z])/g, ' $1').trim())}
                </button>
              ))}
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            >
              <option value="newest">{t('Newest First')}</option>
              <option value="rating">{t('Highest Rated')}</option>
            </select>

            <button 
              onClick={() => setShowAddBookForm(true)} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:-translate-y-0.5"
            >
              <FaPlus /> {t('Add Book')}
            </button>
          </div>
        </div>

        {showAddBookForm && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 mb-10 animate-fade-in-down">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">{t('Add New Book')}</h2>
            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('Title')}
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Author')}
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder={t('Genre')}
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-4">
                <textarea
                  placeholder={t('Description')}
                  value={newBook.summary}
                  onChange={(e) => setNewBook({ ...newBook, summary: e.target.value })}
                  className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all h-[156px] resize-none"
                ></textarea>
              </div>
              
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                  <input 
                    type="file"
                    id="book_pdf"
                    onChange={(e) => setNewBook({ ...newBook, bookPdf: e.target.files[0] })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                    required
                  />
                  <HiOutlineUpload className="text-3xl text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {newBook.bookPdf ? newBook.bookPdf.name : t('Upload Book PDF')}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">{t('PDF up to 10MB')}</span>
                </div>

                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer">
                  <input 
                    type="file"
                    id="cover_image"
                    onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.files[0] })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".jpg,.jpeg,.png,.gif"
                  />
                  <HiOutlineUpload className="text-3xl text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {newBook.coverImage ? newBook.coverImage.name : t('Upload Cover Image')}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">{t('JPG, PNG')}</span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBook.isPublic}
                    onChange={(e) => setNewBook({ ...newBook, isPublic: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-slate-700 dark:text-slate-300 font-medium">{t('Make Public')}</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAddBookForm(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">{t('Cancel')}</button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all">{t('Save Book')}</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {personalBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {personalBooks.map((book) => (
              <div key={book._id} className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-full">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/300x400.png?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleAddToFavorites(book._id)}>
                    <FaHeart className={favoritedBooks.includes(book._id) ? 'text-red-500' : 'text-slate-400'} />
                  </div>
                  {book.isPublic && (
                    <div className="absolute top-2 left-2 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      PUBLIC
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate mb-1" title={book.title}>{book.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">
                    {book.genre && Array.isArray(book.genre) ? book.genre.join(', ') : book.genre}
                  </p>
                  
                  <div className="mt-auto space-y-2">
                    {!book.isPublic && (
                      <button onClick={() => handleAddToPublic(book._id)} className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                        <FaGlobe className="text-xs" /> {t('Make Public')}
                      </button>
                    )}
                    <button onClick={() => {setShowDeleteModal(true); setBookToDelete(book._id);}} className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <FaTrash className="text-xs" /> {t('Delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
              <FaGlobe className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{t('Your library is empty')}</h3>
            <p className="text-slate-500 max-w-sm mb-6">{t('Upload your favorite books to start building your personal collection.')}</p>
            <button 
              onClick={() => setShowAddBookForm(true)} 
              className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all"
            >
              {t('Upload First Book')}
            </button>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100">
              <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">{t('Delete Book?')}</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">{t('This action cannot be undone. Are you sure you want to remove this book from your library?')}</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">{t('Cancel')}</button>
                <button onClick={handleDeleteBook} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/30 transition-all">{t('Delete')}</button>
              </div>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <FaChevronLeft className="mr-2" />
              {t('Previous')}
            </button>
            
            <div className="hidden sm:flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg transition-all ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                      : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
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

export default PersonalLibrary;

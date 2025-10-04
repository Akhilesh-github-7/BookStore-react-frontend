import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function PersonalLibrary() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [personalBooks, setPersonalBooks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddBookForm, setShowAddBookForm] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    isPublic: false,
    bookPdf: null,
    coverImage: null,
  });
  const [editingBook, setEditingBook] = useState(null);

  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollection, setEditingCollection] = useState(null);
  const [favoritedBooks, setFavoritedBooks] = useState([]);
  const [filterBy, setFilterBy] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user) {
      fetchPersonalBooks();
      fetchCollections();
      fetchFavorites();
    }
  }, [user, filterBy, sortBy]);

  const fetchFavorites = async () => {
    try {
      const response = await API.get('/favorites');
      setFavoritedBooks(response.data.map(book => book._id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchPersonalBooks = async () => {
    try {
      const response = await API.get(`/personal-books?filterBy=${filterBy}&sortBy=${sortBy}`);
      setPersonalBooks(response.data);
    } catch (err) {
      setError(t('Failed to fetch personal books.'));
      console.error('Error fetching personal books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await API.get('/collections');
      setCollections(response.data);
    } catch (err) {
      setError(t('Failed to fetch collections.'));
      console.error('Error fetching collections:', err);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('genre', newBook.genre);
    formData.append('description', newBook.description);
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
        description: '',
        isPublic: false,
        bookPdf: null,
        coverImage: null,
      });
      setShowAddBookForm(false);
      fetchPersonalBooks();
    } catch (err) {
      setError(t('Failed to add book.'));
      console.error('Error adding book:', err);
    }
  };

  const handleAddToPublic = async (bookId) => {
    try {
      await API.put(`/personal-books/${bookId}`, { isPublic: true });
      fetchPersonalBooks();
    } catch (err) {
      setError(t('Failed to add book to public library.'));
      console.error('Error adding book to public library:', err);
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
      console.error('Error adding book to favorites:', err);
    }
  };



  if (loading) {
    return <DashboardLayout><div className="text-center text-xl mt-10">{t('Loading personal library...')}</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center text-red-500 dark:text-red-400 text-xl mt-10">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">{t('Books')}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setFilterBy('')} className={`px-4 py-2 text-sm font-medium ${filterBy === '' ? 'text-white bg-blue-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'} rounded-md hover:bg-blue-700 hover:text-white`}>{t('All')}</button>
            <button onClick={() => setFilterBy('today')} className={`px-4 py-2 text-sm font-medium ${filterBy === 'today' ? 'text-white bg-blue-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'} rounded-md hover:bg-blue-700 hover:text-white`}>{t('Today')}</button>
            <button onClick={() => setFilterBy('thisWeek')} className={`px-4 py-2 text-sm font-medium ${filterBy === 'thisWeek' ? 'text-white bg-blue-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'} rounded-md hover:bg-blue-700 hover:text-white`}>{t('This Week')}</button>
            <button onClick={() => setFilterBy('thisMonth')} className={`px-4 py-2 text-sm font-medium ${filterBy === 'thisMonth' ? 'text-white bg-blue-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600'} rounded-md hover:bg-blue-700 hover:text-white`}>{t('This Month')}</button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
              <option value="newest">{t('Newest')}</option>
              <option value="rating">{t('Rating')}</option>
            </select>
            <button onClick={() => setShowAddBookForm(true)} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-md hover:bg-purple-700">{t('Add Book')}</button>
          </div>
        </div>

        {showAddBookForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('Add New Book')}</h2>
            <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('Title')}
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                className="p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                required
              />
              <input
                type="text"
                placeholder={t('Author')}
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                className="p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                required
              />
              <input
                type="text"
                placeholder={t('Genre')}
                value={newBook.genre}
                onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                className="p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                required
              />
              <textarea
                placeholder={t('Description')}
                value={newBook.description}
                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                className="p-2 border dark:border-gray-600 rounded col-span-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              ></textarea>
              <div className="col-span-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="book_pdf">{t('Upload PDF')}</label>
                <input 
                  type="file"
                  id="book_pdf"
                  onChange={(e) => setNewBook({ ...newBook, bookPdf: e.target.files[0] })}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer focus:outline-none"
                  accept=".pdf"
                  required
                />
              </div>
              <div className="col-span-full">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="cover_image">{t('Upload Cover Image')}</label>
                <input 
                  type="file"
                  id="cover_image"
                  onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.files[0] })}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer focus:outline-none"
                  accept=".jpg,.jpeg,.png,.gif"
                />
              </div>
              <label className="flex items-center col-span-full text-gray-900 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={newBook.isPublic}
                  onChange={(e) => setNewBook({ ...newBook, isPublic: e.target.checked })}
                  className="mr-2"
                />
                {t('Make Public')}
              </label>
              <div className="col-span-full flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddBookForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">{t('Cancel')}</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-md hover:bg-purple-700">{t('Add Book')}</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {personalBooks.map((book) => (
            <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
              <div className="relative">
                <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `http://localhost:5000/${book.coverImageURL}` : `http://localhost:5000${book.coverImageURL}`) : `https://via.placeholder.com/300x400.png?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="aspect-[3/4] w-full object-cover" />
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAddToFavorites(book._id)}>
                  <FaHeart className={favoritedBooks.includes(book._id) ? 'text-red-500' : 'text-gray-400'} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 truncate">{book.genre}</p>
                                  <div className="flex items-center mb-3">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                  </div>                <button onClick={() => handleAddToPublic(book._id)} className="w-full px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">{t('Add to Public Library')}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">{t('Showing')} {Math.min(12, personalBooks.length)} {t('from')} {personalBooks.length} {t('data')}</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">{t('Previous')}</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-md">1</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">2</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">3</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">{t('Next')}</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PersonalLibrary;

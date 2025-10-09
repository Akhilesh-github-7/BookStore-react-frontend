
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar, FaHeart, FaEyeSlash, FaBookOpen, FaDownload, FaTimes } from 'react-icons/fa';
import API from '../api';

const BookDetailModal = ({ book, onClose, handleAddToFavorites, favoritedBooks = [] }) => {
  const [otherBooksByAuthor, setOtherBooksByAuthor] = useState([]);

  useEffect(() => {
    const fetchOtherBooks = async () => {
      if (book && book.author && book._id) {
        try {
          const response = await API.get(`/public-books/author/${book.author}?excludeBookId=${book._id}`);
          setOtherBooksByAuthor(response.data);
        } catch (err) {
          console.error('Error fetching other books by author:', err);
          setOtherBooksByAuthor([]);
        }
      }
    };

    fetchOtherBooks();
  }, [book]);

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-11/12 md:w-3/4 lg:max-w-lg p-3 relative max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <FaArrowLeft size={18} />
          </button>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white absolute top-3 right-3">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Book Information */}
        <div className="flex flex-col md:flex-row mb-3">
          <img src={book.coverImageURL ? (book.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${book.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${book.coverImageURL}`) : `https://via.placeholder.com/150x200?text=${book.title.replace(/\s/g, '+')}`} alt={book.title} className="w-28 h-auto object-cover rounded-lg mb-3 md:mb-0 md:mr-3" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{book.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">by {book.author}</p>
            <div className="flex items-center mb-1">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300 ml-2 text-xs">({book.averageRating.toFixed(1)})</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Published on {new Date(book.createdAt).toLocaleDateString()}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {book.genre && Array.isArray(book.genre) && book.genre.map((g, index) => (
                <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {g}
                </span>
              ))}
            </div>
            <div className="flex items-center">
              <button
                className="bg-orange-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-orange-600 flex items-center text-xs"
                onClick={() => {
                  if (book.filePath) {
                    const downloadUrl = `https://bookstore-backend-3ujv.onrender.com${book.filePath}`;
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', book.title + '.pdf'); // Suggests a filename
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }
                }}
              >
                <FaDownload className="mr-1" /> Download
              </button>
              <div className="ml-3 flex items-center">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800 dark:text-white">{book.uniqueReadersCount || 0}</span>
                </div>
                <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">Readers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-around items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3">
          <button className="flex flex-col items-center text-gray-600 dark:text-gray-300" onClick={() => handleAddToFavorites(book._id)}>
            <FaHeart size={16} className={favoritedBooks.includes(book._id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-300 hover:text-rose-500'} />
            <span className="text-xs mt-1">Favorite</span>
          </button>

          <button
            className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-rose-500"
            onClick={async () => {
              if (book.filePath) {
                try {
                  await API.post('/history', { bookId: book._id });
                } catch (err) {
                  console.error('Error adding to history:', err);
                }
                window.open(`https://bookstore-backend-3ujv.onrender.com${book.filePath}`, '_blank');
              }
            }}
          >
            <FaBookOpen size={16} />
            <span className="text-xs mt-1">Read Online</span>
          </button>
        </div>

        {/* Synopsis/Description */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Description</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {book.summary || 'No description available.'}
            <a href="#" className="text-rose-500 hover:underline ml-1">Read More</a>
          </p>
        </div>

        {/* Other Books */}
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Other Books by this Author</h3>
                <a href="#" className="text-rose-500 hover:underline text-xs">View All</a>
            </div>
          <div className="grid grid-cols-3 gap-2">
            {otherBooksByAuthor.length > 0 ? (
              otherBooksByAuthor.map((b) => (
                <div key={b._id}>
                  <img src={b.coverImageURL ? (b.coverImageURL.startsWith('public/uploads/') ? `https://bookstore-backend-3ujv.onrender.com/${b.coverImageURL}` : `https://bookstore-backend-3ujv.onrender.com${b.coverImageURL}`) : `https://via.placeholder.com/100x150?text=${b.title.replace(/\s/g, '+')}`} alt={b.title} className="w-full h-auto object-cover rounded-lg" />
                  <p className="text-xs font-semibold text-gray-800 dark:text-white mt-1">{b.title}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-600 dark:text-gray-400 col-span-3">No Other Books by the Author</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookDetailModal;

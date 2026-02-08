
import React, { useState, useEffect, useMemo } from 'react';
import { FaStar, FaHeart, FaBookOpen, FaDownload, FaTimes, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import API, { getMediaURL, BASE_URL } from '../api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookDetailModal = ({ book: initialBook, onClose, handleAddToFavorites, favoritedBooks = [] }) => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(initialBook);
  const [otherBooksByAuthor, setOtherBooksByAuthor] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  // Derive the user's existing rating from the book's ratings array
  const userRating = useMemo(() => {
    if (!book || !book.ratings || !currentUser) return 0;
    const found = book.ratings.find(r => r.user === currentUser._id || r.user?._id === currentUser._id);
    return found ? found.rating : 0;
  }, [book, currentUser]);

  useEffect(() => {
    setBook(initialBook);
  }, [initialBook]);

  useEffect(() => {
    const fetchOtherBooks = async () => {
      if (book && book.author && book._id) {
        try {
          const response = await API.get(`/public-books/author/${book.author}?excludeBookId=${book._id}`);
          setOtherBooksByAuthor(response.data);
        } catch (error) {
          setOtherBooksByAuthor([]);
        }
      }
    };

    fetchOtherBooks();
  }, [book]);

  const handleRate = async (rating) => {
    setIsRating(true);
    try {
      const response = await API.post(`/public-books/${book._id}/rate`, { rating });
      setBook(response.data); // Update local book state with new average
    } catch (error) {
      console.error('Error rating book:', error);
    } finally {
      setIsRating(false);
    }
  };

  if (!book) return null;

  const isFavorited = favoritedBooks.includes(book._id);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-50 p-0 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl w-full max-w-2xl relative max-h-[95dvh] sm:max-h-[90dvh] overflow-hidden flex flex-col transform transition-all scale-100 shadow-indigo-500/10 border border-white/20 dark:border-slate-800">
        
        {/* Close Button - More prominent on mobile */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
        >
          <FaTimes size={18} />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8 custom-scrollbar">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8">
            {/* Book Cover - Centered on mobile */}
            <div className="w-40 sm:w-48 mx-auto sm:mx-0 shrink-0">
              <div className="relative group rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                <img 
                  src={getMediaURL(book.coverImageURL) || `https://via.placeholder.com/150x200?text=${book.title.replace(/\s/g, '+')}`} 
                  alt={book.title} 
                  className="w-full h-auto aspect-[3/4] object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4">
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 leading-tight">{book.title}</h2>
                <p className="text-base sm:text-lg font-medium text-indigo-600 dark:text-indigo-400">by {book.author}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mb-6">
                {/* Interactive Rating */}
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          disabled={isRating}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleRate(star)}
                          className="focus:outline-none transition-transform active:scale-125"
                        >
                          <FaStar 
                            size={14} 
                            className={`transition-colors sm:w-4 sm:h-4 ${
                              (hoverRating || userRating || Math.round(book.averageRating)) >= star 
                                ? (userRating >= star || hoverRating >= star ? 'text-amber-400 fill-current' : 'text-amber-400/40 fill-current') 
                                : 'text-slate-300 dark:text-slate-600'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 ml-2">
                      {book.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tighter sm:ml-3">
                    {book.numberOfRatings || 0} {t('Community Ratings')}
                  </p>
                </div>

                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  <FaCalendarAlt className="mr-1.5 opacity-70" />
                  {new Date(book.createdAt).getFullYear()}
                </div>

                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  <FaUsers className="mr-1.5 opacity-70" />
                  {book.uniqueReadersCount || 0} {t('Readers')}
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
                {book.genre && Array.isArray(book.genre) && book.genre.map((g, index) => (
                  <span key={index} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
                  onClick={() => {
                    if (book.filePath) {
                      navigate(`/read/${book._id}`);
                    }
                  }}
                >
                  <FaBookOpen /> {t('Read Now')}
                </button>
                <button
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all border border-slate-200 dark:border-slate-700"
                  onClick={() => {
                    if (book.filePath) {
                      const downloadUrl = `${BASE_URL}/public${book.filePath}?title=${encodeURIComponent(book.title)}`;
                      const link = document.body.appendChild(document.createElement('a'));
                      link.href = downloadUrl;
                      link.download = `${book.title}.pdf`;
                      link.click();
                      link.remove();
                    }
                  }}
                  title={t('Download PDF')}
                >
                  <FaDownload size={16} />
                </button>
                <button 
                  className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all border ${
                    isFavorited 
                      ? 'bg-red-50 border-red-100 text-red-500 dark:bg-red-900/20 dark:border-red-900/50' 
                      : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:text-red-500'
                  }`}
                  onClick={() => handleAddToFavorites(book._id)}
                  title={isFavorited ? t('Remove from Favorites') : t('Add to Favorites')}
                >
                  <FaHeart size={16} className={isFavorited ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-10 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
              {t('Synopsis')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "{book.summary || t('No description available.')}"
            </p>
          </div>

          {/* Other Books */}
          {otherBooksByAuthor.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">{t('More by this Author')}</h3>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 sm:gap-4">
                {otherBooksByAuthor.map((b) => (
                  <div key={b._id} className="group cursor-pointer">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 mb-2">
                      <img src={getMediaURL(b.coverImageURL) || `https://via.placeholder.com/100x150?text=${b.title.replace(/\s/g, '+')}`} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight group-hover:text-indigo-600 transition-colors">{b.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;

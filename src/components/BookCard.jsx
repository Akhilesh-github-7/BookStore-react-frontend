import React from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function BookCard({ book, onClick, isFavorite = false }) {
  const { t } = useTranslation();
  
  // Helper to handle image URLs safely
  const getCoverImage = (url) => {
    if (!url) return `https://via.placeholder.com/150x200?text=${book.title?.replace(/\s/g, '+') || 'No+Title'}`;
    if (url.startsWith('http')) return url;
    return `https://bookstore-backend-3ujv.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-slate-100 dark:border-slate-700"
      onClick={() => onClick(book)}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden w-full">
        <img 
          src={getCoverImage(book.coverImageURL)} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Favorite Icon (if applicable) */}
        {isFavorite && (
          <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm z-10">
            <FaHeart className="text-red-500 text-xs sm:text-sm" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1" title={book.title}>
          {book.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
          {book.author}
        </p>

        {/* Rating & Stats */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-amber-400 text-xs">
            <FaStar className="mr-1" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {book.averageRating ? book.averageRating.toFixed(1) : '0.0'}
            </span>
          </div>
          {book.uniqueReadersCount !== undefined && (
            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {book.uniqueReadersCount} {t('reads')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExpand, FaCompress, FaMoon, FaSun, FaInfoCircle, FaTimes } from 'react-icons/fa';
import API from '../api';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

function BookReader() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await API.get(`/debug/book/${bookId}`);
        setBook(response.data);
        await API.post('/history', { bookId });
      } catch (error) {
        console.error('Error fetching book for reader:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book || !book.filePath) return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6 text-center">
      <p className="text-xl font-bold mb-4">{t('Book not found or PDF unavailable.')}</p>
      <button onClick={() => navigate(-1)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all font-bold">{t('Go Back')}</button>
    </div>
  );

  const pdfUrl = `https://bookstore-backend-3ujv.onrender.com${book.filePath}`;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col h-[100dvh] w-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} transition-all duration-500 overflow-hidden`}>
      
      {/* Top Navigation Bar - Professional & Responsive */}
      <header className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 ${isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'} border-b backdrop-blur-md shadow-sm z-30 transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className={`p-2.5 rounded-xl hover:${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} transition-all active:scale-90`}
            title={t('Back to Library')}
          >
            <FaArrowLeft className="text-lg sm:text-xl" />
          </button>
          <div className="max-w-[120px] xs:max-w-[180px] sm:max-w-md">
            <h1 className="text-xs sm:text-sm font-bold truncate leading-tight">{book.title}</h1>
            <p className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} truncate`}>{book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'} transition-all active:scale-90`}
            title={isDarkMode ? t('Light Mode') : t('Dark Mode')}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          <button 
            onClick={toggleFullscreen} 
            className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-all active:scale-90 hidden xs:flex`}
            title={isFullscreen ? t('Exit Fullscreen') : t('Fullscreen')}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          <div className="h-6 w-[1px] bg-slate-700/50 mx-1 sm:mx-2 hidden sm:block"></div>

          <button 
            className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            onClick={() => navigate(-1)}
          >
            <span className="hidden xs:inline">{t('Finish Reading')}</span>
            <FaTimes className="xs:hidden" />
          </button>
        </div>
      </header>

      {/* Reader Area */}
      <main className="flex-grow relative bg-slate-800 touch-none" onClick={() => setShowControls(!showControls)}>
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
          title={book.title}
          className="w-full h-full border-none pointer-events-auto"
          loading="lazy"
        />
        
        {/* Floating Toggle Hint for Mobile */}
        <div className={`absolute bottom-6 right-6 transition-opacity duration-500 ${showControls ? 'opacity-0' : 'opacity-100'} pointer-events-none`}>
           <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-full border border-white/10 shadow-2xl text-indigo-400 animate-pulse">
              <FaInfoCircle size={24} />
           </div>
        </div>
      </main>

      {/* Mobile Immersive Toggle Area (Fixed Bottom) */}
      <div 
        className={`md:hidden fixed bottom-0 left-0 right-0 h-12 bg-transparent z-20 cursor-pointer`}
        onClick={() => setShowControls(!showControls)}
      ></div>
    </div>
  );
}

export default BookReader;

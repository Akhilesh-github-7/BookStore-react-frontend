import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaDownload, FaGlobe, FaShieldAlt, FaMoon, FaBell, FaChevronRight, FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from './ToggleSwitch';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import EditProfileModal from './EditProfileModal';
import ChangeProfileImageModal from './ChangeProfileImageModal';
import API from '../api';

function Settings() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, updateProfileImage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangeProfileImageModalOpen, setIsChangeProfileImageModalOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(false);

  const toggleFavorites = async () => {
    if (!isFavoritesOpen) {
      try {
        const response = await API.get('/favorites');
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    }
    setIsFavoritesOpen(!isFavoritesOpen);
  };

  const toggleDownloads = async () => {
    if (!isDownloadsOpen) {
      try {
        const response = await API.get('/history');
        console.log('Frontend received downloads:', response.data);
        setDownloads(response.data);
      } catch (error) {
        console.error('Error fetching downloads:', error);
      }
    }
    setIsDownloadsOpen(!isDownloadsOpen);
  };

  const toggleLanguages = () => {
    setIsLanguagesOpen(!isLanguagesOpen);
  };

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
    setIsLanguagesOpen(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex-1 text-center">{t('Settings')}</h1>
          <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} />
          </button>
        </header>

        <div className="text-center mb-8">
          <div className="relative inline-block mb-4 cursor-pointer" onClick={() => setIsChangeProfileImageModalOpen(true)}>
            <img 
              src={user?.profileImage ? `https://bookstore-backend-3ujv.onrender.com${user.profileImage}` : 'https://via.placeholder.com/150'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user?.username || 'Guest'}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.city && user?.country ? `${user.city}, ${user.country}` : 'City, Country'}</p>
          <button 
            className="mt-4 px-4 py-2 border border-blue-400 text-blue-400 dark:border-blue-300 dark:text-blue-300 rounded-full text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900"
            onClick={() => setIsEditProfileModalOpen(true)}
          >
            {t('Edit Profile')}
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold mb-4">{t('Content')}</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer" onClick={toggleFavorites}>
              <div className="flex items-center">
                <FaHeart className="text-red-500 mr-4" size={20} />
                <span className="text-gray-800 dark:text-white">{t('Favorites')}</span>
              </div>
              {isFavoritesOpen ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
            </div>
            {isFavoritesOpen && (
              <div className="p-4">
                {favorites.length > 0 ? (
                  <ul>
                    {favorites.map((book) => (
                      <li key={book._id} className="text-gray-800 dark:text-white py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">{book.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No favorite books yet.</p>
                )}
              </div>
            )}
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={toggleDownloads}>
              <div className="flex items-center">
                <FaDownload className="text-blue-500 mr-4" size={20} />
                <span className="text-gray-800 dark:text-white">{t('Downloads')}</span>
              </div>
              {isDownloadsOpen ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
            </div>
            {isDownloadsOpen && (
              <div className="p-4">
                {downloads.length > 0 ? (
                  <ul>
                    {downloads.map((item) => (
                      <li key={item._id} className="text-gray-800 dark:text-white py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">{item.book ? item.book.title : 'Unknown Book'}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">{t('No books downloaded')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold mb-4">{t('Preferences')}</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer" onClick={toggleLanguages}>
              <div className="flex items-center">
                <FaGlobe className="text-green-500 mr-4" size={20} />
                <span className="text-gray-800 dark:text-white">{t('Languages')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-400 mr-2">{t(i18n.language)}</span>
                {isLanguagesOpen ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
              </div>
            </div>
            {isLanguagesOpen && (
              <div className="p-4">
                <ul>
                  <li key="en" className="text-gray-800 dark:text-white py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer" onClick={() => handleLanguageSelect('en')}>{i18n.t('language_en', { lng: 'en' })}</li>
                  <li key="hi" className="text-gray-800 dark:text-white py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer" onClick={() => handleLanguageSelect('hi')}>{i18n.t('language_hi', { lng: 'hi' })}</li>
                  <li key="ml" className="text-gray-800 dark:text-white py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer" onClick={() => handleLanguageSelect('ml')}>{i18n.t('language_ml', { lng: 'ml' })}</li>
                </ul>
              </div>
            )}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <FaShieldAlt className="text-yellow-500 mr-4" size={20} />
                <span className="text-gray-800 dark:text-white">{t('Privacy')}</span>
              </div>
              <FaChevronRight className="text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <FaMoon className="text-gray-800 dark:text-white mr-4" size={20} />
                <span className="text-gray-800 dark:text-white">{t('Dark Mode')}</span>
              </div>
              <ToggleSwitch initialChecked={theme === 'dark'} onChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <FaBell className="text-purple-500 mr-4" size={20} />
                <span className="text-gray-800 dark:text-white">{t('Notifications')}</span>
              </div>
              <ToggleSwitch initialChecked={true} />
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal 
        isOpen={isEditProfileModalOpen} 
        onClose={() => setIsEditProfileModalOpen(false)} 
        currentUsername={user?.username || ''} 
        currentCity={user?.city || ''}
        currentCountry={user?.country || ''}
        onUpdateProfile={updateProfile} 
      />
      <ChangeProfileImageModal
        isOpen={isChangeProfileImageModalOpen}
        onClose={() => setIsChangeProfileImageModalOpen(false)}
        onUpdateProfileImage={updateProfileImage}
      />
    </div>
  );
}

export default Settings;

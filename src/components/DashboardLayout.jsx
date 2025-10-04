import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaBook, FaStar, FaHeart, FaCog, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import ChangeProfileImageModal from './ChangeProfileImageModal';
import { useTranslation } from 'react-i18next';

function DashboardLayout({ children }) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangeProfileImageModalOpen, setIsChangeProfileImageModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category) {
      navigate(`/category/${category}`);
    }
  };
  const accentColor = 'text-rose-500';

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`);
    }
  };
  const { user, updateUsername, updateProfileImage } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfileModalOpen(true);
    setIsProfileMenuOpen(false);
  };

  const handleChangeProfileImageClick = () => {
    setIsChangeProfileImageModalOpen(true);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        {/* Sidebar */}
        <aside className={`w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4 flex-col fixed inset-y-0 left-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:fixed md:translate-x-0 md:flex transition-transform duration-200 ease-in-out`}>
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{t('BOOK STORE')}</div>
            <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 hover:text-rose-500 dark:hover:bg-gray-700">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <nav className="flex-grow">
            <ul>
              <li className="mb-4">
                <Link to="/home" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 ${location.pathname === '/home' ? accentColor : ''}`}>
                  <FaHome className="mr-3" />
                  {t('Dashboard')}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/public-library" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 ${location.pathname === '/public-library' ? accentColor : ''}`}>
                  <FaCompass className="mr-3" />
                  {t('Explore')}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/personal-library" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 ${location.pathname === '/personal-library' ? accentColor : ''}`}>
                  <FaBook className="mr-3" />
                  {t('Library')}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/recommendations" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 ${location.pathname === '/recommendations' ? accentColor : ''}`}>
                  <FaStar className="mr-3" />
                  {t('Recommendations')}
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/favorites" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 ${location.pathname === '/favorites' ? accentColor : ''}`}>
                  <FaHeart className="mr-3" />
                  {t('Favorites')}
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <ul>
              <li className="mb-4">
                <Link to="/settings" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400">
                  <FaCog className="mr-3" />
                  {t('Settings')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400">
                  <FaSignOutAlt className="mr-3" />
                  {t('Log Out')}
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-600 hover:text-rose-500 dark:hover:text-rose-400">
                <FaBars className="text-xl" />
              </button>
              <div className="text-2xl font-bold text-gray-800 dark:text-white ml-2 md:ml-0">{t('BOOK STORE')}</div>
            </div>
            <div className="hidden md:flex items-center flex-grow justify-center gap-4">
              <input
                type="text"
                placeholder={t('Search using Title or Author')}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <select className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">{t('Categories')}</option>
                <option value="Fiction">{t('Fiction')}</option>
                <option value="Non-Fiction">{t('Non-Fiction')}</option>
                <option value="Science">{t('Science')}</option>
                <option value="Fantasy">{t('Fantasy')}</option>
                <option value="History">{t('History')}</option>
              </select>
              <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600" onClick={handleSearch}>
                {t('Search')}
              </button>
            </div>
            <div className="relative flex items-center space-x-4">
              <button onClick={toggleProfileMenu} className="flex items-center space-x-2 focus:outline-none">
                {user?.profileImage ? (
                <img src={`http://localhost:5000${user.profileImage}`} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <FaUserCircle className="text-gray-600 text-2xl" />
              )}
                <span className="text-gray-800 dark:text-white">{user?.username || t('Guest')}</span>
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-40">
                  <button onClick={handleEditProfileClick} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left">{t('Edit Profile')}</button>
                  <button onClick={handleChangeProfileImageClick} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left">{t('Change Profile Image')}</button>
                </div>
              )}
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:ml-64">
            {children}
          </main>
        </div>
      </div>
      <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          currentUsername={user?.username || ''}
          onUpdateUsername={updateUsername}
        />
        <ChangeProfileImageModal
          isOpen={isChangeProfileImageModalOpen}
          onClose={() => setIsChangeProfileImageModalOpen(false)}
          onUpdateProfileImage={updateProfileImage}
        />
    </>
  );
}

export default DashboardLayout;

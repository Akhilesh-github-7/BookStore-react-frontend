import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCompass, FaBook, FaStar, FaHeart, FaCog, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import ChangeProfileImageModal from './ChangeProfileImageModal';
import { useTranslation } from 'react-i18next';
import API, { getMediaURL } from '../api';
import Logo from './Logo';

function DashboardLayout({ children }) {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangeProfileImageModalOpen, setIsChangeProfileImageModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await API.get('/public-books/genres');
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Sync selected category with URL
  useEffect(() => {
    if (location.pathname.startsWith('/category/')) {
      const cat = decodeURIComponent(location.pathname.split('/')[2]);
      setSelectedCategory(cat);
    } else if (location.pathname === '/public-library') {
      setSelectedCategory('');
    }
  }, [location.pathname]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (category) {
      navigate(`/category/${encodeURIComponent(category)}`);
    } else {
      navigate('/public-library');
    }
  };
  const accentColor = 'text-rose-500';

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`);
      setIsMobileSearchOpen(false);
    }
  };
  const { user, logout, updateProfile, updateProfileImage } = useAuth();

  const handleUpdateProfile = async (profileData) => {
    try {
      const result = await updateProfile(profileData);
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: error.message };
    }
  };

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
      <div className="flex min-h-[100dvh] bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Sidebar Overlay */}
        <div className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
        
        {/* Sidebar */}
        <aside className={`w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 p-6 flex-col fixed inset-y-0 left-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:fixed md:translate-x-0 md:flex transition-transform duration-300 ease-in-out shadow-lg md:shadow-none`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              <Logo className="h-9 w-9 mr-3 shadow-sm rounded-lg" />
              {t('BOOK STORE')}
            </div>
            <button onClick={toggleSidebar} className="md:hidden p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <nav className="flex-grow">
            <div className="mb-6">
              <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('Main Menu')}</h3>
              <ul className="space-y-1.5">
                {[
                  { path: '/home', icon: FaHome, label: 'Dashboard' },
                  { path: '/public-library', icon: FaCompass, label: 'Explore' },
                  { path: '/recommendations', icon: FaStar, label: 'Recommendations' },
                ].map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group
                        ${location.pathname === item.path 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700/50 hover:text-indigo-600'
                        }`}
                    >
                      <item.icon className={`mr-3 text-lg transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('Your Library')}</h3>
              <ul className="space-y-1.5">
                {[
                  { path: '/personal-library', icon: FaBook, label: 'My Books' },
                  { path: '/favorites', icon: FaHeart, label: 'Favorites' }
                ].map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 group
                        ${location.pathname === item.path 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-700/50 hover:text-indigo-600'
                        }`}
                    >
                      <item.icon className={`mr-3 text-lg transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="mt-auto space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                {user?.profileImage ? (
                  <img src={getMediaURL(user.profileImage)} alt="Profile" className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                    <FaUserCircle size={24} />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.username || t('Guest')}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || t('Sign in to sync')}</p>
                </div>
              </div>
              
              <ul className="space-y-1">
                <li>
                  <Link to="/settings" className="flex items-center px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 transition-all shadow-sm border border-transparent hover:border-slate-100">
                    <FaCog className="mr-2 text-sm opacity-70" />
                    {t('Settings')}
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <FaSignOutAlt className="mr-2 text-sm opacity-70" />
                    {t('Log Out')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          {/* Header */}
          <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 mr-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">
                <FaBars className="text-xl" />
              </button>
              <div className="hidden xs:flex md:hidden items-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                <Logo className="h-7 w-7 mr-2" />
                {t('BOOK STORE')}
              </div>
            </div>
            
            <div className="hidden md:flex items-center flex-grow max-w-2xl mx-8 gap-3">
              <div className="relative flex-grow group">
                <input
                  type="text"
                  placeholder={t('Search by Title, Author, or Genre...')}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm group-hover:shadow-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <select 
                className="py-2.5 px-4 bg-slate-50 border-none ring-1 ring-slate-200 dark:ring-slate-700 rounded-xl dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm" 
                value={selectedCategory} 
                onChange={handleCategoryChange}
              >
                <option value="">{t('All Categories')}</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{t(genre)}</option>
                ))}
              </select>
              
              <button 
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200" 
                onClick={handleSearch}
              >
                {t('Search')}
              </button>
            </div>

            <div className="relative flex items-center gap-2 sm:gap-4">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <FaCompass className="text-xl" />
              </button>

              <div className="relative group">
                <button 
                  onClick={toggleProfileMenu} 
                  className="flex items-center gap-2 sm:gap-3 focus:outline-none p-1 sm:p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col items-end hidden lg:flex">
                    <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{user?.username || t('Guest')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{user?.email ? t('Reader') : t('Visitor')}</span>
                  </div>
                  {user?.profileImage ? (
                    <img src={getMediaURL(user.profileImage)} alt="Profile" className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm group-hover:ring-indigo-200 transition-all" />
                  ) : (
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900 dark:to-blue-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-sm">
                      <FaUserCircle className="text-xl sm:text-2xl" />
                    </div>
                  )}
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 transform origin-top-right transition-all animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('Signed in as')}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.username || 'Guest'}</p>
                    </div>
                    <button onClick={handleEditProfileClick} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors">
                      <FaCog className="mr-3 text-slate-400" />
                      {t('Edit Profile')}
                    </button>
                    <button onClick={handleChangeProfileImageClick} className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors">
                      <FaUserCircle className="mr-3 text-slate-400" />
                      {t('Change Picture')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Mobile Search Overlay */}
          {isMobileSearchOpen && (
            <div className="md:hidden p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-fade-in-down">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder={t('Search...')}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <select 
                    className="flex-1 py-2 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-white text-sm" 
                    value={selectedCategory} 
                    onChange={handleCategoryChange}
                  >
                    <option value="">{t('All Genres')}</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{t(genre)}</option>
                    ))}
                  </select>
                  <button 
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm" 
                    onClick={handleSearch}
                  >
                    {t('Search')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 scroll-smooth w-full">
            {children}
          </main>
        </div>
      </div>
      <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          currentUsername={user?.username || ''}
          currentCity={user?.city || ''}
          currentCountry={user?.country || ''}
          onUpdateProfile={handleUpdateProfile}
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

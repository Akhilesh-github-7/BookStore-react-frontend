import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaHeart, FaDownload, FaGlobe, FaShieldAlt, FaMoon, FaBell, 
  FaChevronRight, FaChevronDown, FaArrowLeft, FaUserCircle, 
  FaTimes, FaCrown, FaCalendarAlt, FaBookOpen, FaKey, FaTrashAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from './ToggleSwitch';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import EditProfileModal from './EditProfileModal';
import ChangeProfileImageModal from './ChangeProfileImageModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import SkeletonLoader from './SkeletonLoader';
import API from '../api';
import { supportedLanguages } from '../i18n';

const TabButton = ({ id, label, icon: Icon, activeTab, onClick }) => {
  const active = activeTab === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap md:w-full
        ${active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 md:translate-x-1' 
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm'
        }`}
    >
      <Icon size={14} className={`${active ? 'text-white' : 'text-slate-400'} sm:text-lg`} />
      {label}
    </button>
  );
};

const SettingsSection = ({ title, subtitle, children, icon: Icon, iconColor = "text-indigo-600" }) => (
  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-6 last:mb-0">
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm ${iconColor}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-bold text-slate-800 dark:text-white">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

function Settings() {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, updateProfileImage, changePassword, deleteAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isChangeProfileImageModalOpen, setIsChangeProfileImageModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (activeTab === 'content' || activeTab === 'account') {
      const fetchContent = async () => {
        setLoadingContent(true);
        try {
          const [favRes, histRes] = await Promise.all([
            API.get('/favorites'),
            API.get('/history')
          ]);
          setFavorites(favRes.data);
          setDownloads(histRes.data);
        } catch (error) {
          console.error('Error fetching content settings:', error);
        } finally {
          setTimeout(() => setLoadingContent(false), 400); // Smooth transition
        }
      };
      fetchContent();
    }
  }, [activeTab]);

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);
  };

  const getCoverImage = (url, title) => {
    if (!url) return `https://via.placeholder.com/100x150?text=${title?.replace(/\s/g, '+') || 'Book'}`;
    if (url.startsWith('http')) return url;
    return `https://bookstore-backend-3ujv.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return 'January 2025';
    return new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [user]);

  const tabs = useMemo(() => [
    { id: 'account', label: t('Account'), icon: FaUserCircle },
    { id: 'content', label: t('Content'), icon: FaHeart },
    { id: 'appearance', label: t('Appearance'), icon: FaMoon },
    { id: 'security', label: t('Security'), icon: FaShieldAlt },
  ], [t]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 h-[100dvh] font-sans transition-colors duration-300 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col w-full h-full p-4 sm:p-6 lg:p-8 overflow-hidden">
        {/* Header - Full Width */}
        <header className="flex items-center gap-4 mb-6 sm:mb-8 shrink-0">
          <button 
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all shadow-sm group" 
            onClick={() => navigate('/home')}
          >
            <FaArrowLeft className="sm:w-[18px] group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('Settings')}</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t('Manage your global account preferences')}</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 flex-1 overflow-hidden">
          {/* Navigation Tabs - Full Height Sidebar on Desktop */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
            <nav className="flex md:flex-col gap-2">
              {tabs.map((tab) => (
                <TabButton 
                  key={tab.id} 
                  {...tab} 
                  activeTab={activeTab} 
                  onClick={setActiveTab} 
                />
              ))}
            </nav>
          </aside>

          {/* Main Panel - Full Height Scrollable */}
          <main className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none animate-fade-in flex flex-col overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12 custom-scrollbar">
              
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-8 sm:space-y-12 animate-slide-up">
                  <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8 sm:gap-10 pb-10 border-b border-slate-100 dark:border-slate-800 relative">
                    <div className="relative group cursor-pointer" onClick={() => setIsChangeProfileImageModalOpen(true)}>
                      <div className="absolute inset-0 bg-indigo-600 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <img 
                        src={getCoverImage(user?.profileImage, user?.username)} 
                        alt="Profile" 
                        className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-3xl sm:rounded-[56px] object-cover ring-8 ring-indigo-50 dark:ring-slate-800 transition-all group-hover:scale-105 z-10"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-white dark:border-slate-900 z-20 group-hover:bg-indigo-700 transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </div>
                    </div>
                    
                    <div className="text-center xl:text-left flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-center xl:items-start justify-center xl:justify-start gap-3 mb-2">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white truncate">{user?.username || 'Reader'}</h2>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-black uppercase tracking-wider">
                          <FaCrown />
                          PRO
                        </span>
                      </div>
                      <p className="text-lg text-slate-500 font-medium mb-6 truncate">{user?.email}</p>
                      
                      <div className="flex flex-wrap justify-center xl:justify-start gap-3">
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700">
                          <FaGlobe className="opacity-50 text-indigo-500" />
                          {user?.city && user?.country ? `${user.city}, ${user.country}` : t('Global Citizen')}
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-xs sm:text-sm font-bold border border-indigo-100 dark:border-indigo-900/30">
                          <FaCalendarAlt className="opacity-50" />
                          {t('Member since')} {memberSince}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full xl:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 active:scale-95 whitespace-nowrap"
                      onClick={() => setIsEditProfileModalOpen(true)}
                    >
                      {t('Edit Profile')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-indigo-300 dark:hover:border-indigo-900 transition-all hover:shadow-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                          <FaBookOpen size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('Reading Activity')}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-slate-900 dark:text-white">
                          {loadingContent ? '...' : downloads.length}
                        </p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">{t('Books Read')}</p>
                      </div>
                    </div>
                    
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-red-300 dark:hover:border-red-900 transition-all hover:shadow-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600">
                          <FaHeart size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('Collection')}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-slate-900 dark:text-white">
                          {loadingContent ? '...' : favorites.length}
                        </p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">{t('Favorites')}</p>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-blue-300 dark:hover:border-blue-900 transition-all hover:shadow-lg hidden lg:block">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                          <FaDownload size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('Offline Access')}</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-5xl font-black text-slate-900 dark:text-white">
                          {loadingContent ? '...' : downloads.length}
                        </p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">{t('Downloads')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab Content */}
              {activeTab === 'appearance' && (
                <div className="max-w-4xl space-y-8 animate-slide-up">
                  <SettingsSection 
                    title={t('Interface Theme')} 
                    subtitle={t('Customize how BookStore looks on your device')}
                    icon={FaMoon}
                  >
                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-700 dark:text-slate-200">{t('Dark Mode')}</p>
                      <ToggleSwitch initialChecked={theme === 'dark'} onChange={toggleTheme} />
                    </div>
                  </SettingsSection>

                  <SettingsSection 
                    title={t('Language Preference')} 
                    subtitle={t('Select your primary language for the interface')}
                    icon={FaGlobe}
                    iconColor="text-emerald-500"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'en', label: 'English', native: 'English' },
                        { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
                        { id: 'ml', label: 'Malayalam', native: 'മലയാളം' }
                      ].map((lang) => (
                        <button 
                          key={lang.id} 
                          className={`px-4 py-6 rounded-[2rem] border-2 transition-all relative overflow-hidden text-left
                            ${i18n.language === lang.id 
                              ? 'bg-white dark:bg-slate-800 border-indigo-600 text-indigo-600 shadow-md' 
                              : 'bg-white dark:bg-slate-900 border-transparent text-slate-500 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'
                            }`}
                          onClick={() => handleLanguageSelect(lang.id)}
                        >
                          {i18n.language === lang.id && (
                            <div className="absolute top-4 right-4">
                              <div className="bg-indigo-600 rounded-full p-1">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                              </div>
                            </div>
                          )}
                          <p className="text-lg font-black">{lang.native}</p>
                          <p className={`text-xs font-bold ${i18n.language === lang.id ? 'opacity-80' : 'text-slate-400'}`}>{lang.label}</p>
                        </button>
                      ))}
                    </div>
                  </SettingsSection>
                </div>
              )}

              {/* Content Tab Content */}
              {activeTab === 'content' && (
                <div className="space-y-10 animate-slide-up">
                  {loadingContent ? <SkeletonLoader type="text" count={5} /> : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                      <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2">{t('Recent Favorites')}</h3>
                        <div className="space-y-4">
                          {favorites.slice(0, 4).map(book => (
                            <div key={book._id} className="flex items-center gap-6 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all group">
                              <img src={getCoverImage(book.coverImageURL, book.title)} className="w-16 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <p className="text-lg font-black text-slate-800 dark:text-white truncate">{book.title}</p>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{book.author}</p>
                              </div>
                              <FaHeart className="text-red-500" />
                            </div>
                          ))}
                          {favorites.length === 0 && <p className="text-sm text-slate-400 italic ml-2">{t('No favorites yet.')}</p>}
                        </div>
                      </section>
                      <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2">{t('Download History')}</h3>
                        <div className="space-y-3">
                          {downloads.slice(0, 4).map(item => (
                            <div key={item._id} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-4 truncate">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600"><FaDownload size={14}/></div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{item.book?.title || 'Unknown'}</span>
                              </div>
                              <span className="text-[10px] font-black text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm uppercase">PDF</span>
                            </div>
                          ))}
                          {downloads.length === 0 && <p className="text-sm text-slate-400 italic ml-2">{t('No history available.')}</p>}
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              )}

                          {/* Security Tab Content */}
                          {activeTab === 'security' && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 animate-slide-up">
                              <div className="p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[3rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:border-indigo-300 dark:hover:border-indigo-900 transition-all">
                                <div>
                                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl sm:rounded-3xl shadow-sm text-amber-500 w-fit mb-6 sm:mb-8 group-hover:rotate-12 transition-transform">
                                    <FaKey size={20} className="sm:w-6 sm:h-6" />
                                  </div>
                                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">{t('Login Credentials')}</h3>
                                  <p className="text-xs sm:text-sm text-slate-500 font-medium mb-8 sm:mb-10 leading-relaxed">{t('Update your security keys and password regularly to keep your reading history protected.')}</p>
                                </div>
                                <button onClick={() => setIsChangePasswordModalOpen(true)} className="w-full py-3 sm:py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                                  {t('Change Password')}
                                </button>
                              </div>
                              
                              <div className="p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[3rem] bg-red-50 dark:bg-red-900/10 border-2 border-dashed border-red-200 dark:border-red-900/30 flex flex-col justify-between">
                                <div>
                                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl sm:rounded-3xl shadow-sm text-red-600 w-fit mb-6 sm:mb-8">
                                    <FaTrashAlt size={20} className="sm:w-6 sm:h-6" />
                                  </div>
                                  <h3 className="text-xl sm:text-2xl font-black text-red-600 mb-2">{t('Delete Identity')}</h3>
                                  <p className="text-xs sm:text-sm text-red-500/70 font-medium mb-8 sm:mb-10 leading-relaxed">{t('Permanently remove your digital footprint from BookStore. This process is irreversible and immediate.')}</p>
                                </div>
                                <button onClick={() => setIsDeleteAccountModalOpen(true)} className="w-full py-3 sm:py-4 bg-red-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/30">
                                  {t('Delete My Account')}
                                </button>
                              </div>
                            </div>
                          )}
            </div>
          </main>
        </div>
      </div>
      {/* Modals remain the same */}
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} currentUsername={user?.username || ''} currentCity={user?.city || ''} currentCountry={user?.country || ''} onUpdateProfile={updateProfile} />
      <ChangeProfileImageModal isOpen={isChangeProfileImageModalOpen} onClose={() => setIsChangeProfileImageModalOpen(false)} onUpdateProfileImage={updateProfileImage} />
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)} onChangePassword={changePassword} />
      <DeleteAccountModal isOpen={isDeleteAccountModalOpen} onClose={() => setIsDeleteAccountModalOpen(false)} onDeleteAccount={deleteAccount} />
    </div>
  );
}

export default Settings;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginBg from '../assets/images/LoginBg.jpg';
import { useTranslation } from 'react-i18next';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('Passwords do not match.'));
      return;
    }

    setLoading(true);
    const result = await register(username, email, password);
    if (result.success) {
      navigate('/login'); 
    } else {
      setError(result.message || t('Failed to register.'));
    }
    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-[100dvh] bg-cover bg-center bg-no-repeat transition-all duration-500 py-10 px-4"
      style={{ backgroundImage: `url(${LoginBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">{t('Join Us')}</h2>
          <p className="text-gray-200 text-sm">{t('Create your account to get started')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-100 text-sm font-semibold mb-1 ml-1">
              {t('Username')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-purple-300 transition-colors">
                <FaUser className="h-4 w-4" />
              </div>
              <input
                type="text"
                id="username"
                className="block w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder={t('johndoe')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-100 text-sm font-semibold mb-1 ml-1">
              {t('Email Address')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-purple-300 transition-colors">
                <FaEnvelope className="h-4 w-4" />
              </div>
              <input
                type="email"
                id="email"
                className="block w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder={t('name@example.com')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-100 text-sm font-semibold mb-1 ml-1">
              {t('Password')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-purple-300 transition-colors">
                <FaLock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="block w-full pl-11 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder={t('••••••••')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-gray-100 text-sm font-semibold mb-1 ml-1">
              {t('Confirm Password')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-purple-300 transition-colors">
                <FaLock className="h-4 w-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                className="block w-full pl-11 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder={t('••••••••')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-600/30"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              t('CREATE ACCOUNT')
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-200">
              {t('Already have an account?')}{' '}
              <Link to="/login" className="text-purple-200 hover:text-white transition-colors font-bold ml-1">
                {t('Login')}
              </Link>
            </p>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-transparent text-gray-300 font-medium">{t('Or register with')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center py-2.5 px-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 text-white transition-all duration-300"
            >
              <FaGoogle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-2.5 px-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 text-white transition-all duration-300"
            >
              <FaFacebookF className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;


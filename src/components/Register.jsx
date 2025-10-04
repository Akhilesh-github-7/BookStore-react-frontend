import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginBg from '../assets/images/LoginBg.jpg';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('Passwords do not match.'));
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      navigate('/login'); // Redirect to login page on successful registration
    } else {
      setError(result.message || t('Failed to register.'));
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginBg})` }}
    >
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 border-opacity-30 rounded-xl shadow-lg p-8 max-w-md w-full text-white dark:bg-gray-800 dark:bg-opacity-20 dark:border-gray-700">
        <h2 className="text-4xl font-bold mb-8 text-center text-white dark:text-white">{t('Welcome')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-white dark:text-gray-300 text-sm font-bold mb-2">{t('Username')}</label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder={t('Choose a username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-white dark:text-gray-300 text-sm font-bold mb-2">{t('Email')}</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder={t('Enter your email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-white dark:text-gray-300 text-sm font-bold mb-2">{t('Password')}</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder={t('Choose a password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-white dark:text-gray-300 text-sm font-bold mb-2">{t('Confirm Password')}</label>
          <input
            type="password"
            id="confirm-password"
            className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-white bg-opacity-70 placeholder-gray-500 dark:bg-gray-700 dark:text-gray-200"
            placeholder={t('Confirm your password')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-300 dark:text-red-400 text-xs italic mb-4 text-center">{error}</p>}
        <div className="flex items-center justify-between mb-6">
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out w-full"
          >
            {t('REGISTER')}
          </button>
        </div>
        <div className="flex justify-between text-sm mb-6">
          <Link to="/login" className="text-white dark:text-gray-300 hover:text-gray-200 dark:hover:text-white">{t('Already have an account? Login')}</Link>
        </div>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500">{t('OR REGISTER WITH')}</span>
            <div className="flex-grow border-t border-gray-400 dark:border-gray-600"></div>
          </div>

        <div className="flex justify-center space-x-6 mt-6">
          <button className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
            <img src="/google-icon.svg" alt={t('Google')} className="h-6 w-6" />
          </button>
          <button className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
            <img src="/facebook-icon.svg" alt={t('Facebook')} className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Register;


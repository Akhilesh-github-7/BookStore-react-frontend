import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function EditProfileModal({ isOpen, onClose, currentUsername, currentCity, currentCountry, onUpdateProfile }) {
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newCity, setNewCity] = useState(currentCity);
  const [newCountry, setNewCountry] = useState(currentCountry);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newUsername === currentUsername && newCity === currentCity && newCountry === currentCountry) {
      setError(t('No changes were made.'));
      setLoading(false);
      return;
    }

    const result = await onUpdateProfile({ username: newUsername, city: newCity, country: newCountry });
    if (result.success) {
      onClose();
    } else {
      setError(result.message || t('Failed to update profile.'));
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('Edit Profile')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('Username')}</label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('City')}</label>
            <input
              type="text"
              id="city"
              className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('Country')}</label>
            <input
              type="text"
              id="country"
              className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 dark:text-red-400 text-xs italic mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? t('Updating...') : t('Update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

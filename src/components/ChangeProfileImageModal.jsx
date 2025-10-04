import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function ChangeProfileImageModal({ isOpen, onClose, onUpdateProfileImage }) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedFile) {
      setError(t('Please select an image to upload.'));
      setLoading(false);
      return;
    }

    const result = await onUpdateProfileImage(selectedFile);
    if (result.success) {
      onClose();
    } else {
      setError(result.message || t('Failed to upload image.'));
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('Change Profile Image')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="profileImage" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('Select Image')}</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              className="shadow appearance-none border dark:border-gray-600 rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-gray-700"
              onChange={handleFileChange}
              required
            />
          </div>
          {selectedFile && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">{t('Selected file:')} {selectedFile.name}</p>
            </div>
          )}
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
              {loading ? t('Uploading...') : t('Upload')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeProfileImageModal;

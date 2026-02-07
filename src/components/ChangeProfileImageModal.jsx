import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaCloudUploadAlt, FaImage } from 'react-icons/fa';

function ChangeProfileImageModal({ isOpen, onClose, onUpdateProfileImage }) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/20 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('Change Profile Image')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-8">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-4 text-center">
              {t('Select a professional photo for your profile')}
            </label>
            
            <div className="relative group">
              <div className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
                previewUrl 
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' 
                  : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                  required
                />
                
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg mb-4" />
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{t('Click to change')}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <FaCloudUploadAlt className="text-3xl text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('Drop your image here')}</p>
                    <p className="text-xs text-slate-400 mt-1">{t('Supports JPG, PNG, WEBP')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('Uploading...')}
                </span>
              ) : t('Update Photo')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all"
            >
              {t('Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeProfileImageModal;

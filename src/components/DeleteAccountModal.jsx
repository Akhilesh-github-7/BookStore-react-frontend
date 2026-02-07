import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

function DeleteAccountModal({ isOpen, onClose, onDeleteAccount }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    const result = await onDeleteAccount();
    if (!result.success) {
      setError(result.message || t('Failed to delete account.'));
      setLoading(false);
    }
    // If success, user will be logged out and redirected, so no need to setLoading(false)
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/20 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600">
              <FaExclamationTriangle />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('Delete Account')}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors shadow-sm border border-transparent hover:border-slate-100">
            <FaTimes />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm leading-relaxed">
            {t('Are you absolutely sure you want to delete your account? This action cannot be undone. This will permanently delete your:')}
          </p>
          <ul className="list-disc list-inside text-sm text-slate-500 dark:text-slate-400 mb-6 space-y-1 ml-2">
            <li>{t('User profile and personal information')}</li>
            <li>{t('Reading history and progress')}</li>
            <li>{t('Personal book collection and uploads')}</li>
            <li>{t('Favorites list')}</li>
          </ul>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl mb-6">
            <p className="text-xs text-red-600 dark:text-red-400 font-bold">
              {t('Warning: This action is irreversible.')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('Deleting Account...')}
                </span>
              ) : t('Yes, Delete My Account')}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-all"
              disabled={loading}
            >
              {t('Cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;

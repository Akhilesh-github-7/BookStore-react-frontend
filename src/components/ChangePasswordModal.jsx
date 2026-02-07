import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaLock } from 'react-icons/fa';

function ChangePasswordModal({ isOpen, onClose, onChangePassword }) {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('New passwords do not match.'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('Password must be at least 6 characters long.'));
      return;
    }

    setLoading(true);
    const result = await onChangePassword(currentPassword, newPassword);
    if (result.success) {
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message || t('Failed to change password.'));
    }
    setLoading(false);
  };

  const InputField = ({ label, id, value, onChange, placeholder }) => (
    <div className="mb-5">
      <label htmlFor={id} className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <FaLock size={16} />
        </div>
        <input
          type="password"
          id={id}
          className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/20 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('Change Password')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-colors shadow-sm border border-transparent hover:border-slate-100">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <InputField 
            label={t('Current Password')}
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder={t('Enter current password')}
          />
          
          <InputField 
            label={t('New Password')}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('Enter new password')}
          />

          <InputField 
            label={t('Confirm New Password')}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('Confirm new password')}
          />

          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('Updating...')}
                </span>
              ) : t('Update Password')}
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

export default ChangePasswordModal;

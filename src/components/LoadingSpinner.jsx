import React from 'react';

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm z-[9999] transition-all duration-300">
      <div className="relative flex flex-col items-center">
        {/* Loading Spinner Container */}
        <div className="relative h-20 w-20">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Track Circle */}
          <svg className="absolute inset-0 h-full w-full opacity-10 text-slate-900 dark:text-white" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>

          {/* Animated Spinner Path */}
          <svg 
            className="animate-spin absolute inset-0 h-full w-full text-indigo-600 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path 
              className="opacity-100" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          {/* Inner Pulsing Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-indigo-100 dark:border-slate-800 transition-all duration-500">
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Optional Loading Text */}
        <div className="mt-6 flex flex-col items-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600/80 dark:text-indigo-400 animate-pulse">
            Syncing Library
          </p>
          <div className="flex gap-1 mt-2">
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
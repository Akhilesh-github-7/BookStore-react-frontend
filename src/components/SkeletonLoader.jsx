import React from 'react';

const SkeletonLoader = ({ type, count = 1 }) => {
  const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-slate-700/30 before:to-transparent";

  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="space-y-3 w-full">
            {[...Array(count)].map((_, i) => (
              <div key={i} className={`h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full ${shimmer}`}></div>
            ))}
          </div>
        );
      case 'image':
        return (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className={`aspect-[2/3] bg-slate-200 dark:bg-slate-700 rounded-2xl ${shimmer}`}></div>
            ))}
          </div>
        );
      case 'card':
        return (
          <>
            {[...Array(count)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm h-full animate-pulse">
                {/* Image Placeholder */}
                <div className="relative aspect-[2/3] bg-slate-200 dark:bg-slate-700"></div>
                
                {/* Content Placeholder */}
                <div className="p-4 space-y-3 flex-grow flex flex-col">
                  {/* Title */}
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4"></div>
                  {/* Author */}
                  <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full w-1/2"></div>
                  
                  {/* Bottom Stats */}
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/4"></div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        );
      case 'profile':
        return (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-32 mb-2"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-24 mb-4"></div>
            <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-32"></div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
              <div key={i} className={`h-10 bg-slate-200 dark:bg-slate-700 rounded-xl ${shimmer}`}></div>
            ))}
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
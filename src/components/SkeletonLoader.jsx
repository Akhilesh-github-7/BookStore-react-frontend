import React from 'react';
import './SkeletonLoader.css'; // We'll create this CSS file next

const SkeletonLoader = ({ type, count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="skeleton-text-wrapper">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-text"></div>
            ))}
          </div>
        );
      case 'image':
        return (
          <div className="skeleton-image-wrapper">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-image"></div>
            ))}
          </div>
        );
      case 'card':
        return (
          <div className="skeleton-card-wrapper">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-text medium"></div>
                <div className="skeleton-rating-readers">
                  <div className="skeleton-star"></div>
                  <div className="skeleton-text micro"></div>
                  <div className="skeleton-text micro"></div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="skeleton-default-wrapper">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-default"></div>
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};

export default SkeletonLoader;

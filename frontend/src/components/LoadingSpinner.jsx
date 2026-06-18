import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading data...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        {/* Pulsing outer ring */}
        <div className={`rounded-full border-brand-200 dark:border-slate-800 animate-pulse absolute inset-0 ${
          size === 'sm' ? 'border-2' : size === 'md' ? 'border-4' : 'border-8'
        }`} />
        
        {/* Spinning inner gradient */}
        <div
          className={`animate-spin rounded-full border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size]}`}
          style={{ borderStyle: 'solid' }}
        />
      </div>
      {text && (
        <span className="text-sm font-medium text-slate-500 dark:text-darkbg-muted animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
      ))}
    </div>
  );
};
export const CardSkeleton = () => {
  return (
    <div className="border border-slate-100 dark:border-darkbg-border bg-white dark:bg-darkbg-card rounded-2xl p-6 shadow-premium dark:shadow-premium-dark animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
  );
};

import React from 'react';

const Loader = ({ className = '', size = 'md', color = 'primary' }) => {
  if (color === 'primary' || color === 'gradient') {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    const svgSize = sizeMap[size] || sizeMap.md;

    return (
      <svg 
        className={`animate-spin ${svgSize} ${className}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#129eff" />
            <stop offset="100%" stopColor="#7545ff" />
          </linearGradient>
        </defs>
        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12" stroke="url(#loader-gradient)" strokeWidth="3" strokeOpacity="0.2"/>
        <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="url(#loader-gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  const borderSizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    white: 'border-white/20 border-t-white',
    accent: 'border-accent-blue/20 border-t-accent-blue',
    error: 'border-error/20 border-t-error',
    slate: 'border-slate-muted/20 dark:border-white/10 border-t-slate-muted dark:border-t-white/70'
  };

  return (
    <div
      className={`animate-spin rounded-full ${borderSizeClasses[size] || borderSizeClasses.md} ${colorClasses[color] || colorClasses.white} ${className}`}
    ></div>
  );
};

export default Loader;

import React from 'react';

/**
 * Reusable Loading spinner component.
 * Can be rendered full page, inside a card, or inline.
 */
const Loading = ({
  fullPage = false,
  text = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinnerClass = sizeStyles[size] || sizeStyles.md;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div
        className={`${spinnerClass} border-blue-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center min-w-[200px]">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loading;

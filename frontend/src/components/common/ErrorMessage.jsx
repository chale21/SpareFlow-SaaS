import React from 'react';

/**
 * Reusable ErrorMessage component for displaying error banners or inline alert boxes.
 */
const ErrorMessage = ({
  title = 'An error occurred',
  message,
  onDismiss,
  onRetry,
  className = '',
}) => {
  if (!message) return null;

  return (
    <div
      className={`rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800 flex items-start justify-between gap-3 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          {title && <h4 className="font-semibold text-red-900">{title}</h4>}
          <p className="mt-0.5 text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-900 focus:outline-none"
            >
              Try again
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 focus:outline-none p-1 rounded-md"
          aria-label="Dismiss message"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  labelClassName = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

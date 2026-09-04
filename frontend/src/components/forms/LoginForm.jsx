import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { validateLoginForm } from '../../utils/validators';

/**
 * Reusable LoginForm component.
 * Manages form state, client-side validation, loading indicator, and error banners.
 */
const LoginForm = ({ onSubmit, isLoading = false, externalError = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error on user input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const { errors: validationErrors, isValid } = validateLoginForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (onSubmit) {
      const result = await onSubmit(formData);
      if (result && !result.success && result.error) {
        setServerError(result.error);
      }
    }
  };

  const displayError = externalError || serverError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {displayError && (
        <ErrorMessage
          title="Authentication Failed"
          message={displayError}
          onDismiss={() => setServerError('')}
        />
      )}

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="owner@spareparts.com"
        error={errors.email}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={errors.password}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full mt-2"
      >
        Sign In to SpareFlow
      </Button>
    </form>
  );
};

export default LoginForm;

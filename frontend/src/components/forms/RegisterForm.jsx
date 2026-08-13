import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import { validateRegisterForm } from '../../utils/validators';

/**
 * Reusable RegisterForm component.
 * Supports Company Registration fields: Company Name, Owner Name, Email, Password.
 */
const RegisterForm = ({ onSubmit, isLoading = false, externalError = '' }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    const { errors: validationErrors, isValid } = validateRegisterForm(formData);

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
          title="Registration Failed"
          message={displayError}
          onDismiss={() => setServerError('')}
        />
      )}

      <Input
        label="Company / Shop Name"
        type="text"
        name="companyName"
        value={formData.companyName}
        onChange={handleChange}
        placeholder="e.g. Apex Auto Spare Parts"
        error={errors.companyName}
        required
        disabled={isLoading}
      />

      <Input
        label="Owner Full Name"
        type="text"
        name="ownerName"
        value={formData.ownerName}
        onChange={handleChange}
        placeholder="e.g. John Ali"
        error={errors.ownerName}
        required
        disabled={isLoading}
      />

      <Input
        label="Business Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="owner@apexspares.com"
        error={errors.email}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      <Input
        label="Account Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="At least 6 characters"
        error={errors.password}
        helperText="Password must be at least 6 characters long."
        required
        disabled={isLoading}
        autoComplete="new-password"
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full mt-3"
      >
        Create SpareFlow Account
      </Button>
    </form>
  );
};

export default RegisterForm;

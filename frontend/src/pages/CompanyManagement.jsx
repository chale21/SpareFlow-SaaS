import React, { useRef, useState } from 'react';
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiHash,
  FiEdit2,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSettings,
  FiDollarSign,
  FiClock,
  FiFileText,
  FiBell,
  FiSave,
  FiRotateCcw,
  FiChevronDown,
} from 'react-icons/fi';

const CompanyManagement = () => {
  // ============================================================
  // TEMPORARY COMPANY DATA
  // ============================================================

  const [company, setCompany] = useState({
    id: '68a1f2e4c9b8a1234567890a',
    companyName: 'Apex Auto Spare Parts',
    email: 'info@apexspares.com',
    phone: '+251 9XX XXX XXX',
    address: 'Bahir Dar, Ethiopia',

    // Mock logo data
    logo: null,

    subscriptionPlan: 'Basic',
    status: 'Active',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-20',

    owner: {
      name: 'John Doe',
      email: 'john.doe@apexspares.com',
      role: 'SHOP OWNER',

      // Owner profile image
      avatar: null,
    },
  });

  // ============================================================
  // MOCK LOGO UPLOAD
  // ============================================================

  const logoInputRef = useRef(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification(
        'error',
        'Please select a valid image file.'
      );

      event.target.value = '';
      return;
    }

    // Check file size - maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        'error',
        'Logo image must be smaller than 5 MB.'
      );

      event.target.value = '';
      return;
    }

    // Mock upload using local object URL
    const logoUrl = URL.createObjectURL(file);

    setCompany((previous) => ({
      ...previous,
      logo: logoUrl,
      updatedAt: new Date()
        .toISOString()
        .split('T')[0],
    }));

    showNotification(
      'success',
      'Company logo uploaded successfully.'
    );

    // Allow selecting the same file again
    event.target.value = '';
  };

  const handleLogoButtonClick = () => {
    logoInputRef.current?.click();
  };

  // ============================================================
  // COMPANY OWNER IMAGE UPLOAD
  // ============================================================

  const handleOwnerImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      showNotification(
        'error',
        'Please select a valid owner image.'
      );

      event.target.value = '';
      return;
    }

    // Check file size - maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        'error',
        'Owner image must be smaller than 5 MB.'
      );

      event.target.value = '';
      return;
    }

    // Mock upload using local object URL
    const avatarUrl = URL.createObjectURL(file);

    setCompany((previous) => ({
      ...previous,

      owner: {
        ...previous.owner,
        avatar: avatarUrl,
      },

      updatedAt: new Date()
        .toISOString()
        .split('T')[0],
    }));

    showNotification(
      'success',
      'Owner image uploaded successfully.'
    );

    // Allow selecting the same file again
    event.target.value = '';
  };

  // ============================================================
  // BUSINESS SETTINGS
  // ============================================================

  const [settings, setSettings] = useState({
    currency: 'ETB',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'DD/MM/YYYY',
    lowStockThreshold: 5,
    invoicePrefix: 'INV',
    taxRate: 15,
    lowStockNotifications: true,
    emailNotifications: true,
  });

  const [settingsForm, setSettingsForm] = useState(settings);

  // ============================================================
  // UI STATE
  // ============================================================

  const [activeTab, setActiveTab] = useState('overview');

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [isSavingSettings, setIsSavingSettings] =
    useState(false);

  const [notification, setNotification] =
    useState(null);

  const [errors, setErrors] = useState({});

  const [settingsErrors, setSettingsErrors] =
    useState({});

  const [formData, setFormData] = useState({
    companyName: company.companyName,
    email: company.email,
    phone: company.phone,
    address: company.address,
  });

  // ============================================================
  // HELPERS
  // ============================================================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getStatusClasses = (status) => {
    if (status === 'Active') {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    if (status === 'Suspended') {
      return 'border-red-200 bg-red-50 text-red-700';
    }

    return 'border-slate-200 bg-slate-50 text-slate-600';
  };

  // ============================================================
  // COMPANY EDIT
  // ============================================================

  const handleOpenEdit = () => {
    setFormData({
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      address: company.address,
    });

    setErrors({});
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    if (isSaving) return;

    setIsEditModalOpen(false);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const validateCompanyForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName =
        'Company name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email =
        'Business email is required.';
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      newErrors.email =
        'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        'Phone number is required.';
    }

    if (!formData.address.trim()) {
      newErrors.address =
        'Business address is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateCompanyForm()) return;

    setIsSaving(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    setCompany((previous) => ({
      ...previous,
      companyName: formData.companyName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      updatedAt: new Date()
        .toISOString()
        .split('T')[0],
    }));

    setIsSaving(false);
    setIsEditModalOpen(false);

    showNotification(
      'success',
      'Company information updated successfully.'
    );
  };

  // ============================================================
  // SETTINGS
  // ============================================================

  const handleSettingsChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setSettingsForm((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox' ? checked : value,
    }));

    if (settingsErrors[name]) {
      setSettingsErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const validateSettings = () => {
    const newErrors = {};

    const threshold = Number(
      settingsForm.lowStockThreshold
    );

    const taxRate = Number(settingsForm.taxRate);

    if (!settingsForm.currency) {
      newErrors.currency =
        'Currency is required.';
    }

    if (!settingsForm.timezone) {
      newErrors.timezone =
        'Time zone is required.';
    }

    if (!settingsForm.dateFormat) {
      newErrors.dateFormat =
        'Date format is required.';
    }

    if (
      Number.isNaN(threshold) ||
      threshold < 0
    ) {
      newErrors.lowStockThreshold =
        'Threshold must be 0 or greater.';
    }

    if (
      !settingsForm.invoicePrefix.trim()
    ) {
      newErrors.invoicePrefix =
        'Invoice prefix is required.';
    }

    if (
      Number.isNaN(taxRate) ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      newErrors.taxRate =
        'Tax rate must be between 0 and 100.';
    }

    setSettingsErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSettings = async (event) => {
    event.preventDefault();

    if (!validateSettings()) return;

    setIsSavingSettings(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    const updatedSettings = {
      ...settingsForm,
      lowStockThreshold: Number(
        settingsForm.lowStockThreshold
      ),
      taxRate: Number(settingsForm.taxRate),
      invoicePrefix:
        settingsForm.invoicePrefix
          .trim()
          .toUpperCase(),
    };

    setSettings(updatedSettings);
    setSettingsForm(updatedSettings);

    setIsSavingSettings(false);

    showNotification(
      'success',
      'Business settings saved successfully.'
    );
  };

  const handleResetSettings = () => {
    setSettingsForm({
      ...settings,
    });

    setSettingsErrors({});

    showNotification(
      'success',
      'Settings restored.'
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full">

      {/* ======================================================
          NOTIFICATION
      ====================================================== */}

      {notification && (
        <div className="fixed right-4 top-4 z-[100]">
          <div
            className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
              notification.type === 'success'
                ? 'border-emerald-200 text-emerald-700'
                : 'border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <FiCheckCircle size={18} />
            ) : (
              <FiAlertCircle size={18} />
            )}

            <span className="text-sm font-medium">
              {notification.message}
            </span>

            <button
              onClick={() =>
                setNotification(null)
              }
              className="text-slate-400 hover:text-slate-700"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">

        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Company Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your company information and workspace preferences.
            </p>
          </div>

          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiEdit2 size={16} />
            Edit Company
          </button>

        </div>

        {/* ====================================================
            COMPANY HERO CARD
        ==================================================== */}

        <div className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Decorative Background */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-50/80 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-50/70 blur-3xl" />

            <div className="absolute right-10 top-10 h-20 w-20 rounded-full border border-blue-100" />
            <div className="absolute right-20 top-20 h-10 w-10 rounded-full border border-blue-100" />
          </div>

          {/* Hero Content */}

          <div className="relative px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

              {/* ========================================================
                  COMPANY LOGO
              ======================================================== */}

              <div className="relative shrink-0">

                <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 shadow-md sm:h-28 sm:w-28">

                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.companyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <FiBriefcase
                        size={34}
                        className="mx-auto text-blue-400"
                      />

                      <span className="mt-1 block text-[9px] font-bold tracking-wider text-white">
                        SPAREFLOW
                      </span>
                    </div>
                  )}

                </div>

                {/* ====================================================
                    HIDDEN LOGO FILE INPUT
                ==================================================== */}

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {/* ====================================================
                    UPLOAD LOGO BUTTON
                ==================================================== */}

                <button
                  type="button"
                  onClick={handleLogoButtonClick}
                  className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  title="Change company logo"
                >
                  <FiUpload size={14} />
                </button>

              </div>

              {/* ========================================================
                  COMPANY INFORMATION
              ======================================================== */}

              <div className="min-w-0 flex-1">

                {/* Company Name + Status */}

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    {company.companyName}
                  </h2>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                      company.status
                    )}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />

                    {company.status}
                  </span>

                </div>

                {/* Description */}

                <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                  Company Profile
                </p>

                {/* Company Details */}

                <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                  {/* Email */}

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <FiMail size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                        {company.email}
                      </p>

                    </div>

                  </div>

                  {/* Phone */}

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                      <FiPhone size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Phone
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                        {company.phone}
                      </p>

                    </div>

                  </div>

                  {/* Address */}

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:col-span-2 xl:col-span-1">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                      <FiMapPin size={18} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Address
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                        {company.address}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ========================================================
                  COMPANY OWNER — RIGHT SIDE OF HERO
              ======================================================== */}

              <div className="flex shrink-0 flex-col items-center border-t border-slate-200 pt-6 lg:w-44 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

                {/* Owner Label */}

                <div className="mb-4 flex items-center gap-2">

                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Company Owner
                  </p>

                </div>

                {/* Owner Avatar */}

                <div className="relative">

                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-lg ring-4 ring-white">

                    {company.owner.avatar ? (
                      <img
                        src={company.owner.avatar}
                        alt={company.owner.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(company.owner.name)
                    )}

                  </div>

                  {/* Online Status */}

                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />

                  {/* Upload Button */}

                  <label
                    htmlFor="owner-image-upload"
                    title="Change owner image"
                    className="absolute -bottom-1 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:scale-105 hover:bg-blue-700"
                  >
                    <FiUpload size={13} />

                    <input
                      id="owner-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleOwnerImageUpload}
                      className="hidden"
                    />
                  </label>

                </div>

                {/* Owner Name */}

                <h3 className="mt-4 max-w-full truncate text-center text-sm font-bold text-slate-900">
                  {company.owner.name}
                </h3>

                {/* Owner Role */}

                <span className="mt-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold tracking-wide text-blue-700">
                  {company.owner.role}
                </span>

                {/* Owner Email */}

                <p className="mt-2 max-w-full truncate text-center text-[11px] text-slate-400">
                  {company.owner.email}
                </p>

              </div>

            </div>

          </div>

          {/* Bottom Accent */}

          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />

        </div>

        {/* ====================================================
            TABS
        ==================================================== */}

        <div className="mt-6 border-b border-slate-200">

          <div className="flex gap-6 overflow-x-auto">

            <button
              onClick={() =>
                setActiveTab('overview')
              }
              className={`relative whitespace-nowrap pb-3 text-sm font-semibold transition ${
                activeTab === 'overview'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview

              {activeTab === 'overview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>

            <button
              onClick={() =>
                setActiveTab('settings')
              }
              className={`relative flex items-center gap-2 whitespace-nowrap pb-3 text-sm font-semibold transition ${
                activeTab === 'settings'
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiSettings size={15} />

              Business Settings

              {activeTab === 'settings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>

          </div>
        </div>

        {/* ====================================================
            OVERVIEW TAB
        ==================================================== */}

        {activeTab === 'overview' && (
          <div className="mt-7 space-y-6">

            {/* ==================================================
                INFORMATION CARDS
            ================================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

              {/* ==================================================
                  COMPANY INFORMATION
              ================================================== */}

              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">

                {/* Card Header */}

                <div className="relative overflow-hidden border-b border-slate-100 px-6 py-6">

                  <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-50 opacity-70 blur-2xl" />

                  <div className="relative flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <FiBriefcase size={21} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Company Information
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Your registered business information.
                      </p>
                    </div>

                  </div>

                </div>

                {/* Information */}

                <div className="p-3 sm:p-4">

                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">

                    <InfoRow
                      icon={<FiBriefcase size={17} />}
                      label="Company Name"
                      value={company.companyName}
                    />

                    <InfoRow
                      icon={<FiMail size={17} />}
                      label="Business Email"
                      value={company.email}
                    />

                    <InfoRow
                      icon={<FiPhone size={17} />}
                      label="Phone Number"
                      value={company.phone}
                    />

                    <InfoRow
                      icon={<FiMapPin size={17} />}
                      label="Business Address"
                      value={company.address}
                    />

                  </div>

                </div>

              </div>

              {/* ==================================================
                  WORKSPACE INFORMATION
              ================================================== */}

              <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">

                <div className="relative overflow-hidden border-b border-slate-100 px-6 py-6">

                  <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-indigo-50 opacity-70 blur-2xl" />

                  <div className="relative flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                      <FiSettings size={21} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Workspace Information
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Information about your SpareFlow workspace.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-3 sm:p-4">

                  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">

                    <InfoRow
                      icon={<FiHash size={17} />}
                      label="Company ID"
                      value={company.id}
                      breakValue
                    />

                    <InfoRow
                      icon={<FiBriefcase size={17} />}
                      label="Subscription"
                      value={
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {company.subscriptionPlan}
                        </span>
                      }
                    />

                    <InfoRow
                      icon={<FiCheckCircle size={17} />}
                      label="Status"
                      value={
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
                            company.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {company.status}
                        </span>
                      }
                    />

                    <InfoRow
                      icon={<FiCalendar size={17} />}
                      label="Created"
                      value={formatDate(company.createdAt)}
                    />

                    <InfoRow
                      icon={<FiCalendar size={17} />}
                      label="Last Updated"
                      value={formatDate(company.updatedAt)}
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                QUICK STATS
            ================================================== */}

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="h-5 w-1 rounded-full bg-blue-600" />

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Workspace Summary
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    A quick overview of your workspace.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                <QuickStat
                  label="Workspace Status"
                  value="Active"
                  description="Your workspace is operational"
                />

                <QuickStat
                  label="Subscription Plan"
                  value={company.subscriptionPlan}
                  description="Current workspace plan"
                />

                <QuickStat
                  label="Created"
                  value={formatDate(company.createdAt)}
                  description="Workspace registration date"
                />

              </div>

            </div>

          </div>
        )}

        {/* ====================================================
            BUSINESS SETTINGS TAB
        ==================================================== */}

        {activeTab === 'settings' && (
          <div className="mt-6">

            <form
              onSubmit={handleSaveSettings}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm"
            >

              <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiSettings size={20} />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Business Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Configure how SpareFlow works for your business.
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <SettingsSection
                  title="General"
                  description="Basic workspace preferences."
                >

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <SelectField
                      label="Currency"
                      name="currency"
                      value={settingsForm.currency}
                      onChange={handleSettingsChange}
                      icon={<FiDollarSign />}
                      error={settingsErrors.currency}
                      options={[
                        ['ETB', 'Ethiopian Birr (ETB)'],
                        ['USD', 'US Dollar (USD)'],
                        ['EUR', 'Euro (EUR)'],
                        ['GBP', 'British Pound (GBP)'],
                      ]}
                    />

                    <SelectField
                      label="Time Zone"
                      name="timezone"
                      value={settingsForm.timezone}
                      onChange={handleSettingsChange}
                      icon={<FiClock />}
                      error={settingsErrors.timezone}
                      options={[
                        [
                          'Africa/Addis_Ababa',
                          'East Africa Time — Addis Ababa',
                        ],
                        ['UTC', 'UTC'],
                        [
                          'Africa/Nairobi',
                          'East Africa Time — Nairobi',
                        ],
                      ]}
                    />

                    <SelectField
                      label="Date Format"
                      name="dateFormat"
                      value={settingsForm.dateFormat}
                      onChange={handleSettingsChange}
                      icon={<FiCalendar />}
                      error={settingsErrors.dateFormat}
                      options={[
                        ['DD/MM/YYYY', 'DD/MM/YYYY'],
                        ['MM/DD/YYYY', 'MM/DD/YYYY'],
                        ['YYYY-MM-DD', 'YYYY-MM-DD'],
                      ]}
                    />

                    <NumberField
                      label="Low Stock Threshold"
                      name="lowStockThreshold"
                      value={settingsForm.lowStockThreshold}
                      onChange={handleSettingsChange}
                      error={settingsErrors.lowStockThreshold}
                      description="Products at or below this quantity are considered low stock."
                    />

                  </div>

                </SettingsSection>

                <SettingsSection
                  title="Sales & Invoices"
                  description="Configure your sales and invoice defaults."
                >

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <InputField
                      label="Invoice Prefix"
                      name="invoicePrefix"
                      value={settingsForm.invoicePrefix}
                      onChange={handleSettingsChange}
                      icon={<FiFileText />}
                      error={settingsErrors.invoicePrefix}
                      placeholder="INV"
                    />

                    <NumberField
                      label="Default Tax Rate"
                      name="taxRate"
                      value={settingsForm.taxRate}
                      onChange={handleSettingsChange}
                      error={settingsErrors.taxRate}
                      suffix="%"
                      description="Used as the default tax rate for applicable transactions."
                    />

                  </div>

                </SettingsSection>

                <SettingsSection
                  title="Notifications"
                  description="Choose which business notifications you want to receive."
                >

                  <div className="space-y-3">

                    <Toggle
                      name="lowStockNotifications"
                      checked={
                        settingsForm.lowStockNotifications
                      }
                      onChange={handleSettingsChange}
                      icon={<FiBell />}
                      title="Low Stock Notifications"
                      description="Receive notifications when products reach the low-stock threshold."
                    />

                    <Toggle
                      name="emailNotifications"
                      checked={
                        settingsForm.emailNotifications
                      }
                      onChange={handleSettingsChange}
                      icon={<FiMail />}
                      title="Email Notifications"
                      description="Allow SpareFlow to send important business notifications by email."
                    />

                  </div>

                </SettingsSection>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={handleResetSettings}
                    disabled={isSavingSettings}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FiRotateCcw size={16} />
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isSavingSettings ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Save Settings
                      </>
                    )}
                  </button>

                </div>

              </div>

            </form>

          </div>
        )}

      </div>

      {/* ======================================================
          EDIT COMPANY MODAL
      ====================================================== */}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="font-bold text-slate-900">
                  Edit Company
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your company information.
                </p>
              </div>

              <button
                onClick={handleCloseEdit}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >

              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                error={errors.companyName}
                required
              />

              <InputField
                label="Business Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                {errors.address && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <FiAlertCircle />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}

                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

const InfoRow = ({
  icon,
  label,
  value,
  breakValue = false,
}) => (
  <div className="group flex flex-col gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-5">

    <div className="flex min-w-0 items-center gap-3">

      {icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-100 transition-colors group-hover:text-blue-600">
          {icon}
        </div>
      )}

      <span className="text-sm font-medium text-slate-500">
        {label}
      </span>

    </div>

    <div
      className={`text-sm font-semibold text-slate-900 sm:max-w-[60%] sm:text-right ${
        breakValue ? 'break-all' : ''
      }`}
    >
      {value}
    </div>

  </div>
);

const QuickStat = ({
  label,
  value,
  description,
}) => (
  <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-70 blur-2xl transition-transform duration-500 group-hover:scale-150" />

    <div className="relative flex items-center justify-between">

      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>

      <div className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />

    </div>

    <p className="relative mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
      {value}
    </p>

    <p className="relative mt-2 text-xs leading-5 text-slate-500">
      {description}
    </p>

    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  </div>
);

const SettingsSection = ({
  title,
  description,
  children,
}) => (
  <section className="border-b border-slate-100 py-7 first:pt-0 last:border-0">

    <div className="mb-5">
      <h3 className="text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>

    {children}

  </section>
);

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon,
  required = false,
}) => (
  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">

      {label}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}

    </label>

    <div className="relative">

      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border py-3 text-sm outline-none transition ${
          icon ? 'pl-10 pr-4' : 'px-4'
        } ${
          error
            ? 'border-red-400'
            : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        }`}
      />

    </div>

    {error && (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
        <FiAlertCircle size={13} />
        {error}
      </p>
    )}

  </div>
);

const NumberField = ({
  label,
  name,
  value,
  onChange,
  error,
  suffix,
  description,
}) => (
  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">

      <input
        name={name}
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {suffix}
        </span>
      )}

    </div>

    {description && (
      <p className="mt-1.5 text-xs text-slate-400">
        {description}
      </p>
    )}

    {error && (
      <p className="mt-1.5 text-xs text-red-600">
        {error}
      </p>
    )}

  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  icon,
  options,
  error,
}) => (
  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">

      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {optionLabel}
          </option>
        ))}
      </select>

      <FiChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

    </div>

    {error && (
      <p className="mt-1.5 text-xs text-red-600">
        {error}
      </p>
    )}

  </div>
);

const Toggle = ({
  name,
  checked,
  onChange,
  icon,
  title,
  description,
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">

    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

    </div>

    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />

  </label>
);

export default CompanyManagement;
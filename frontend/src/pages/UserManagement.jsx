import React, { useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiEdit2,
  FiEye,
  FiFilter,
  FiMail,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUser,
  FiUserCheck,
  FiUserMinus,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const UserManagement = () => {
  // ============================================================
  // MOCK COMPANY
  // ============================================================

  const company = {
    id: '68a1f2e4c9b8a1234567890a',
    name: 'Apex Auto Spare Parts',
  };

  // ============================================================
  // MOCK USER DATA
  //
  // The SRS Users collection contains:
  // _id, companyId, fullName, email, password, role,
  // phone, status, createdAt
  //
  // Password is intentionally NOT represented in UI data.
  // ============================================================

  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      companyId: company.id,
      fullName: 'John Doe',
      email: 'john.doe@apexspares.com',
      role: 'Shop Owner',
      phone: '+251 911 234 567',
      status: 'Active',
      createdAt: '2026-08-01',
      lastActivity: '2026-08-22T09:42:00',
    },
    {
      id: 'USR-002',
      companyId: company.id,
      fullName: 'Abebe Kebede',
      email: 'abebe.kebede@apexspares.com',
      role: 'Staff',
      phone: '+251 922 456 789',
      status: 'Active',
      createdAt: '2026-08-04',
      lastActivity: '2026-08-22T08:25:00',
    },
    {
      id: 'USR-003',
      companyId: company.id,
      fullName: 'Hana Worku',
      email: 'hana.worku@apexspares.com',
      role: 'Staff',
      phone: '+251 933 567 890',
      status: 'Active',
      createdAt: '2026-08-07',
      lastActivity: '2026-08-21T16:40:00',
    },
    {
      id: 'USR-004',
      companyId: company.id,
      fullName: 'Dawit Alemu',
      email: 'dawit.alemu@apexspares.com',
      role: 'Staff',
      phone: '+251 944 678 901',
      status: 'Inactive',
      createdAt: '2026-08-09',
      lastActivity: '2026-08-18T11:20:00',
    },
    {
      id: 'USR-005',
      companyId: company.id,
      fullName: 'Meron Tesfaye',
      email: 'meron.tesfaye@apexspares.com',
      role: 'Staff',
      phone: '+251 955 789 012',
      status: 'Active',
      createdAt: '2026-08-11',
      lastActivity: '2026-08-22T07:58:00',
    },
    {
      id: 'USR-006',
      companyId: company.id,
      fullName: 'Samuel Bekele',
      email: 'samuel.bekele@apexspares.com',
      role: 'Staff',
      phone: '+251 966 890 123',
      status: 'Active',
      createdAt: '2026-08-12',
      lastActivity: '2026-08-21T14:15:00',
    },
    {
      id: 'USR-007',
      companyId: company.id,
      fullName: 'Rahel Girma',
      email: 'rahel.girma@apexspares.com',
      role: 'Staff',
      phone: '+251 977 901 234',
      status: 'Active',
      createdAt: '2026-08-15',
      lastActivity: '2026-08-22T08:11:00',
    },
    {
      id: 'USR-008',
      companyId: company.id,
      fullName: 'Mekonnen Tadesse',
      email: 'mekonnen.tadesse@apexspares.com',
      role: 'Staff',
      phone: '+251 988 012 345',
      status: 'Active',
      createdAt: '2026-08-18',
      lastActivity: '2026-08-20T17:05:00',
    },
  ]);

  // ============================================================
  // UI STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState('');

  const [roleFilter, setRoleFilter] = useState('All');

  const [statusFilter, setStatusFilter] = useState('All');

  const [activeMenu, setActiveMenu] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const [modalType, setModalType] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notification, setNotification] = useState(null);

  const [formErrors, setFormErrors] = useState({});

  // ============================================================
  // FORM STATE
  // ============================================================

  const emptyForm = {
    fullName: '',
    email: '',
    role: 'Staff',
    phone: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
    });

    window.clearTimeout(showNotification.timeout);

    showNotification.timeout = window.setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getInitials = (name = '') => {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastActivity = (date) => {
    if (!date) return 'No recent activity';

    const activityDate = new Date(date);

    return activityDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRoleClasses = (role) => {
    switch (role) {
      case 'Shop Owner':
        return 'border-violet-200 bg-violet-50 text-violet-700';

      case 'Super Admin':
        return 'border-amber-200 bg-amber-50 text-amber-700';

      case 'Staff':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  };

  const getStatusClasses = (status) => {
    if (status === 'Active') {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    return 'border-slate-200 bg-slate-100 text-slate-500';
  };

  // ============================================================
  // SUMMARY STATISTICS
  // ============================================================

  const statistics = useMemo(() => {
    const total = users.length;

    const active = users.filter(
      (user) => user.status === 'Active'
    ).length;

    const inactive = users.filter(
      (user) => user.status === 'Inactive'
    ).length;

    const staff = users.filter(
      (user) => user.role === 'Staff'
    ).length;

    return {
      total,
      active,
      inactive,
      staff,
    };
  }, [users]);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.fullName
          .toLowerCase()
          .includes(normalizedSearch) ||
        user.email
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesRole =
        roleFilter === 'All' ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  // ============================================================
  // FORM
  // ============================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName =
        'Employee name is required.';
    }

    if (!formData.email.trim()) {
      errors.email =
        'Email address is required.';
    } else if (
      !/^\S+@\S+\.\S+$/.test(
        formData.email.trim()
      )
    ) {
      errors.email =
        'Please enter a valid email address.';
    }

    if (!formData.role) {
      errors.role = 'Role is required.';
    }

    // SRS requires duplicate email handling.
    const duplicateEmail = users.some((user) => {
      const isSameUser =
        modalType === 'edit' &&
        selectedUser &&
        user.id === selectedUser.id;

      return (
        !isSameUser &&
        user.email.toLowerCase() ===
          formData.email.trim().toLowerCase()
      );
    });

    if (duplicateEmail) {
      errors.email =
        'This email address is already registered.';
    }

    // SRS requires valid role handling.
    const validRoles = [
      'Staff',
    ];

    if (!validRoles.includes(formData.role)) {
      errors.role =
        'Please select a valid employee role.';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // ============================================================
  // OPEN ADD MODAL
  // ============================================================

  const handleAddUser = () => {
    setActiveMenu(null);
    setSelectedUser(null);
    setFormData({
      ...emptyForm,
    });
    setFormErrors({});
    setModalType('add');
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const handleEditUser = (user) => {
    setActiveMenu(null);

    setSelectedUser(user);

    setFormData({
      fullName: user.fullName,
      email: user.email,
      role:
        user.role === 'Staff'
          ? 'Staff'
          : 'Staff',
      phone: user.phone || '',
    });

    setFormErrors({});
    setModalType('edit');
  };

  // ============================================================
  // VIEW USER
  // ============================================================

  const handleViewUser = (user) => {
    setActiveMenu(null);
    setSelectedUser(user);
    setModalType('view');
  };

  // ============================================================
  // SUBMIT ADD / EDIT
  // ============================================================

  const handleSubmitUser = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    if (modalType === 'add') {
      const newUser = {
        id: `USR-${String(
          users.length + 1
        ).padStart(3, '0')}`,
        companyId: company.id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        phone: formData.phone.trim(),
        status: 'Active',
        createdAt:
          new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString(),
      };

      setUsers((previous) => [
        newUser,
        ...previous,
      ]);

      showNotification(
        'success',
        'Staff member added successfully.'
      );
    }

    if (modalType === 'edit') {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                fullName:
                  formData.fullName.trim(),
                email:
                  formData.email.trim(),
                role: formData.role,
                phone:
                  formData.phone.trim(),
              }
            : user
        )
      );

      showNotification(
        'success',
        'Employee information updated successfully.'
      );
    }

    setIsSubmitting(false);
    closeModal();
  };

  // ============================================================
  // ACTIVATE / DEACTIVATE
  // ============================================================

  const openStatusConfirmation = (user) => {
    setActiveMenu(null);
    setSelectedUser(user);
    setModalType(
      user.status === 'Active'
        ? 'deactivate'
        : 'activate'
    );
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    const nextStatus =
      selectedUser.status === 'Active'
        ? 'Inactive'
        : 'Active';

    setUsers((previous) =>
      previous.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              status: nextStatus,
            }
          : user
      )
    );

    showNotification(
      'success',
      nextStatus === 'Active'
        ? `${selectedUser.fullName} has been activated.`
        : `${selectedUser.fullName} has been deactivated.`
    );

    setIsSubmitting(false);
    closeModal();
  };

  // ============================================================
  // REMOVE USER
  // ============================================================

  const openRemoveConfirmation = (user) => {
    setActiveMenu(null);
    setSelectedUser(user);
    setModalType('remove');
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    setUsers((previous) =>
      previous.filter(
        (user) => user.id !== selectedUser.id
      )
    );

    showNotification(
      'success',
      `${selectedUser.fullName} was removed from staff.`
    );

    setIsSubmitting(false);
    closeModal();
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (isSubmitting) return;

    setModalType(null);
    setSelectedUser(null);
    setFormErrors({});
    setFormData({
      ...emptyForm,
    });
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('All');
    setStatusFilter('All');
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="min-h-full bg-slate-50/30"
      onClick={() => setActiveMenu(null)}
    >
      {/* ========================================================
          NOTIFICATION
      ======================================================== */}

      {notification && (
        <div className="fixed right-4 top-4 z-[120]">
          <div
            className={`flex max-w-sm items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-2xl ${
              notification.type === 'success'
                ? 'border-emerald-200'
                : 'border-red-200'
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {notification.type ===
              'success' ? (
                <FiCheckCircle size={18} />
              ) : (
                <FiAlertCircle size={18} />
              )}
            </div>

            <p
              className={`flex-1 text-sm font-semibold ${
                notification.type === 'success'
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              {notification.message}
            </p>

            <button
              type="button"
              onClick={() =>
                setNotification(null)
              }
              className="text-slate-400 transition hover:text-slate-700"
            >
              <FiX size={17} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-1 pb-10">
        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
           
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              User Management
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your company's staff accounts,
              roles, and access status from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddUser}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 hover:shadow-md"
          >
            <FiPlus size={17} />
            Add Staff
          </button>
        </div>

        {/* ======================================================
            COMPANY CONTEXT
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
              <FiBriefcase size={18} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-500">
                Current Workspace
              </p>

              <p className="mt-0.5 text-sm font-bold text-slate-800">
                {company.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Staff access management
          </div>
        </div>

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<FiUsers size={19} />}
            label="Total Users"
            value={statistics.total}
            description="All company accounts"
            iconStyle="blue"
          />

          <StatCard
            icon={<FiUserCheck size={19} />}
            label="Active Users"
            value={statistics.active}
            description="Currently able to log in"
            iconStyle="emerald"
          />

          <StatCard
            icon={<FiUserMinus size={19} />}
            label="Inactive Users"
            value={statistics.inactive}
            description="Access currently disabled"
            iconStyle="slate"
          />

          <StatCard
            icon={<FiShield size={19} />}
            label="Staff Members"
            value={statistics.staff}
            description="Operational employees"
            iconStyle="violet"
          />
        </div>

        {/* ======================================================
            MAIN USER MANAGEMENT AREA
        ====================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* ====================================================
              TABLE HEADER
          ==================================================== */}

          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Team Members
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Add, edit, activate, deactivate, or
                  remove employees.
                </p>
              </div>

              {/* ==================================================
                  FILTERS
              ================================================== */}

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}

                <div className="relative sm:min-w-[260px]">
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(
                        event.target.value
                      )
                    }
                    placeholder="Search name or email..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                {/* Role Filter */}

                <FilterSelect
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    ['All', 'All Roles'],
                    ['Staff', 'Staff'],
                    [
                      'Shop Owner',
                      'Shop Owner',
                    ],
                  ]}
                />

                {/* Status Filter */}

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    ['All', 'All Status'],
                    ['Active', 'Active'],
                    ['Inactive', 'Inactive'],
                  ]}
                />
              </div>
            </div>

            {/* Active filters */}

            {(searchTerm ||
              roleFilter !== 'All' ||
              statusFilter !== 'All') && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <FiFilter size={13} />
                  Filters:
                </div>

                {searchTerm && (
                  <FilterBadge
                    text={`Search: ${searchTerm}`}
                    onRemove={() =>
                      setSearchTerm('')
                    }
                  />
                )}

                {roleFilter !== 'All' && (
                  <FilterBadge
                    text={`Role: ${roleFilter}`}
                    onRemove={() =>
                      setRoleFilter('All')
                    }
                  />
                )}

                {statusFilter !== 'All' && (
                  <FilterBadge
                    text={`Status: ${statusFilter}`}
                    onRemove={() =>
                      setStatusFilter('All')
                    }
                  />
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* ====================================================
              DESKTOP TABLE
          ==================================================== */}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <TableHeader>
                    Employee
                  </TableHeader>

                  <TableHeader>
                    Email
                  </TableHeader>

                  <TableHeader>
                    Role
                  </TableHeader>

                  <TableHeader>
                    Status
                  </TableHeader>

                  <TableHeader>
                    Created
                  </TableHeader>

                  <TableHeader align="right">
                    Actions
                  </TableHeader>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                    onStatus={
                      openStatusConfirmation
                    }
                    onRemove={
                      openRemoveConfirmation
                    }
                    getInitials={getInitials}
                    getRoleClasses={
                      getRoleClasses
                    }
                    getStatusClasses={
                      getStatusClasses
                    }
                    formatDate={formatDate}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* ====================================================
              MOBILE / TABLET LIST
          ==================================================== */}

          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredUsers.map((user) => (
              <MobileUserRow
                key={user.id}
                user={user}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                onView={handleViewUser}
                onEdit={handleEditUser}
                onStatus={
                  openStatusConfirmation
                }
                onRemove={
                  openRemoveConfirmation
                }
                getInitials={getInitials}
                getRoleClasses={getRoleClasses}
                getStatusClasses={
                  getStatusClasses
                }
                formatDate={formatDate}
              />
            ))}
          </div>

          {/* ====================================================
              EMPTY STATE
          ==================================================== */}

          {filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FiSearch size={24} />
              </div>

              <h3 className="mt-5 text-sm font-bold text-slate-900">
                No users found
              </h3>

              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-500">
                No employee accounts match your
                current search and filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <FiRefreshCw size={14} />
                Reset Filters
              </button>
            </div>
          )}

          {/* ====================================================
              TABLE FOOTER
          ==================================================== */}

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs font-medium text-slate-500">
              Showing{' '}
              <span className="font-bold text-slate-700">
                {filteredUsers.length}
              </span>{' '}
              of{' '}
              <span className="font-bold text-slate-700">
                {users.length}
              </span>{' '}
              users
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FiShield size={13} />
              Role-based access enabled
            </div>
          </div>
        </div>

        {/* ======================================================
            ROLES & ACCESS
        ====================================================== */}

        <div className="mt-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-blue-600" />

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Roles & Access
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Access is controlled by the user's
                assigned role.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <RoleCard
              icon={<FiShield size={20} />}
              title="Shop Owner"
              description="Full company-level operational management."
              roleClass="violet"
              permissions={[
                'Manage staff accounts',
                'Manage inventory',
                'Manage categories',
                'Manage suppliers',
                'Manage purchases',
                'Manage sales',
                'View business reports',
                'Configure company settings',
              ]}
            />

            <RoleCard
              icon={<FiUser size={20} />}
              title="Staff"
              description="Daily operational access based on assigned permissions."
              roleClass="blue"
              permissions={[
                'Record purchases',
                'Manage inventory',
                'Manage stock movements',
                'Process sales',
                'View inventory',
                'Update supplier records',
              ]}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {(modalType === 'add' ||
        modalType === 'edit') && (
        <ModalOverlay onClose={closeModal}>
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Header */}

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    {modalType === 'add' ? (
                      <FiUser size={20} />
                    ) : (
                      <FiEdit2 size={19} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {modalType === 'add'
                        ? 'Add Staff Member'
                        : 'Edit Staff Member'}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {modalType === 'add'
                        ? 'Create a new employee account for this company.'
                        : 'Update employee account information.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX size={19} />
                </button>
              </div>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmitUser}
              className="space-y-5 px-6 py-6"
            >
              <InputField
                label="Employee Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="Enter employee name"
                error={formErrors.fullName}
                required
                icon={<FiUser size={16} />}
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="employee@company.com"
                error={formErrors.email}
                required
                icon={<FiMail size={16} />}
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="+251 9XX XXX XXX"
                icon={<FiBriefcase size={16} />}
              />

              {/* Role */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <FiShield
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className={`w-full appearance-none rounded-xl border bg-white py-3 pl-10 pr-10 text-sm outline-none transition ${
                      formErrors.role
                        ? 'border-red-400'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                    }`}
                  >
                    <option value="Staff">
                      Staff
                    </option>
                  </select>

                  <FiChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                {formErrors.role && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                    <FiAlertCircle size={13} />
                    {formErrors.role}
                  </p>
                )}

                <div className="mt-2 flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                  <FiShield
                    size={14}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />

                  <p className="text-[11px] leading-5 text-blue-700">
                    Staff accounts receive operational
                    permissions defined by SpareFlow's
                    role-based access control.
                  </p>
                </div>
              </div>

              {/* Actions */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck size={16} />
                      {modalType === 'add'
                        ? 'Create Staff'
                        : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}

      {/* ========================================================
          VIEW USER MODAL
      ======================================================== */}

      {modalType === 'view' &&
        selectedUser && (
          <ModalOverlay onClose={closeModal}>
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
              {/* Header */}

              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 px-6 pb-7 pt-6 text-white">
                <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full border border-white/10" />

                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-4 top-4 rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <FiX size={19} />
                </button>

                <div className="relative flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-white/15 text-xl font-extrabold shadow-lg backdrop-blur">
                    {getInitials(
                      selectedUser.fullName
                    )}
                  </div>

                  <h2 className="mt-4 text-xl font-extrabold">
                    {selectedUser.fullName}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    {selectedUser.email}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                      {selectedUser.role}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          selectedUser.status ===
                          'Active'
                            ? 'bg-emerald-300'
                            : 'bg-slate-300'
                        }`}
                      />

                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}

              <div className="space-y-1 px-6 py-6">
                <DetailItem
                  icon={<FiMail size={16} />}
                  label="Email Address"
                  value={selectedUser.email}
                />

                <DetailItem
                  icon={<FiBriefcase size={16} />}
                  label="Company"
                  value={company.name}
                />

                <DetailItem
                  icon={<FiShield size={16} />}
                  label="Role"
                  value={selectedUser.role}
                />

                <DetailItem
                  icon={<FiClock size={16} />}
                  label="Created"
                  value={formatDate(
                    selectedUser.createdAt
                  )}
                />

                <DetailItem
                  icon={<FiClock size={16} />}
                  label="Last Activity"
                  value={formatLastActivity(
                    selectedUser.lastActivity
                  )}
                />

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FiShield size={16} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Access Control
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500">
                        This account can access only the
                        features permitted by its assigned
                        role.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}

                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditUser(
                        selectedUser
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openStatusConfirmation(
                        selectedUser
                      )
                    }
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      selectedUser.status ===
                      'Active'
                        ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedUser.status ===
                    'Active' ? (
                      <FiUserMinus size={14} />
                    ) : (
                      <FiUserCheck size={14} />
                    )}

                    {selectedUser.status ===
                    'Active'
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          </ModalOverlay>
        )}

      {/* ========================================================
          ACTIVATE / DEACTIVATE CONFIRMATION
      ======================================================== */}

      {(modalType === 'activate' ||
        modalType === 'deactivate') &&
        selectedUser && (
          <ModalOverlay onClose={closeModal}>
            <ConfirmationModal
              type={
                modalType === 'activate'
                  ? 'activate'
                  : 'deactivate'
              }
              user={selectedUser}
              isSubmitting={isSubmitting}
              onCancel={closeModal}
              onConfirm={handleStatusChange}
            />
          </ModalOverlay>
        )}

      {/* ========================================================
          REMOVE CONFIRMATION
      ======================================================== */}

      {modalType === 'remove' &&
        selectedUser && (
          <ModalOverlay onClose={closeModal}>
            <ConfirmationModal
              type="remove"
              user={selectedUser}
              isSubmitting={isSubmitting}
              onCancel={closeModal}
              onConfirm={handleRemoveUser}
            />
          </ModalOverlay>
        )}
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  icon,
  label,
  value,
  description,
  iconStyle,
}) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    emerald:
      'bg-emerald-50 text-emerald-600 ring-emerald-100',
    slate:
      'bg-slate-100 text-slate-500 ring-slate-200',
    violet:
      'bg-violet-50 text-violet-600 ring-violet-100',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${styles[iconStyle]}`}
        >
          {icon}
        </div>

        <div className="h-2 w-2 rounded-full bg-slate-200 transition group-hover:bg-blue-500" />
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-500 opacity-0 transition group-hover:opacity-100" />
    </div>
  );
};

// ============================================================
// TABLE HEADER
// ============================================================

const TableHeader = ({
  children,
  align = 'left',
}) => (
  <th
    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 ${
      align === 'right'
        ? 'text-right'
        : 'text-left'
    }`}
  >
    {children}
  </th>
);

// ============================================================
// USER TABLE ROW
// ============================================================

const UserTableRow = ({
  user,
  activeMenu,
  setActiveMenu,
  onView,
  onEdit,
  onStatus,
  onRemove,
  getInitials,
  getRoleClasses,
  getStatusClasses,
  formatDate,
}) => {
  const isOwner = user.role === 'Shop Owner';

  return (
    <tr className="group border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
      {/* Employee */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-extrabold text-white shadow-sm ring-4 ring-blue-50">
            {getInitials(user.fullName)}

            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                user.status === 'Active'
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              }`}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">
              {user.fullName}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {user.id}
            </p>
          </div>
        </div>
      </td>

      {/* Email */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FiMail
            size={14}
            className="shrink-0 text-slate-400"
          />

          <span className="max-w-[230px] truncate">
            {user.email}
          </span>
        </div>
      </td>

      {/* Role */}

      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getRoleClasses(
            user.role
          )}`}
        >
          {user.role === 'Shop Owner' ? (
            <FiShield size={11} />
          ) : (
            <FiUser size={11} />
          )}

          {user.role}
        </span>
      </td>

      {/* Status */}

      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
            user.status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              user.status === 'Active'
                ? 'bg-emerald-500'
                : 'bg-slate-400'
            }`}
          />

          {user.status}
        </span>
      </td>

      {/* Created */}

      <td className="px-5 py-4 text-xs font-medium text-slate-500">
        {formatDate(user.createdAt)}
      </td>

      {/* Actions */}

      <td className="relative px-5 py-4 text-right">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              setActiveMenu(
                activeMenu === user.id
                  ? null
                  : user.id
              );
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiMoreVertical size={17} />
          </button>

          {activeMenu === user.id && (
            <ActionMenu
              user={user}
              isOwner={isOwner}
              onView={onView}
              onEdit={onEdit}
              onStatus={onStatus}
              onRemove={onRemove}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

// ============================================================
// MOBILE USER ROW
// ============================================================

const MobileUserRow = ({
  user,
  activeMenu,
  setActiveMenu,
  onView,
  onEdit,
  onStatus,
  onRemove,
  getInitials,
  getRoleClasses,
  getStatusClasses,
  formatDate,
}) => {
  return (
    <div className="relative p-5">
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-extrabold text-white shadow-sm ring-4 ring-blue-50">
          {getInitials(user.fullName)}

          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              user.status === 'Active'
                ? 'bg-emerald-500'
                : 'bg-slate-300'
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">
                {user.fullName}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();

                  setActiveMenu(
                    activeMenu === user.id
                      ? null
                      : user.id
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <FiMoreVertical size={16} />
              </button>

              {activeMenu === user.id && (
                <ActionMenu
                  user={user}
                  isOwner={
                    user.role === 'Shop Owner'
                  }
                  onView={onView}
                  onEdit={onEdit}
                  onStatus={onStatus}
                  onRemove={onRemove}
                />
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${getRoleClasses(
                user.role
              )}`}
            >
              {user.role}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
                user.status
              )}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user.status === 'Active'
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
                }`}
              />

              {user.status}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <FiClock size={12} />
            Created {formatDate(user.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ACTION MENU
// ============================================================

const ActionMenu = ({
  user,
  isOwner,
  onView,
  onEdit,
  onStatus,
  onRemove,
}) => {
  return (
    <div
      onClick={(event) =>
        event.stopPropagation()
      }
      className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl"
    >
      <button
        type="button"
        onClick={() => onView(user)}
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        <FiEye
          size={15}
          className="text-slate-400"
        />
        View Details
      </button>

      {/* The Shop Owner account should not be edited
          from staff management. The SRS says the Shop
          Owner manages employee accounts. */}

      {!isOwner && (
        <>
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FiEdit2
              size={15}
              className="text-slate-400"
            />
            Edit Staff
          </button>

          <button
            type="button"
            onClick={() => onStatus(user)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition hover:bg-slate-50 ${
              user.status === 'Active'
                ? 'text-amber-700'
                : 'text-emerald-700'
            }`}
          >
            {user.status === 'Active' ? (
              <FiUserMinus size={15} />
            ) : (
              <FiUserCheck size={15} />
            )}

            {user.status === 'Active'
              ? 'Deactivate'
              : 'Activate'}
          </button>

          <div className="my-1 border-t border-slate-100" />

          <button
            type="button"
            onClick={() => onRemove(user)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <FiTrash2 size={15} />
            Remove Staff
          </button>
        </>
      )}
    </div>
  );
};

// ============================================================
// FILTER SELECT
// ============================================================

const FilterSelect = ({
  value,
  onChange,
  options,
}) => (
  <div className="relative">
    <FiChevronDown
      size={15}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <select
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="h-full min-w-[130px] appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
    >
      {options.map(
        ([optionValue, optionLabel]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {optionLabel}
          </option>
        )
      )}
    </select>
  </div>
);

// ============================================================
// FILTER BADGE
// ============================================================

const FilterBadge = ({
  text,
  onRemove,
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
    {text}

    <button
      type="button"
      onClick={onRemove}
      className="text-blue-400 hover:text-blue-700"
    >
      <FiX size={12} />
    </button>
  </span>
);

// ============================================================
// ROLE CARD
// ============================================================

const RoleCard = ({
  icon,
  title,
  description,
  permissions,
  roleClass,
}) => {
  const styles = {
    blue: {
      wrapper:
        'border-blue-100 bg-blue-50/40',
      icon:
        'bg-blue-100 text-blue-600 ring-blue-200',
      bullet: 'bg-blue-500',
    },

    violet: {
      wrapper:
        'border-violet-100 bg-violet-50/40',
      icon:
        'bg-violet-100 text-violet-600 ring-violet-200',
      bullet: 'bg-violet-500',
    },
  };

  const style = styles[roleClass];

  return (
    <div
      className={`rounded-3xl border p-6 ${style.wrapper}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${style.icon}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {permissions.map((permission) => (
          <div
            key={permission}
            className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2.5"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.bullet}`}
            />

            <span className="text-[11px] font-semibold text-slate-600">
              {permission}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// INPUT FIELD
// ============================================================

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
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
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white py-3 text-sm outline-none transition ${
          icon ? 'pl-10 pr-4' : 'px-4'
        } ${
          error
            ? 'border-red-400 focus:ring-2 focus:ring-red-500/10'
            : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
        }`}
      />
    </div>

    {error && (
      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
        <FiAlertCircle size={13} />
        {error}
      </p>
    )}
  </div>
);

// ============================================================
// DETAIL ITEM
// ============================================================

const DetailItem = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  </div>
);

// ============================================================
// MODAL OVERLAY
// ============================================================

const ModalOverlay = ({
  children,
  onClose,
}) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }}
  >
    <div className="max-h-[92vh] w-full overflow-y-auto">
      <div className="flex min-h-full items-center justify-center">
        {children}
      </div>
    </div>
  </div>
);

// ============================================================
// CONFIRMATION MODAL
// ============================================================

const ConfirmationModal = ({
  type,
  user,
  isSubmitting,
  onCancel,
  onConfirm,
}) => {
  const isActivate = type === 'activate';
  const isDeactivate =
    type === 'deactivate';
  const isRemove = type === 'remove';

  let title = '';
  let description = '';
  let confirmText = '';
  let icon = null;
  let iconClass = '';
  let buttonClass = '';

  if (isActivate) {
    title = 'Activate User';
    description = `Activate ${user.fullName}'s account? They will be able to log into SpareFlow again.`;
    confirmText = 'Activate Account';
    icon = <FiUserCheck size={21} />;
    iconClass =
      'bg-emerald-50 text-emerald-600';
    buttonClass =
      'bg-emerald-600 hover:bg-emerald-700';
  }

  if (isDeactivate) {
    title = 'Deactivate User';
    description = `Deactivate ${user.fullName}'s account? They will no longer be able to log into SpareFlow until the account is activated again.`;
    confirmText = 'Deactivate Account';
    icon = <FiUserMinus size={21} />;
    iconClass =
      'bg-amber-50 text-amber-600';
    buttonClass =
      'bg-amber-600 hover:bg-amber-700';
  }

  if (isRemove) {
    title = 'Remove Staff Member';
    description = `Remove ${user.fullName} from this company's staff list? This action should only be used when the employee should no longer belong to this company.`;
    confirmText = 'Remove Staff';
    icon = <FiTrash2 size={21} />;
    iconClass = 'bg-red-50 text-red-600';
    buttonClass =
      'bg-red-600 hover:bg-red-700';
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-extrabold text-white">
            {user.fullName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">
              {user.fullName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonClass}`}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Processing...
            </>
          ) : (
            <>
              {isRemove ? (
                <FiTrash2 size={15} />
              ) : isActivate ? (
                <FiUserCheck size={15} />
              ) : (
                <FiUserMinus size={15} />
              )}

              {confirmText}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
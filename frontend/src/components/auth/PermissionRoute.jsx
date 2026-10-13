import React from 'react';
import usePermissions from '../../hooks/usePermissions';

const PermissionRoute = ({ permission, anyPermission, role, roles, children }) => {
  const { hasPermission, user } = usePermissions();
  const allowed = role
    ? user?.role === role
    : roles
      ? roles.includes(user?.role)
      : anyPermission
        ? anyPermission.some(hasPermission)
      : hasPermission(permission);

  if (allowed) return children;

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
      <h1 className="text-lg font-semibold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your account does not have permission to view this page.
      </p>
    </div>
  );
};

export default PermissionRoute;

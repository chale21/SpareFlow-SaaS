/**
 * Tenant Isolation Middleware
 */

/**
 * Ensure user can only access their own company
 */
const tenantIsolation = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const requestCompanyId =
      req.params.companyId ||
      req.query.companyId ||
      req.body.companyId ||
      req.headers['x-company-id'];

    if (
      requestCompanyId &&
      requestCompanyId !== req.user.companyId
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Access denied. You can only access your own company data.'
      });
    }

    req.companyId = req.user.companyId;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Automatically create tenant filter
 */
const filterByCompany = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const requestCompanyId =
      req.params.companyId ||
      req.query.companyId ||
      req.body.companyId ||
      req.headers['x-company-id'];

    if (requestCompanyId && requestCompanyId !== req.user.companyId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own company data.'
      });
    }

    req.companyId = req.user.companyId;

    req.tenantFilter = {
      companyId: req.user.companyId
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Allow Super Admin or own company
 */
const superAdminOrOwner = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      req.companyId =
        req.params.companyId ||
        req.query.companyId ||
        req.user.companyId;

      return next();
    }

    const requestCompanyId =
      req.params.companyId ||
      req.query.companyId ||
      req.body.companyId;

    if (
      requestCompanyId &&
      requestCompanyId !== req.user.companyId
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Access denied. You can only access your own company data.'
      });
    }

    req.companyId = req.user.companyId;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  tenantIsolation,
  filterByCompany,
  superAdminOrOwner
};
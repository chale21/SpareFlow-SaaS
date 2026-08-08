# SpareFlow SaaS — Project Structure

This document defines the architecture and organization of the SpareFlow SaaS project.

SpareFlow is a multi-tenant spare parts and inventory management platform built with React.js, Node.js, Express.js, MongoDB, and related technologies.

The structure is designed to support the four-person development team and allow the project to grow without creating unnecessary complexity.

---

# 1. Root Structure

```text
SpareFlow-SaaS/
│
├── README.md
├── .gitignore
│
├── frontend/
│
├── backend/
│
├── docs/
│   ├── CONTRIBUTING.md
│   └── PROJECT_STRUCTURE.md
│
└── .github/
    └── workflows/
```

---

# 2. Frontend Structure

SpareFlow uses:

* React.js
* JavaScript
* JSX
* Vite
* React Router
* Axios
* Tailwind CSS v4
* Context API
* Chart.js

There is **no TypeScript** in this project.

Therefore, the frontend does not contain a `types/` directory.

```text
frontend/
│
├── package.json
├── vite.config.js
├── .env.example
├── index.html
│
├── public/
│
└── src/
    │
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── assets/
    │   ├── images/
    │   └── icons/
    │
    ├── components/
    │   ├── common/
    │   ├── forms/
    │   ├── layout/
    │   ├── admin/
    │   ├── inventory/
    │   ├── products/
    │   ├── suppliers/
    │   ├── purchases/
    │   ├── sales/
    │   ├── dashboard/
    │   └── notifications/
    │
    ├── pages/
    │   ├── admin/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Companies.jsx
    │   │   ├── Users.jsx
    │   │   ├── SystemLogs.jsx
    │   │   └── PlatformSettings.jsx
    │   │
    │   ├── LandingPage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── ForgotPasswordPage.jsx
    │   ├── Dashboard.jsx
    │   ├── Inventory.jsx
    │   ├── Categories.jsx
    │   ├── Suppliers.jsx
    │   ├── Purchases.jsx
    │   ├── Sales.jsx
    │   ├── StockMovements.jsx
    │   ├── Notifications.jsx
    │   ├── Reports.jsx
    │   ├── Settings.jsx
    │   └── NotFound.jsx
    │
    ├── services/
    │
    ├── context/
    │
    ├── hooks/
    │
    └── utils/
```

---

# 3. Frontend Directory Responsibilities

## `components/`

Contains reusable UI components.

```text
components/
├── common/
├── forms/
├── layout/
├── admin/
├── inventory/
├── products/
├── suppliers/
├── purchases/
├── sales/
├── dashboard/
└── notifications/
```

### `common/`

General reusable components such as:

```text
Button
Input
Modal
Loading
ErrorMessage
ConfirmDialog
```

### `forms/`

Reusable forms such as:

```text
LoginForm
RegisterForm
ProductForm
PurchaseForm
SalesForm
```

### `layout/`

Application layout components:

```text
MainLayout
Navbar
Sidebar
Footer
```

### Feature Components

Feature-specific components should be organized according to their module.

For example:

```text
components/inventory/
components/products/
components/suppliers/
components/purchases/
components/sales/
```

---

# 4. Frontend Pages

The `pages/` directory contains page-level React components.

Main application pages include:

```text
LandingPage.jsx
LoginPage.jsx
RegisterPage.jsx
ForgotPasswordPage.jsx
Dashboard.jsx
Inventory.jsx
Categories.jsx
Suppliers.jsx
Purchases.jsx
Sales.jsx
StockMovements.jsx
Notifications.jsx
Reports.jsx
Settings.jsx
NotFound.jsx
```

---

# 5. Super Admin Frontend

Super Admin functionality is separated from normal shop operations.

```text
pages/admin/
├── AdminDashboard.jsx
├── Companies.jsx
├── Users.jsx
├── SystemLogs.jsx
└── PlatformSettings.jsx
```

The Super Admin can:

* Manage companies
* Activate/suspend companies
* Monitor platform activity
* View system statistics
* View system logs
* Manage global settings

---

# 6. Frontend Services

API communication should be organized in:

```text
frontend/src/services/
```

Recommended services include:

```text
api.js
authService.js
companyService.js
userService.js
productService.js
categoryService.js
supplierService.js
purchaseService.js
salesService.js
reportService.js
dashboardService.js
notificationService.js
```

These files communicate with the backend REST API.

---

# 7. Frontend Context

React Context is used for application-level state.

```text
frontend/src/context/
├── AuthContext.jsx
└── AppContext.jsx
```

`AuthContext` can manage:

* Current user
* Authentication state
* Login
* Logout
* User role
* Company information

---

# 8. Frontend Hooks

Custom React hooks belong in:

```text
frontend/src/hooks/
```

Examples:

```text
useAuth.js
useFetch.js
useDebounce.js
```

Only create a custom hook when it provides reusable functionality.

---

# 9. Frontend Utilities

Reusable utility functions belong in:

```text
frontend/src/utils/
```

Examples:

```text
constants.js
validators.js
formatters.js
storage.js
```

---

# 10. Backend Structure

The backend uses:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt

Structure:

```text
backend/
│
├── package.json
├── .env.example
│
└── src/
    │
    ├── server.js
    │
    ├── config/
    │
    ├── controllers/
    │
    ├── models/
    │
    ├── routes/
    │
    ├── middleware/
    │
    ├── services/
    │
    └── utils/
```

---

# 11. Backend Configuration

```text
backend/src/config/
├── database.js
└── env.js
```

### `database.js`

Responsible for MongoDB connection configuration.

### `env.js`

Responsible for reading and validating environment configuration where appropriate.

---

# 12. Backend Models

The database models represent the main entities of SpareFlow.

```text
backend/src/models/
├── Company.js
├── User.js
├── Category.js
├── Product.js
├── Supplier.js
├── Purchase.js
├── Sale.js
├── StockMovement.js
├── Notification.js
└── AuditLog.js
```

---

# 13. Company Model

`Company.js` represents a tenant/business using SpareFlow.

A company may contain:

* Company name
* Contact information
* Address
* Status
* Subscription information
* Timestamps

---

# 14. User Model

`User.js` represents users belonging to a company.

Users have roles such as:

```text
SUPER_ADMIN
SHOP_OWNER
STAFF
```

A normal business user belongs to a specific company.

---

# 15. Tenant Data

Company-owned records should contain:

```text
companyId
```

Examples:

```text
Product
Supplier
Purchase
Sale
Category
StockMovement
Notification
```

The `companyId` is used to enforce tenant isolation.

---

# 16. Product Model

`Product.js` represents spare parts and inventory items.

Possible fields include:

```text
name
SKU
category
description
quantity
costPrice
sellingPrice
minimumStock
maximumStock
supplier
companyId
```

---

# 17. Stock Movement Model

`StockMovement.js` records inventory changes.

Movement types include:

```text
STOCK_IN
STOCK_OUT
ADJUSTMENT
```

Stock movements may be generated by:

* Purchases
* Sales
* Manual adjustments

---

# 18. Notification Model

`Notification.js` stores important user/company notifications.

Examples:

```text
LOW_STOCK
SYSTEM_NOTIFICATION
BUSINESS_NOTIFICATION
```

---

# 19. Audit Log Model

`AuditLog.js` records important system activities.

Examples:

```text
LOGIN
LOGOUT
CREATE_PRODUCT
UPDATE_PRODUCT
DELETE_PRODUCT
CREATE_PURCHASE
CREATE_SALE
STOCK_ADJUSTMENT
PASSWORD_CHANGE
```

Audit logs support security and traceability.

---

# 20. Backend Controllers

Controllers handle HTTP requests and responses.

```text
backend/src/controllers/
├── authController.js
├── companyController.js
├── userController.js
├── categoryController.js
├── productController.js
├── supplierController.js
├── purchaseController.js
├── salesController.js
├── reportController.js
├── dashboardController.js
└── notificationController.js
```

---

# 21. Backend Routes

REST API routes are organized in:

```text
backend/src/routes/
├── auth.js
├── company.js
├── user.js
├── category.js
├── product.js
├── supplier.js
├── purchase.js
├── sales.js
├── report.js
├── dashboard.js
└── notification.js
```

Example:

```text
/api/v1/auth
/api/v1/companies
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/suppliers
/api/v1/purchases
/api/v1/sales
/api/v1/reports
/api/v1/dashboard
/api/v1/notifications
```

---

# 22. Middleware

Middleware is located in:

```text
backend/src/middleware/
```

Recommended middleware:

```text
auth.js
role.js
tenant.js
validate.js
errorHandler.js
```

## `auth.js`

Verifies JWT authentication.

## `role.js`

Checks whether the authenticated user has the required role.

## `tenant.js`

Ensures users can access only data belonging to their company.

## `validate.js`

Validates incoming request data.

## `errorHandler.js`

Provides centralized error handling.

---

# 23. Backend Services

Business logic belongs in:

```text
backend/src/services/
```

Recommended services:

```text
authService.js
companyService.js
userService.js
productService.js
supplierService.js
purchaseService.js
salesService.js
reportService.js
dashboardService.js
notificationService.js
auditService.js
```

---

# 24. Backend Utilities

Reusable backend utilities belong in:

```text
backend/src/utils/
```

Examples:

```text
generateToken.js
password.js
response.js
logger.js
```

---

# 25. Request Processing Flow

A normal API request should follow:

```text
Client
  ↓
Route
  ↓
Authentication Middleware
  ↓
Tenant Middleware
  ↓
Role Middleware
  ↓
Validation Middleware
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

---

# 26. Multi-Tenant Security Flow

For company-owned data:

```text
User Login
    ↓
JWT Generated
    ↓
JWT Verified
    ↓
User Identified
    ↓
Company Identified
    ↓
Role Checked
    ↓
Company Data Filtered
    ↓
Request Processed
```

A user from Company A must never receive data from Company B.

---

# 27. Documentation

Documentation is stored in:

```text
docs/
├── CONTRIBUTING.md
└── PROJECT_STRUCTURE.md
```

Additional documentation can be added as the project grows, for example:

```text
API.md
DATABASE.md
DEPLOYMENT.md
```

These should be created when the relevant documentation is actually available rather than creating empty placeholder files.

---

# 28. GitHub Workflows

GitHub Actions workflows are stored in:

```text
.github/workflows/
```

Potential workflows include:

```text
frontend.yml
backend.yml
```

These can later be used for:

* Automated testing
* Build verification
* Linting
* Continuous integration
* Deployment automation

Workflows should be added when the team has configured CI/CD.

---

# 29. Initial Repository Structure

At the beginning of the project, do not create every future source file.

The initial repository should contain the actual project foundation:

```text
SpareFlow-SaaS/
│
├── README.md
├── .gitignore
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       └── utils/
│
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── services/
│       └── utils/
│
├── docs/
│   ├── CONTRIBUTING.md
│   └── PROJECT_STRUCTURE.md
│
└── .github/
    └── workflows/
```

Feature-specific files should be created when developers begin implementing the relevant module.

---

# 30. Development Schedule

## Week 1 — Project Setup & Architecture

### Team Leader / Frontend Lead — Chalachew

* Repository management
* Git workflow
* React architecture
* Routing
* Reusable component structure
* Main layout
* Frontend development standards

### Frontend Developer — Silitu

* Landing page
* Login UI
* Registration UI
* Form components
* Frontend validation
* Authentication interface

### Backend Developer — Husinia

* MongoDB connection
* Company model
* User model
* Authentication API
* JWT authentication
* Password hashing

### Backend Developer — Hayatt

* Backend project structure
* Middleware foundation
* RBAC middleware
* Validation middleware
* Logging foundation
* Base API structure

---

# 31. Week 2 — Core Backend & Authentication

### Chalachew

* Authentication frontend integration
* Protected routes
* Auth context
* Navigation based on authentication

### Silitu

* Authentication pages
* User interface improvements
* Form validation
* Error and loading states

### Husinia

* Registration API
* Login API
* JWT middleware
* Company management
* User management
* Tenant identification

### Hayatt

* Role-based authorization
* Validation
* Error handling
* Security middleware
* API testing

---

# 32. Week 3 — Inventory & Purchase

### Frontend Team

* Product UI
* Category UI
* Supplier UI
* Inventory UI
* Purchase UI

### Backend Team

* Product APIs
* Category APIs
* Supplier APIs
* Purchase APIs
* Stock movement logic
* Automatic stock updates

---

# 33. Week 4 — Sales & Dashboard

### Frontend

* Sales page
* Invoice interface
* Dashboard
* Charts
* Sales analytics

### Backend

* Sales API
* Invoice logic
* Stock reduction
* Dashboard statistics
* Sales analytics APIs

---

# 34. Week 5 — Reports & Advanced Features

Implement:

* Sales reports
* Purchase reports
* Inventory reports
* Stock movement reports
* Low-stock alerts
* Notifications
* Audit logging

---

# 35. Week 6 — Integration & Polish

Focus on:

* Frontend/backend integration
* Responsive UI
* Error handling
* Loading states
* Security improvements
* Performance improvements
* User experience

---

# 36. Week 7 — Testing & Quality Assurance

Testing includes:

* Frontend testing
* Backend testing
* API testing
* Integration testing
* End-to-end testing
* Security testing
* Tenant isolation testing
* Role permission testing

---

# 37. Week 8 — Deployment & Documentation

Final activities:

* Production configuration
* MongoDB Atlas
* Backend deployment
* Frontend deployment
* Environment configuration
* Final testing
* Documentation
* Release preparation

---

# 38. Final Architecture

The final system can be summarized as:

```text
                         SpareFlow SaaS
                              │
              ┌───────────────┴───────────────┐
              │                               │
         React Frontend                  Express API
              │                               │
        React Router                     Middleware
              │                               │
        Context API                 ┌──────────┼──────────┐
              │                     │          │          │
          Axios API              Auth       RBAC      Tenant
              │                     │          │          │
              └─────────────────────┴──────────┴──────────┘
                                             │
                                        Controllers
                                             │
                                          Services
                                             │
                                          Mongoose
                                             │
                                       MongoDB Atlas
```

The architecture is designed around three major principles:

```text
Security
   +
Tenant Isolation
   +
Maintainability
```

---

# Project Status

**Initial architecture:** Defined

**Development team:** 4 developers

**Frontend:** React.js + JavaScript/JSX + Vite + Tailwind CSS v4

**Backend:** Node.js + Express.js

**Database:** MongoDB Atlas

**Authentication:** JWT + Bcrypt

**Architecture:** Multi-Tenant SaaS

**Development workflow:** Feature Branch → Develop → Main

**Planned development duration:** 8 weeks

**Version:** 1.0

**Last Updated:** August 2026

**Organization:** Aliyah Technology

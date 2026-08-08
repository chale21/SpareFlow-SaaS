# Contributing to SpareFlow

Thank you for contributing to **SpareFlow SaaS**.

This document defines the development workflow, Git strategy, coding standards, Pull Request process, testing expectations, and team responsibilities for the project.

All team members should read and follow these guidelines before starting development.

---

# Development Team

## Team Leader & Frontend Lead

**Chalachew Akilew**

## Frontend Developer

**Silitu Agalu**

## Backend Developer 1

**Husinia**

## Backend Developer 2

**Hayatt**

SpareFlow is developed by a team of **four developers**.

---

# Development Principles

All contributors should follow these principles:

* Write clean and readable code.
* Keep features modular.
* Avoid unnecessary duplication.
* Follow the existing project structure.
* Protect company/tenant data.
* Validate user input.
* Handle errors properly.
* Test features before creating Pull Requests.
* Keep commits meaningful.
* Do not commit secrets.
* Review other team members' code carefully.

---

# Git Branch Strategy

SpareFlow uses the following branch structure:

```text
main
  ↑
  │
develop
  ↑
  ├── feature/*
  ├── bugfix/*
  └── hotfix/*
```

## Main Branch

`main` contains stable, production-ready code.

Developers must **not push directly to `main`**.

Changes should reach `main` through a Pull Request from `develop`.

---

## Develop Branch

`develop` is the main integration branch for ongoing development.

Completed features are merged into `develop` after code review.

Developers should **not push directly to `develop`**.

---

## Feature Branches

Feature branches are used for new functionality.

Naming convention:

```text
feature/feature-name
```

Examples:

```text
feature/authentication
feature/inventory-management
feature/supplier-management
feature/sales-module
feature/dashboard
```

---

## Bugfix Branches

Use:

```text
bugfix/bug-description
```

Examples:

```text
bugfix/login-validation
bugfix/stock-calculation
bugfix/invoice-total
```

---

## Hotfix Branches

Use:

```text
hotfix/critical-fix
```

Hotfixes are reserved for urgent problems affecting stable/production code.

---

# Development Workflow

Before starting a task:

```bash
git checkout develop
git pull origin develop
```

Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

Example:

```bash
git checkout -b feature/inventory-management
```

Work on your task and test it.

Then:

```bash
git add .
git commit -m "feat: add inventory management"
```

Push your branch:

```bash
git push -u origin feature/inventory-management
```

Create a Pull Request:

```text
feature/inventory-management
            ↓
         develop
```

After review and approval, the Pull Request can be merged.

---

# Pull Request Process

Every feature must go through a Pull Request.

## Process

1. Create a branch from `develop`.
2. Implement the assigned task.
3. Test your changes locally.
4. Commit your changes.
5. Push the feature branch.
6. Create a Pull Request to `develop`.
7. Request review.
8. Address review comments.
9. Wait for approval.
10. Merge into `develop`.

The Team Leader is responsible for coordinating reviews and ensuring that the code meets project standards.

---

# Main Branch Release Process

The normal development flow is:

```text
feature branch
      ↓
   Pull Request
      ↓
   develop
      ↓
Integration Testing
      ↓
Release Testing
      ↓
Pull Request
      ↓
     main
```

`main` should contain only stable and release-ready code.

---

# Commit Guidelines

SpareFlow follows the **Conventional Commits** style.

## Feature

```text
feat: add inventory management
```

## Bug Fix

```text
fix: resolve incorrect stock calculation
```

## Documentation

```text
docs: update contributing guidelines
```

## Refactoring

```text
refactor: improve product service
```

## Tests

```text
test: add authentication API tests
```

## Chore

```text
chore: update dependencies
```

Keep commit messages:

* Short
* Clear
* Specific
* Related to one logical change

---

# Frontend Standards

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

## React

Use functional components and hooks.

Preferred:

```jsx
function ProductList() {
  return (
    <div>
      Product List
    </div>
  );
}

export default ProductList;
```

Avoid unnecessary class components.

## Component Organization

Reusable components should be placed in:

```text
frontend/src/components/
```

Page-level components should be placed in:

```text
frontend/src/pages/
```

API communication should be placed in:

```text
frontend/src/services/
```

---

# Styling Standards

SpareFlow uses **Tailwind CSS v4**.

Use Tailwind utility classes for styling.

Avoid introducing another CSS framework without team approval.

Keep reusable styling patterns organized and consistent.

---

# API Communication

Use Axios for API communication.

API-related logic should be placed in:

```text
frontend/src/services/
```

Do not duplicate API request logic unnecessarily across components.

---

# Loading and Error States

Frontend features that communicate with the backend should provide appropriate:

* Loading states
* Success feedback
* Error messages
* Empty states

Example:

```text
Loading...
```

```text
No products found.
```

```text
Failed to load products.
```

---

# Backend Standards

SpareFlow uses:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Bcrypt

Follow this general backend flow:

```text
Route
  ↓
Middleware
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

# Controllers

Controllers should handle HTTP requests and responses.

Business logic should not unnecessarily be placed directly inside route files.

Controllers are located in:

```text
backend/src/controllers/
```

---

# Services

Business logic should be organized inside:

```text
backend/src/services/
```

Services should contain reusable business operations.

---

# Database Standards

MongoDB is accessed through Mongoose.

Database models are located in:

```text
backend/src/models/
```

Use:

* Schema validation
* Appropriate indexes
* Appropriate references
* Meaningful field names

---

# Multi-Tenant Security

Multi-tenancy is one of the most important requirements of SpareFlow.

Every company-owned record must be associated with the appropriate company/tenant.

Example:

```text
companyId
```

Users must only be able to access data belonging to their company.

The backend must never trust a company ID supplied by the client without validating the authenticated user's tenant.

The general security flow should be:

```text
Request
   ↓
JWT Authentication
   ↓
Identify User
   ↓
Identify User's Company
   ↓
Check Role
   ↓
Apply Tenant Restriction
   ↓
Access Company Data
```

---

# Authentication

Authentication uses JWT.

Passwords must be hashed using Bcrypt.

Never store plain-text passwords.

Private API endpoints must require authentication.

---

# Role-Based Access Control

SpareFlow has three roles:

```text
SUPER_ADMIN
SHOP_OWNER
STAFF
```

Authorization must be checked on the backend.

Frontend restrictions alone are not sufficient for security.

---

# Data Isolation

Developers must ensure that one company cannot access another company's:

* Products
* Categories
* Suppliers
* Purchases
* Sales
* Stock movements
* Reports
* Users
* Notifications
* Other private business data

Tenant isolation must be enforced on the server side.

---

# Stock Management

Inventory changes must be handled carefully.

Stock can change through:

* Purchases
* Sales
* Stock adjustments

Important stock changes should create appropriate stock movement records.

Do not update stock without considering the corresponding stock movement history.

---

# Validation

Validate data received from users before processing it.

Validation should be applied to:

* Authentication
* Products
* Categories
* Suppliers
* Purchases
* Sales
* User management
* Company management

Never rely only on frontend validation.

---

# Error Handling

Backend errors should be handled consistently.

Do not expose sensitive information such as:

* Database credentials
* JWT secrets
* Internal server details
* Password information

Use appropriate HTTP status codes.

---

# Environment Variables

Never commit `.env` files.

Use:

```text
.env.example
```

to document required environment variables.

Example:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
NODE_ENV=development
```

---

# Testing

Developers should test their work before creating a Pull Request.

Testing should include:

## Frontend

* Component behavior
* Forms
* Navigation
* Loading states
* Error states
* Responsive layouts

## Backend

* Authentication
* Authorization
* API endpoints
* Validation
* Database operations
* Tenant isolation
* Error handling

## API Testing

Use **Postman** or another API testing tool to test REST APIs.

---

# Code Review

Every Pull Request should be reviewed before merging.

Reviewers should check:

* Code quality
* Correctness
* Security
* Multi-tenant isolation
* Role permissions
* Performance
* Error handling
* Validation
* Naming conventions
* Documentation
* Testing

At least one team member should review a Pull Request before it is merged.

---

# Communication

The team should use:

* **GitHub Issues** - Bugs, tasks, and feature tracking
* **GitHub Pull Requests** - Code review
* **Telegram** - Quick communication
* **Weekly team meeting** - Progress review and planning

Developers should report blockers early instead of waiting until the end of the week.

---

# Task Management

Each developer should work on an assigned task.

A task should ideally have:

* Clear objective
* Assigned developer
* Expected result
* Related GitHub Issue
* Appropriate branch
* Pull Request

---

# Development Team Responsibilities

## Team Leader / Frontend Lead — Chalachew Akilew

Responsible for:

* Project coordination
* Frontend architecture
* React development
* Reusable components
* Routing
* Frontend standards
* Repository management
* Pull Request review
* Integration coordination

## Frontend Developer — Silitu Agalu

Responsible for:

* UI implementation
* React pages
* Forms
* API integration
* Context/state management
* Frontend testing

## Backend Developer — Husinia

Responsible for:

* Authentication
* Company management
* User management
* Database architecture
* JWT authentication
* Tenant middleware
* Core REST APIs

## Backend Developer — Hayatt

Responsible for:

* Inventory APIs
* Product management
* Supplier management
* Purchase management
* Sales management
* Stock movements
* Reports
* Validation and RBAC

Responsibilities may be adjusted during development according to project needs.

---

# Important Rules

1. Do not push directly to `main`.
2. Do not push directly to `develop`.
3. Always create a feature/bugfix branch.
4. Keep branches focused on one task.
5. Pull the latest `develop` before starting work.
6. Test your code before creating a Pull Request.
7. Never commit secrets.
8. Never bypass tenant isolation.
9. Never trust frontend authorization alone.
10. Request code review before merging.
11. Keep commits meaningful.
12. Update documentation when necessary.

---

# Questions

If you have questions or encounter a blocker:

1. Check the project documentation.
2. Check existing GitHub Issues.
3. Ask the development team.
4. Contact the Team Leader.

Let's build SpareFlow with clean code, secure architecture, and consistent teamwork.

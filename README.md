# SpareFlow SaaS

A Multi-Tenant SaaS Spare Parts & Inventory Management System

## Project Overview

**SpareFlow** is a cloud-based, multi-tenant Software as a Service (SaaS) inventory management system designed primarily for spare parts shops.

The platform allows multiple businesses to register and operate independently on the same system while keeping each company's data isolated and secure.

SpareFlow helps spare parts businesses manage their:

* Products and inventory
* Categories
* Suppliers
* Purchases
* Sales
* Stock movements
* Customers
* Reports
* Notifications
* Business analytics

The system supports three main user roles:

* **Super Admin**
* **Shop Owner**
* **Staff**

Each company operates within its own tenant, and users can only access data belonging to their company.

---

## Main Objectives

SpareFlow aims to:

1. Digitize spare parts inventory management.
2. Reduce manual inventory tracking.
3. Prevent stock shortages and overstocking.
4. Track purchases and sales accurately.
5. Provide real-time stock information.
6. Help businesses monitor their performance.
7. Provide low-stock alerts and notifications.
8. Maintain secure separation between different companies.
9. Provide role-based access to system features.
10. Provide useful reports for business decision-making.

---

# Technology Stack

## Frontend

* **React.js** - User interface
* **JavaScript / JSX** - Frontend development
* **Vite** - Frontend build tool
* **React Router** - Client-side navigation
* **Axios** - API communication
* **Tailwind CSS v4** - Styling
* **Chart.js** - Dashboard charts
* **Context API** - Application state management

> SpareFlow uses JavaScript/JSX, not TypeScript.

## Backend

* **Node.js** - Server runtime
* **Express.js** - REST API development
* **MongoDB Atlas** - Cloud database
* **Mongoose** - MongoDB ODM
* **JWT** - Authentication
* **Bcrypt** - Password hashing

## Deployment

* **Vercel** - Frontend deployment
* **Render** - Backend deployment
* **MongoDB Atlas** - Database hosting

---

# System Architecture

SpareFlow follows a client-server architecture:

```text
React.js Frontend
        │
        │ HTTP/REST API
        ▼
Node.js + Express.js Backend
        │
        ├── Authentication
        ├── Authorization
        ├── Tenant Isolation
        ├── Business Logic
        └── Validation
        │
        ▼
MongoDB Atlas
```

### Multi-Tenant Architecture

Each company is treated as a separate tenant.

```text
SpareFlow Platform
│
├── Company A
│   ├── Users
│   ├── Products
│   ├── Suppliers
│   ├── Purchases
│   └── Sales
│
├── Company B
│   ├── Users
│   ├── Products
│   ├── Suppliers
│   ├── Purchases
│   └── Sales
│
└── Company C
    ├── Users
    ├── Products
    ├── Suppliers
    ├── Purchases
    └── Sales
```

Data belonging to one company must never be accessible by another company.

---

# Core Features

## 1. Authentication

Users can:

* Register
* Login
* Logout
* Manage their profile
* Change their password
* Reset their password

Authentication is implemented using JWT.

Passwords are securely hashed using Bcrypt.

---

## 2. Multi-Tenant Company Management

Each registered business has its own company account.

The system ensures:

* Company-level data isolation
* Company-specific users
* Company-specific products
* Company-specific suppliers
* Company-specific purchases
* Company-specific sales
* Company-specific reports

Every company-owned database record should contain an appropriate `companyId`.

---

## 3. Role-Based Access Control

SpareFlow provides three primary roles.

### Super Admin

The Super Admin manages the overall platform.

Responsibilities include:

* Manage registered companies
* Activate or suspend companies
* Monitor platform activity
* View platform statistics
* Manage global settings
* Monitor system logs

### Shop Owner

The Shop Owner has full access to their company's business operations.

Responsibilities include:

* Manage inventory
* Manage categories
* Manage suppliers
* Manage purchases
* Manage sales
* Manage staff accounts
* View reports
* View dashboard analytics
* Manage company settings

### Staff

Staff members have operational access based on their permissions.

They can:

* Manage inventory
* Manage products
* Manage categories
* Manage suppliers
* Record purchases
* Record sales
* View dashboard information
* View permitted reports

Access to sensitive company administration functions remains restricted.

---

# Inventory Management

The inventory module allows businesses to:

* Add products
* Update products
* Delete products
* Search products
* Filter products
* Organize products by category
* Track stock quantities
* Set minimum stock levels
* Set maximum stock levels
* Monitor stock status

Each product may contain:

* Product name
* SKU
* Category
* Description
* Quantity
* Cost price
* Selling price
* Minimum stock level
* Maximum stock level
* Supplier
* Company/Tenant

---

# Stock Movement Management

SpareFlow records inventory movements.

Supported stock movements include:

* Stock In
* Stock Out
* Stock Adjustment

Stock movements can be generated by:

* Purchases
* Sales
* Manual adjustments

The system maintains a history of inventory changes to provide traceability.

---

# Low Stock Notifications

The system monitors product quantities.

When stock reaches or falls below the configured minimum level, the system can generate a low-stock notification.

Example:

```text
Low Stock Alert

Product: Toyota Brake Pad
Current Stock: 4
Minimum Stock: 10
```

---

# Supplier Management

Businesses can manage their suppliers.

Supplier information may include:

* Supplier name
* Contact person
* Phone number
* Email
* Address
* Notes
* Company/Tenant

Users can:

* Add suppliers
* Update suppliers
* View suppliers
* Search suppliers
* Manage supplier information

---

# Purchase Management

The purchase module allows businesses to record inventory purchases.

Purchase records may include:

* Supplier
* Purchase date
* Products
* Quantities
* Unit costs
* Total amount
* Payment information
* Notes

A completed purchase can automatically increase product stock.

---

# Sales Management

The sales module allows businesses to:

* Create sales
* Add products to a sale
* Calculate totals
* Record customer information
* Reduce inventory automatically
* Generate invoices
* View sales history

A completed sale automatically updates inventory.

---

# Dashboard

The dashboard provides business analytics.

Possible dashboard information includes:

* Total products
* Total stock value
* Low-stock products
* Total suppliers
* Total purchases
* Total sales
* Revenue
* Recent transactions
* Sales charts
* Purchase charts
* Inventory statistics

Charts are implemented using Chart.js.

---

# Reports

The reporting module provides useful business information.

Reports may include:

* Sales reports
* Purchase reports
* Inventory reports
* Stock movement reports
* Low-stock reports
* Supplier reports
* Business performance reports

Reports should support filtering by relevant dates and other available criteria.

---

# Notifications

The notification module provides important system and business notifications.

Examples include:

* Low-stock alerts
* Important inventory notifications
* Business activity notifications

---

# Audit Logs

Important system activities should be recorded for security and traceability.

Examples include:

* Login
* Logout
* Product creation
* Product update
* Product deletion
* Purchase creation
* Sale creation
* Stock adjustment
* Password changes
* Important administrative actions

Audit records should include the relevant user and company information.

---

# Project Structure

```text
SpareFlow-SaaS/
├── README.md
├── .gitignore
│
├── frontend/
├── backend/
│
├── docs/
│   ├── CONTRIBUTING.md
│   └── PROJECT_STRUCTURE.md
│
└── .github/
    └── workflows/
```

For the detailed architecture, see:

```text
docs/PROJECT_STRUCTURE.md
```

For development and Git workflow, see:

```text
docs/CONTRIBUTING.md
```

---

# Getting Started

## Prerequisites

Install the following:

* Node.js LTS
* pnpm
* Git
* MongoDB Atlas account

---

## Clone the Repository

```bash
git clone <repository-url>
cd SpareFlow-SaaS
```

---

## Frontend Setup

```bash
cd frontend
pnpm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
pnpm run dev
```

---

## Backend Setup

Open another terminal:

```bash
cd backend
pnpm install
```

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
pnpm run dev
```

---

# Environment Variables

Never commit real environment variables or secrets to GitHub.

Use:

```text
.env.example
```

for environment variable templates.

Do not commit:

```text
.env
```

---

# Development Workflow

SpareFlow uses the following Git workflow:

```text
feature/*
      ↓
   develop
      ↓
    main
```

### Branches

* `main` - Stable production-ready code
* `develop` - Integration and development branch
* `feature/*` - New features
* `bugfix/*` - Bug fixes
* `hotfix/*` - Critical production fixes

Developers should not push directly to `main` or `develop`.

For complete guidelines, see:

```text
docs/CONTRIBUTING.md
```

---

# Development Team

### Team Leader & Frontend Lead

**Chalachew Akilew**

Responsibilities:

* Team coordination
* Frontend architecture
* React.js development
* UI component standards
* Routing
* Frontend integration
* Code review
* GitHub repository management
* Pull Request review

### Frontend Developer

**Silitu Agalu**

Responsibilities:

* React.js development
* UI implementation
* Forms
* Frontend pages
* API integration
* State management
* Frontend testing

### Backend Developer 1

**Husinia**

Responsibilities:

* Backend architecture
* Authentication
* Company management
* User management
* Database models
* REST APIs
* JWT authentication
* Tenant isolation

### Backend Developer 2

**Hayatt**

Responsibilities:

* Inventory backend
* Suppliers
* Purchases
* Sales
* Stock movements
* RBAC
* Validation
* Reporting APIs

---

# Development Schedule

## Week 1 — Project Setup & Architecture

* Repository setup
* Development environment setup
* Frontend architecture
* Backend architecture
* Authentication foundation
* Database foundation
* Git workflow
* Reusable components

## Week 2 — Core Backend & Authentication

* Company model
* User model
* Registration
* Login
* JWT authentication
* Password hashing
* Authentication middleware
* RBAC
* Tenant isolation

## Week 3 — Inventory & Purchase Management

* Product management
* Category management
* Supplier management
* Stock management
* Stock movements
* Purchase management
* Automatic stock updates

## Week 4 — Sales & Dashboard

* Sales management
* Invoice generation
* Automatic stock reduction
* Dashboard statistics
* Sales analytics
* Purchase analytics

## Week 5 — Reports & Advanced Features

* Sales reports
* Purchase reports
* Inventory reports
* Stock movement reports
* Low-stock alerts
* Notifications
* Audit logs

## Week 6 — Integration & Polish

* Frontend/backend integration
* UI improvements
* Error handling
* Loading states
* Responsive design
* Security improvements
* Performance improvements

## Week 7 — Testing & Quality Assurance

* Unit testing
* API testing
* Integration testing
* End-to-end testing
* Security testing
* Multi-tenant isolation testing
* Bug fixing

## Week 8 — Deployment & Documentation

* Production configuration
* MongoDB Atlas configuration
* Backend deployment to Render
* Frontend deployment to Vercel
* Environment configuration
* Final testing
* Documentation
* Release preparation

---

# Security Requirements

Security is a core part of SpareFlow.

The system must:

* Hash passwords using Bcrypt
* Use JWT authentication
* Validate user input
* Protect private API routes
* Implement role-based authorization
* Implement tenant isolation
* Protect sensitive environment variables
* Prevent unauthorized company data access
* Record important system activities
* Handle errors securely

---

# Contributing

Please read:

```text
docs/CONTRIBUTING.md
```

before contributing to the project.

---

# License

This project is licensed under the MIT License.

---

# Organization

**Aliyah Technology**

## Version

**1.0**

## Last Updated

**August 2026**

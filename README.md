# BuRolls - Multi-Business Unit Invoice Management System (MERN Stack)

## 1. Project Overview

The **Multi-Business Unit Invoice Management System (BuRolls)** is a web-based platform for managing invoices across multiple Business Units (BUs) and Companies. It includes **role-based access control (RBAC)**, **multi-level approval workflows**, and a flexible notification system.

* **BU Users:** Create and track invoices.
* **BU Managers:** Approve/reject invoices, manage company groups.
* **Super Admins:** Control system-wide permissions and monitor activity.

---

## 2. Technology Stack

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js
* **Authentication:** JWT (JSON Web Tokens)
* **Authorization:** Role-Based Access Control (RBAC) middleware
* **Database:** MongoDB (Atlas or local)
* **ORM/ODM:** Mongoose

### Frontend

* **Framework:** React.js
* **State Management:** React Context / Redux (optional)
* **UI Library:** TailwindCSS
* **Routing:** React Router DOM
* **API Communication:** Axios

### Other Tools

* **PDF Generation:** pdf-lib / jsPDF
* **Notifications:** MongoDB-based or socket.io for real-time
* **Version Control:** Git + GitHub

---

## 3. Folder Structure

```
BuRolls/
│
├── backend/
│   ├── server.js                  # Entry point
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── jwt.js                 # JWT config
│   │
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── rbac.js                # Role-based access
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Company.js
│   │   ├── CompanyGroup.js
│   │   ├── Invoice.js
│   │   ├── ApprovalTrail.js
│   │   ├── Notification.js
│   │   └── AuditLog.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── managers.js
│   │   ├── superadmin.js
│   │   ├── companies.js
│   │   ├── invoices.js
│   │   └── notifications.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── managerController.js
│   │   ├── superadminController.js
│   │   ├── companyController.js
│   │   ├── invoiceController.js
│   │   └── notificationController.js
│   │
│   └── services/
│       ├── approvalService.js     # Approval workflows
│       ├── notificationService.js
│       └── auditService.js
│
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/
│       │   ├── axios.js
│       │   └── endpoints.js
│       │
│       ├── auth/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── authContext.jsx
│       │
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   └── ui/
│       │
│       ├── pages/
│       │   ├── superadmin/
│       │   ├── manager/
│       │   ├── user/
│       │   └── invoices/
│       │
│       ├── routes/
│       │   └── ProtectedRoutes.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── utils/
│       │   ├── permissions.js
│       │   └── constants.js
│       │
│       ├── App.jsx
│       └── main.jsx
│
└── README.md
```

---

## 4. User Roles & Permissions

### 4.1 Super Admin

* Manage users, roles, and permissions
* Configure field-level access
* View system-wide audit logs and analytics

### 4.2 BU Manager

* Manage company groups
* Approve/reject carry invoices
* Assign BUs to company groups

### 4.3 BU User

* Create invoices (regular & carry)
* Track invoice status
* No approval privileges

---

## 5. Core Features

### 5.1 Authentication & Authorization

* JWT-based authentication
* Role-based middleware for route protection
* Token refresh mechanism
* Password hashing using bcrypt

---

### 5.2 Company & Group Management

* Company Groups created by BU Managers
* Field-level access controlled by Super Admin
* MongoDB collections: `companies`, `companyGroups`

---

### 5.3 Invoice Management

**Invoice Types:**

1. **Regular Invoice:** Direct submission, no approval
2. **Carry Invoice:** Requires multi-level approval

**Workflow:**

| State                          | Description                     |
| ------------------------------ | ------------------------------- |
| DRAFT                          | Invoice not submitted           |
| SUBMITTED                      | Regular invoice submitted       |
| PENDING_BU_MANAGER_APPROVAL    | Awaiting BU Manager approval    |
| PENDING_CARRY_COMPANY_APPROVAL | Awaiting Carry Company approval |
| APPROVED                       | Fully approved                  |
| REJECTED                       | Rejected at any stage           |

**Approval Steps:**

1. BU User submits carry invoice → Status: `PENDING_BU_MANAGER_APPROVAL`
2. BU Manager approves/rejects → Status: `PENDING_CARRY_COMPANY_APPROVAL` / `REJECTED`
3. Carry company approves/rejects → Status: `APPROVED` / `REJECTED`
4. PDF generated after final approval

---

### 5.4 Notification System

* Blocking notifications: approval requests, high-priority alerts
* Informational notifications: invoice status updates
* Role-based delivery: BU User, BU Manager, Carry Company

---

### 5.5 Dashboard & Reporting

**Super Admin Dashboard:** Users, invoices, roles, audit logs
**BU Manager Dashboard:** Pending approvals, company group summary
**BU User Dashboard:** Assigned companies, recent invoices
**Company Dashboard:** Pending approvals, invoice history, PDF downloads

---

## 6. Database Design (MongoDB)

**Collections:**

* `users` – User accounts with roles
* `roles` – Role definitions
* `permissions` – RBAC mapping
* `businessUnits` – Business unit info
* `companyGroups` – Groups of companies
* `companies` – Company details
* `invoices` – Invoice documents
* `approvalTrails` – Multi-level approval history
* `notifications` – Notification messages
* `auditLogs` – System activity

---

## 7. API Design (Sample)

**Authentication:**

```
POST /api/auth/login
POST /api/auth/refresh
```

**Invoice:**

```
POST   /api/invoices
GET    /api/invoices
GET    /api/invoices/:id
POST   /api/invoices/:id/approve
POST   /api/invoices/:id/reject
```

**Company:**

```
POST /api/companies
GET  /api/companies
```

---

## 8. Security Considerations

* JWT authentication
* Role-based access control
* Input validation (express-validator or custom)
* MongoDB query protection
* Audit logging

---

## 9. Deployment Architecture

* **Frontend:** React (Netlify / Vercel)
* **Backend:** Node.js + Express (Render / Heroku)
* **Database:** MongoDB Atlas

---

## 10. Future Enhancements

* Email notifications
* Invoice templates
* Bulk invoice uploads
* Analytics & export reports
* Real-time notifications with socket.io

---

## 11. Hierarchical Registration & Approval Flow 🔧

This project supports a hierarchical user and company approval workflow where credentials are emailed on approval.

Flows:

1. **Super Admin**
   - Registers via `POST /api/auth/register-superadmin` (creates an approved `SUPER_ADMIN`).
   - Logs in via `POST /api/auth/login`.
   - Creates business units via `POST /api/v1/business-units/` (fields: `name`, `companyLegalName`, `companyAddress`, `contactPhone`).
   - Assigns manager access to a business unit via `POST /api/v1/business-units/:id/assign-manager` (body: `{ "managerId": "...", "fields": ["name","companyAddress"] }`).

2. **BU Manager / BU User registration**
   - A manager or user requests account via `POST /api/users/request` with `{ name, email, role }`.
   - The system generates a temporary password (stored temporarily) and notifies the Super Admin via email.
   - Super Admin approves via `POST /api/users/approve/:userId` (protected by `SUPER_ADMIN` role). On approval an email is sent to the user with the temporary password and login instructions.

3. **Company creation and approval**
   - An authenticated `BU_USER` requests a company via `POST /api/companies/request` with `{ name }`.
   - All approved `BU_MANAGER` users are notified by email to review the request.
   - A `BU_MANAGER` approves via `POST /api/companies/approve/:companyId` (protected by `BU_MANAGER` role). The company creator receives an approval email.

Additional details:

- **Business Unit fields** now include `companyLegalName`, `companyAddress`, and `contactPhone`.
- **Company fields** now include `legalName`, `legalAddress`, `address`, and `contactPhone`.
- **Manager permissions**: Super Admin can assign field-level permissions for managers per business unit; managers can only edit the fields they've been granted access to on a BU they are mapped to.

Environment variables required for the workflow and email sending:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret
- `JWT_EXPIRES_IN` - JWT expiry (optional)
- `SUPERADMIN_EMAIL` - Email address to receive manager/user registration requests
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - SMTP settings for nodemailer
- `APP_BASE_URL` - (optional) base URL for constructing approval links

---


# Multi-Business Unit Invoice Management System

## 1. Project Overview

The **Multi-Business Unit Invoice Management System** is a web-based application designed to manage invoices across multiple Business Units (BUs) and Companies with strict **role-based access control (RBAC)** and **multi-level approval workflows**.

The system allows BUs to raise invoices, BU Managers to manage companies and approvals, and Super Admins to control system-wide permissions and configurations.

---

## 2. Technology Stack

### Backend

* **Framework:** Python Django
* **API Layer:** Django REST Framework (DRF)
* **Authentication:** JWT (SimpleJWT)
* **Authorization:** Role-Based Access Control (RBAC)
* **Database:** Neon (PostgreSQL – Serverless)
* **ORM:** Django ORM

### Folder structure

```
BuRolls/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── .gitignore
│   │
│   ├── burulls/                    # Django project (config)
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py              # Common settings
│   │   │   ├── dev.py               # Development settings
│   │   │   └── prod.py              # Production settings
│   │   │
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   ├── apps/
│   │   ├── auth/                    # Custom authentication & JWT
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py            # Custom User, Role
│   │   │   ├── serializers.py
│   │   │   ├── permissions.py       # RBAC permissions
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── migrations/
│   │
│   │   ├── superadmin/              # System-wide control
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── permissions.py
│   │
│   │   ├── managers/                # BU Manager domain
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── permissions.py
│   │
│   │   ├── users/                   # BU Users
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── permissions.py
│   │
│   │   ├── companies/               # Companies & Groups
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py            # Company, CompanyGroup
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── migrations/
│   │
│   │   ├── invoices/                # Invoice domain
│   │   │   ├── __init__.py
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── models.py            # Invoice, ApprovalTrail
│   │   │   ├── serializers.py
│   │   │   ├── services.py          # Approval logic, workflows
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── migrations/
│   │
│   │   ├── notifications/           # Notification system
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── services.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── migrations/
│   │
│   │   ├── audit_logs/               # Audit & activity tracking
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── services.py
│   │   │   └── migrations/
│   │
│   │   └── common/                   # Shared utilities
│   │       ├── __init__.py
│   │       ├── permissions.py
│   │       ├── pagination.py
│   │       ├── mixins.py
│   │       └── constants.py
│   │
│   ├── media/                        # Invoice PDFs
│   └── static/
│
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── api/                      # Axios configs
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
├── docs/
│   ├── api.md
│   ├── database.md
│   └── workflows.md
│
└── README.md
```

### Frontend

* **Framework:** React
* **State Management:** React Context
* **UI Library:** TailwindCSS
* **Routing:** React Router
* **API Communication:** Axios

### Other Tools

* **PDF Generation:** WeasyPrint / ReportLab (Optional)
* **Notifications:** Database-backed notification system
* **Version Control:** Git + GitHub

---

## 3. User Roles & Permissions

### 3.1 Super Admin

**Responsibilities**

* Create and manage users
* Assign roles (BU Manager, BU User)
* Configure role-based permissions
* Configure field-level access (Manager-only / BU-editable)
* View system-wide audit logs
* View system statistics

**Access Scope**

* Full system access
* Can access all BUs, companies, and invoices

---

### 3.2 BU Manager

**Responsibilities**

* Create and manage company groups
* Onboard companies
* Assign BUs to company groups
* Review and approve/reject carry invoices
* View all invoices under assigned company groups

**Access Scope**

* Only assigned company groups
* Cannot access other BU Manager data

---

### 3.3 BU User

**Responsibilities**

* Raise invoices for assigned companies
* Create regular invoices
* Create carry invoices (approval required)
* View invoice status and history

**Access Scope**

* Only assigned companies
* No access to approval actions

---

## 4. Core Features

## 4.1 Authentication & Authorization

* JWT-based authentication
* Role-based authorization middleware
* Token refresh mechanism
* Secure password hashing (Django default)

---

## 4.2 Company & Group Management

### Company Groups

* Created by BU Managers
* A group contains multiple sibling companies
* Used for carry invoice eligibility

### Company Onboarding

Fields are categorized into:

* **Manager-only fields** (editable only by BU Manager)
* **BU-editable fields** (editable by BU Users)

Field-level access is configured by Super Admin.

---

## 4.3 Invoice Management

### Invoice Types

#### 1. Regular Invoice

* Created by BU
* No approval required
* Directly submitted
* PDF generated immediately (optional)

#### 2. Carry Invoice

* Invoice amount carried to another company in same group
* Requires multi-level approval

---

### Carry Invoice Workflow

#### State 1: Invoice Creation (BU)

* BU selects original company
* Selects sibling company as carry company
* Submits invoice
* Status → `PENDING_BU_MANAGER_APPROVAL`

#### State 2: BU Manager Approval

* BU Manager reviews invoice
* Adds remarks
* Actions:

  * **Approve** → Status: `PENDING_CARRY_COMPANY_APPROVAL`
  * **Reject** → Status: `REJECTED`

#### State 3: Carry Company Approval

* Carry company user reviews invoice
* Adds remarks
* Actions:

  * **Approve** → Status: `APPROVED`
  * **Reject** → Status: `REJECTED`

#### State 4: Finalization

* PDF generated after final approval
* Approval trail stored permanently

---

### Invoice Statuses

| Status                         | Description               |
| ------------------------------ | ------------------------- |
| DRAFT                          | Invoice not submitted     |
| SUBMITTED                      | Regular invoice submitted |
| PENDING_BU_MANAGER_APPROVAL    | Awaiting BU Manager       |
| PENDING_CARRY_COMPANY_APPROVAL | Awaiting Carry Company    |
| APPROVED                       | Fully approved            |
| REJECTED                       | Rejected at any stage     |

---

## 5. Notification System (Optional but Recommended)

### Notification Types

#### Primary Notifications (Blocking)

* Approval requests
* High-priority alerts

#### Secondary Notifications

* Invoice status updates
* Informational alerts

### Notification Rules

| Role             | Notification              |
| ---------------- | ------------------------- |
| BU Manager       | Carry invoice submitted   |
| Carry Company    | Approved by BU Manager    |
| BU User          | Invoice approved/rejected |
| Original Company | Invoice created           |

---

## 6. Dashboard & Reporting

### Super Admin Dashboard

* Total users
* Total invoices
* Role configurations
* Audit logs

### BU Manager Dashboard

* Company group cards
* Pending approvals
* Invoice statistics

### BU Dashboard

* Assigned companies
* Recent invoices
* Quick invoice creation

### Company Dashboard

* Pending approvals
* Invoice history
* PDF downloads

---

## 7. Database Design (High Level)

### Core Tables

* `users`
* `roles`
* `permissions`
* `business_units`
* `company_groups`
* `companies`
* `invoices`
* `invoice_approvals`
* `notifications`
* `audit_logs`

---

## 8. API Design (Sample)

### Authentication

```
POST /api/auth/login/
POST /api/auth/refresh/
```

### Invoice

```
POST   /api/invoices/
GET    /api/invoices/
GET    /api/invoices/{id}/
POST   /api/invoices/{id}/approve/
POST   /api/invoices/{id}/reject/
```

### Company

```
POST /api/companies/
GET  /api/companies/
```

---

## 9. Security Considerations

* JWT authentication
* Role-based permissions
* Input validation (DRF serializers)
* SQL injection protection (ORM)
* Audit logging for approvals
* Secure environment variables

---

## 10. Deployment Architecture

* **Frontend:** React (Netlify)
* **Backend:** Django (Render)
* **Database:** Neon PostgreSQL

---

## 11. Future Enhancements

* Email notifications
* Invoice templates
* Bulk invoice upload
* Analytics & export reports
* real-time notifications

---

## 12. Conclusion

This system provides a **scalable, secure, and role-driven invoice management platform** suitable for multi-business environments with complex approval workflows.
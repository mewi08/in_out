# Attendance Registration System

# Overview

This is a full-stack Attendance Registration System built with Node.js, Express, MySQL, and Vanilla JavaScript following Clean Architecture principles. The system can be deployed as a web application or packaged as a desktop application using Electron. It provides employee management, attendance tracking, and report generation through a modular and scalable architecture.

---
# Features

- Employee attendance registration and control system.
- Attendance workflow with real-time validations.
- User authentication and administration panel.
- User management and activity logging system.
- Export attendance records and reports.
- Smart UI state management (button locking and validations).
- Modular frontend and backend architecture.
- Clean Architecture with services, controllers, and repositories.
- Frontend-backend communication using Fetch API.
- Responsive web interface built with Bootstrap 5.
- Centralized error handling and modular separation.
---

# Architecture

The project follows a Layered / Clean Architecture approach, separating responsibilities between presentation, business logic, domain, and data access layers.

## Design Principles

- Separation of Concerns
- Repository Pattern
- Service Layer Pattern
- Modular Architecture
- Centralized Error Handling


## Project Structure

```
├── src/                            # REST API (Node.js + Express + MySQL)
│   ├── modules/
│   │   ├── users/                  # Users module
│   │   │   ├── app/                # Business logic (services)
│   │   │   ├── domain/             # Models
│   │   │   ├── infrastructure/     # Repositories (DB queries)
│   │   │   ├── schemas/            # Validation rules
│   │   │   ├── users.controller.js # Handles request 
│   │   │   └── users.routes.js     # Endpoints
│   │   ├── auth/                   # Auth module
│   │   ├── activity_log/           # Activity Log module
│   │   ├── work_area/              # Work area module
│   │   └── attendance/             # Attendance module
│   ├── shared/
│   │   ├───core/
│   │   │    ├─── error/            # Error handling
│   │   │    └─── http/             # HTTP responses 
│   │   ├── infrastructure/         # DB connection, logger
│   │   ├── middleware/             # Auth, validation, guards
│   │   └── utils/                  # Shared utilities
│   │        └─── validator/        # Validation 
│   └── app.js                      # Express app setup
│
└── public/                         # Frontend (Vanilla JS)
    ├── Bootstrap                   # Frontend framework (locally included assets)
    ├── js/
    │   ├── users/
    │   │   ├── app/                # API service calls
    │   │   └── ui/                 # DOM controllers
    │   ├── activity_log/
    │   │   ├── app/
    │   │   └── ui/
    │   ├── admin/
    │   │   ├── app/
    │   │   └── ui/
    │   ├── auth/
    │   │   ├── app/
    │   │   └── ui/
    │   ├── work_area/
    │   │   ├── app/
    │   │   └── ui/
    │   ├── attendance/
    │   │   ├── app/
    │   │   └── ui/
    │   ├── shared/                 # Clock, HTTP client, UI helpers
    │   └── main.js                 # Entry point
    ├── pages/                      # HTML pages
    │   ├── users/
    │   ├── admin/
    │   └── attendance/
    ├── partials/                   # HTML sidebar
    ├── index.html                  # Index
    └── css/                        # Per-page stylesheets

```

---

# Modules

## Auth

- Authentication.
- Credential validation.
- Route protection.

---

## Attendance

- Attendance registration workflow
- Duplicate attendance prevention
- Daily attendance tracking
- Export records

---

## Users

- User management
- Profile administration
- Status control

---

## Activity Log

- System activity tracking
- Audit history
- Administrative action records

---

## Work Area

- Work area management
- Register work areas
- Status control

---

# Architecture Flow

```text
Frontend (Vanilla JS)
   ↓
API Client (Fetch)
   ↓
Express Routes
   ↓
Controllers
   ↓
Services (Business Logic)
   ↓
Repositories (Database Access)
   ↓
MySQL Database
```

---

# Technologies

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MySQL |
| Frontend | Vanilla JavaScript, CSS3, Bootstrap 5 |
| Desktop | Electron |
| Validation | Zod |
| Security | Helmet |
| Date Handling | Luxon |
| Export | ExcelJS |


# Installation

## Requirements

- Node.js v18+
- XAMPP
- npm

---
## Database Setup

Make sure XAMPP is running and the MySQL service is started before running the project.

### Using XAMPP MySQL Console

1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL**
3. Open **XAMPP Shell**
4. Enter MySQL:

```bash
mysql -u root
```
5. Create the database:

```bash
CREATE DATABASE db_name;
```
6. Select the database;

```bash
USE db_name;
```
---

## Setup

```bash
# Clone repository
git clone [url-repo]
cd [folder-name]

# Install dependencies
npm install

# Configure environment variables
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env

# Create database and tables
npm run db:setup

# Create admin
npm run create-admin

# Start server
npm run dev

```
---
# Scripts

```bash
npm run dev            # Start development server
npm run start          # Start production server
npm run db:setup       # Initialize database
npm run create-admin   # Create admin user
npm run electron       # Run desktop application
npm run dist           # Build installer

```
---

# Usage

## Employee Registration

Route:

```text
/public/pages/users/register_profile.html
```

## Attendance Registration

Route:

```text
/public/pages/attendance/register_attendance.html
```
Workflow:
1. Select Check In or Check Out.
2. Enter personal code.
3. System validates and registers attendance.
---

# API Endpoints

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user` | Create user |
| GET | `/api/user/:id` | Search by id |
| GET | `/api/user/public` | Active users only |
| GET | `/api/user/private` | All users |
| GET | `/api/user/stats` | User statistics |
| GET | `/api/user/code/:code` | Search by code |
| PUT | `/api/user/:id` | Update user |
| PATCH | `/api/user/:id/status` | Change status |

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Register check in/out |
| GET | `/api/attendance/today-status/:user_id` | Current status |
| GET | `/api/attendance/daily-report` | Daily report |
| GET | `/api/attendance/export` | Export all records |
| GET | `/api/attendance/export/:user_id` | Export by user |

---

## Activity Log

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activity-logs/recent` | Activity logs |

---

## Work Area

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/work-area` | Register work area |
| GET | `/api/work-area/` | All work area |
| GET | `/api/work-area/:id` | Search by id |
| PATCH | `/api/work-area/:id` | Update work area |
| PATCH | `/api/work-area/:id/status` | Change status |

---

# Validations

## Frontend

- Form validation
- UI state control
- Required fields validation

## Backend

- Input validation with Zod
- Unique user code validation
- Attendance workflow validation
- Prevent duplicate check-ins
- Authentication validation
- Status validation (active/inactive)
- Route parameter validation

---

# Desktop Application
The system can be executed as a desktop application using Electron.

```bash
npm run electron       # Run desktop application

```
To generate an installer:

```bash
npm run dist           # Build installer

```
Generated files are located in:

```text
/dist
```

---

# Environment Variables

```env
# server
PORT=
NODE_ENV=

# db
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=

# administrator
ADMIN_NAME=
ADMIN_LAST_NAME=
ADMIN_DNI=
ADMIN_CATEGORY=
ADMIN_WORK_AREA=
ADMIN_CODE=
ADMIN_ROLE=
```

---

# Auditing

The system records key actions such as:

- User creation
- User updates
- Status changes
- Attendance registration
- Administrative operations

---

# Security
- JWT-based authentication
- Input validation with Zod
- Centralized error handling
- Protected API routes
- Secure HTTP headers with Helmet

---

# Scalability
The modular architecture allows:

- Easy addition of new modules
- Reusable components
- Cleaner maintenance
- Better scalability

---

# Author

Developed by Melanie Tello

# License

This project is licensed under the ISC License.

# Attendance Registration System

Web system for employee registration and entry/exit control with clean architecture.

---
# Features

- Employee attendance registration and control system.
- 3-step attendance workflow with real-time validations.
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

## Design Design Principles

- Separation of Concerns
- Repository Pattern
- Service Layer Pattern
- Modular Architecture
- Centralized Error Handling

El sistema está organizado en módulos independientes para facilitar el mantenimiento y escalabilidad.

## Estructura General

```
├── src/                            # REST API (Node.js + Express + MySQL)
│   ├── modules/
│   │   ├── users/                  # Users module
│   │   │   ├── app/                # Business logic (services)
│   │   │   ├── domain/             # Models & validation rules
│   │   │   ├── infrastructure/     # Repositories (DB queries)
│   │   │   ├── users.controller.js # Handles request 
│   │   │   └── users.routes.js     # Endpoints
│   │   ├── auth/                   # Auth module
│   │   ├── activity_log/           # Activity Log module
│   │   └── attendance/             # Attendance module
│   ├── shared/
│   │   ├───core/
│   │   │    ├───error/             # Error handling
│   │   │    └───http/              # HTTP responses 
│   │   ├── infrastructure/         # DB connection, logger
│   │   ├── middleware/             # Auth, validation, guards
│   │   └── utils/                  # Time formatting, generate Excel
│   └── app.js                      # Express app setup
│
├── public/                         # Frontend (Vanilla JS)
│   ├── Bootstrap                   # Frontend framework (locally included assets)
│   ├── js/
│   │   ├── users/
│   │   │   ├── app/                # API service calls
│   │   │   └── ui/                 # DOM controllers
│   │   ├── activity_log/
│   │   │   ├── app/
│   │   │   └── ui/
│   │   ├── admin/
│   │   │   ├── app/
│   │   │   └── ui/
│   │   ├── auth/
│   │   │   ├── app/
│   │   │   └── ui/
│   │   ├── attendance/
│   │   │   ├── app/
│   │   │   └── ui/
│   │   ├── shared/                 # Clock, HTTP client, UI helpers
│   │   └── main.js                 # Entry point
│   └── css/                        # Per-page stylesheets
│
└── views/                          # HTML pages
    ├── pages/
    │   ├── users/
    │   ├── admin/
    │   └── attendance/
    ├── partials/
    └── index.html

```

---

# Modules

## Auth
- Authentication.
- Credential validation.
- Route protection.

---

## Attendance

- Check in / Check out workflow
- Attendance validation
- Daily reports
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

---

# Architecture Flow

```text
Frontend UI
   ↓
Frontend Controllers 
   ↓
HTTP Client
   ↓
Backend Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Database
```

---

# Tecnologías Utilizadas

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MySQL |
| Frontend | Vanilla JavaScript, CSS3, Bootstrap 5 |
| Architecture | Clean Architecture / Layered Architecture |


# Installation

## Requirements

- Node.js v18+
- MySQL Server
- npm

---

# Instalación

```bash
# Clone repository
git clone [url-repo]
cd [folder-name]

# Install dependencies
npm install

# Configure environment variables
copy .env.example .env
# Edit .env with your MySQL credentials

# Create database and tables
npm run db:setup

# Create admin
npm run create-admin

# Start server
npm run dev

```
---

# Usage

## Employee Registration

Route:

```text
/pages/users/register_profile.html
```

## Attendance Registration

Route:

```text
/pages/attendance/register_attendance.html
```
Workflow
1. Select Check In or Check Out.
2. Enter personal code.
3. System validates and registers attendance.
---

# API Endpoints

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user` | Create user |
| GET | `/api/user/public` | Active users only |
| GET | `/api/user/private` | All users |
| GET | `/api/user/stats` | User statistics |
| GET | `/api/user/code/:code` | Search by code |
| GET | `/api/user/dni/:dni` | Search by DNI |
| PUT | `/api/user/:id` | Update user |
| PATCH | `/api/user/:id/status` | Change status |

---

## Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Register check in/out |
| GET | `/api/attendance/today-hours/:user_id` | Today’s hours |
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

# Validaciones

## Frontend

- Validación de formularios.
- Control de estados UI.
- Bloqueo de botones.
- Validación de código.
- Validación de campos requeridos.

## Backend

- Código único por usuario.
- Prevención de check-out sin check-in.
- Prevención de registros duplicados.
- Manejo centralizado de errores.
- Validación de autenticación.

---

# Variables de Entorno

```env
# Servidor
PORT=
NODE_ENV=

# Base de datos
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=

# Administrador
ADMIN_NAME=
ADMIN_LAST_NAME=
ADMIN_DNI=
ADMIN_CATEGORY=
ADMIN_WORK_AREA=
ADMIN_CODE=
ADMIN_ROLE=
```

---

# Security
- Authentication middleware
- Protected routes
- Centralized HTTP responses
- Access validation

---

# Scalability
The modular architecture allows:

- Easy addition of new modules
- Reusable components
- Cleaner maintenance
- Better scalability

---

## License

MIT License - Free for personal and commercial use.

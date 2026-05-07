# Attendance Registration System

Web system for employee registration and entry/exit control with clean architecture.

## Architecture

```
├── src/                        # REST API (Node.js + Express + MySQL)
│   ├── modules/
│   │   ├── users/              # Users module
│   │   │   ├── app/            # Business logic (services)
│   │   │   ├── domain/         # Models & validation rules
│   │   │   ├── infrastructure/ # Repositories (DB queries)
│   │   │   ├── users.controller.js # Handles request 
│   │   │   └── users.routes.js  #Endpoints
│   │   ├── auth/               # Auth module
│   │   └── attendance/         # Attendance module
│   ├── shared/
│   │   ├───core/
│   │   │    ├───error/         # Error handling
│   │   │    └───http/          # HTTP responses 
│   │   ├── infrastructure/     # DB connection, logger
│   │   ├── middleware/         # Auth, validation, guards
│   │   └── utils/              # Time formatting, generate Excel
│   └── app.js                  # Express app setup
│
├── public/                     # Frontend (Vanilla JS)
│   ├── Bootstrap               # Frontend framework (locally included assets)
│   ├── js/
│   │   ├── users/
│   │   │   ├── app/            # API service calls
│   │   │   └── ui/             # DOM controllers
│   │   ├── attendance/
│   │   │   ├── app/
│   │   │   └── ui/
│   │   ├── shared/             # Clock, HTTP client, UI helpers
│   │   └── main.js             # Entry point
│   └── css/                    # Per-page stylesheets
│
└── views/                      # HTML pages
    ├── pages/
    │   ├── users/
    │   └── attendance/
    └── index.html

```

## Technologies

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MySQL |
| Frontend | Vanilla JavaScript, CSS3, Bootstrap (locally included) |
| Architecture | Clean Architecture / Layered Architecture |


## Installation

```bash
# Clone repository
git clone [url-repo]
cd [folder-name]

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# Create database and tables
npm run db:setup

# Start server
npm run dev

```

## Usage

### 1. Employee Registration
- Go to `/pages/users/register_profile.html`
- Complete: Name, Last Name, DNI (8 digits), Category, Work Area, Code, Role (system)

### 2. Mark Attendance
- Go to `/pages/attendance/register_attendance.html`
- **Step 1**: 
  - Click **Check In** → starts shift (locks button)
  - Click **Check Out** → ends shift (locks button)
- **Step 2**: 
  - User enters personal code 
  - System validates automatically
- **Step 3**: 
  - Displays user info
  - Confirms attendance record


## API Endpoints

### Users
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

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Register check in/out |
| GET | `/api/attendance/today-hours/:user_id` | Today’s hours |
| GET | `/api/attendance/today-status/:user_id` | Current status |
| GET | `/api/attendance/daily-report/` | Daily report |
| GET | `/api/attendance/export/` | Export all records |
| GET | `/api/attendance/export/:dni` | Export by user |

### Attendance Request Body
```json
{
  "code": "15",
  "type": "check_in"
}
```

## Key Features

- 3-step attendance workflow for intuitive tracking
- Real-time validations (code, required fields)
- Clean Architecture with modular separation
- Centralized error handling system
- Smart UI state management (button locking)

## Validations

### Frontend
- Code validation (format controlled) 
- Required fields validation
- UI state control (lock/unlock buttons)

### Backend
- Unique constraint on user code
- Prevent check-out without check-in
- Prevent duplicate check-ins

## Environment Variables (.env)

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## License

MIT License - Free for personal and commercial use.

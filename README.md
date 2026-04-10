# Attendance Registration System

Web system for employee registration and entry/exit control with clean architecture.

## Architecture

```
├── backend/           # REST API (Node.js + Express + MySQL)
│   ├── src/
│   │   ├── users/          # Users module
│   │   │   ├── app/        # Business logic (services)
│   │   │   ├── domain/     # Models and domain rules
│   │   │   ├── infrastructure/  # Repositories (DB)
│   │   │   └── files       # Controllers and routes
│   │   ├── attendance/     # Attendance module
│   │   └── shared/         # Utilities, middlewares, DB config
│   └── package.json
│
└── frontend/          # Web application (Vanilla JS)
    ├── js/
    │   ├── users/           # Users module
    │   │   ├── app/         # Services (API calls)
    │   │   └── ui/          # Controllers (DOM)
    │   ├── attendance/      # Attendance module
    │   │   ├── app/         # Services
    │   │   └── ui/          # Controllers
    │   └── shared/          # Utilities, HTTP client, UI helpers
    ├── css/
    └── pages/
```

## Technologies

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, MySQL |
| Frontend | Vanilla JavaScript, CSS3 |
| Architecture | Clean Architecture / Layered Architecture |


## Instalación

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
- Complete: First Name, Last Name, ID Number (8 digits), Category, Work Area
- The ID is automatically saved for the next step

### 2. Mark Attendance
- Go to `/pages/attendance/attendance.html`
- **Step 1**: Enter your ID → Automatic validation
- **Step 2**: Verify your personal information
- **Step 3**: 
  - Click **Check In** → Gets locked, enables Check Out
  - Click **Check Out** → Gets locked, end of shift



## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user` | Create user |
| GET | `/api/user/code/:code` | Search by ID |
| GET | `/api/user` | List all |
| PUT | `/api/user/:id` | Update user |
| PATCH | `/api/user/:id/status` | Change status |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Register check in/out |
| GET | `/api/attendance/today-hours/:user_id` | Hours worked today |

### Attendance Request Body
```json
{
  "entered_code": "11223344",
  "type": "check_in"
}
```

## Detailed Folder Structure

```
inout/
├── public/
│       ├── css/
│       │     ├── attendance.style.css
│       │     ├── index.style.css
│       │     └── register_profile.style.css
│       │     
│       └── js/
│            ├── attendance/
│            │   ├── app/
│            │   │   └── attendance.service.js
│            │   └── ui/
│            │       └── attendance.controller.js
│            ├── users/
│            │   ├── app/
│            │   │   └── users.service.js
│            │   └── ui/
│            │       └── users.controller.js
│            ├── shared/
│            │   ├── clock.js
│            │   ├── http.client.js 
│            │   └── message.ui.js
│            └── main.js
│   
├── src/
│     ├── modules/
│     │     ├── attendance/
│     │     │   ├── app/
│     │     │   │   └── attendance.service.js
│     │     │   ├── domain/
│     │     │   │   ├── attendance.model.js
│     │     │   │   └── attendance.validator.js
│     │     │   ├── infrastructure/
│     │     │   │   └── attendance.repository.js
│     │     │   ├── attendance.controller.js
│     │     │   └── attendance.routes.js
│     │     └── users/
│     │         ├── app/
│     │         │   └── users.service.js
│     │         ├── domain/
│     │         │   ├── users.model.js
│     │         │   └── users.validator.js
│     │         ├── infrastructure/
│     │         │   └── users.repository.js
│     │         ├── users.controller.js
│     │         └── users.routes.js    
│     ├── shared/
│     │   ├── infrastructure/
│     │   │   └── database.js
│     │   ├── middleware/
│     │   │   ├── exists.middleware.js
│     │   │   └── param.middleware.js
│     │   └── utils/
│     │       ├── logger.js
│     │       ├── response.js
│     │       └── formattedTime.js
│     └── app.js
├── views/
│   ├──  pages/
│   │   ├── attendance/
│   │   │   └── register_attendance.html
│   │   └── users/
│   │       └── register_profile.html
│   └── index.html
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── READNE.md
└── server.js

```

## Key Features

- ✅ **3-step wizard** for intuitive attendance tracking
- ✅ **Real-time validations** (8-digit ID, required fields)
- ✅ **Smart button locking** (prevents double check in/out)
- ✅ **Temporary persistence** with sessionStorage
- ✅ **Clean architecture** separated into layers
- ✅ **Error handling** with descriptive messages

## 🛡️ Validations

### Frontend
- ID: exactly 8 numeric digits
- Required fields in registration
- UI button locking based on state

### Backend
- Unique ID in database
- Does not allow check out without previous check in
- Does not allow check in without previous check out

## Environment Variables (.env)

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

## License

MIT License - Free for personal and commercial use.

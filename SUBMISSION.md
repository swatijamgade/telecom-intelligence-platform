# Telecom Intelligence Platform - Submission

## Dataset Source
- Google Sheet (primary):
  - https://docs.google.com/spreadsheets/d/1kqnCdclcGpnaVWUXO8BH1BFQtbwVJInqHDji-unrwRc/edit?usp=sharing
- Google Drive file (reference):
  - https://drive.google.com/file/d/1vDzCqWsUSMSPB0OoWHo1M693fl9YWjHG/view?usp=sharing
- Local fallback CSV:
  - `mock_cdr.csv`

## Service Ports
- Frontend (Vite): `http://localhost:5173`
- Backend API (FastAPI): `http://localhost:5000`
- PostgreSQL: `localhost:5432`

## Run The Full Stack (Recommended)
From project root:

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

---

## Backend

### Source
- Folder: `backend/`

### Tech
- FastAPI + SQLAlchemy + Alembic + PostgreSQL
- JWT auth + bcrypt password hashing

### API Base
- `http://localhost:5000/api/v1`

### API Docs
- Swagger: `http://localhost:5000/docs`
- OpenAPI JSON: `http://localhost:5000/openapi.json`

### Main Endpoints
- Auth
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/users` (admin only)
  - `POST /api/v1/auth/users` (admin only)
  - `DELETE /api/v1/auth/users/{user_id}` (admin only)
- CDR
  - `GET /api/v1/cdr/`
- Analytics
  - `GET /api/v1/analytics/summary`

### Local Backend Run (without Docker backend)
Use Docker DB only:

```bash
docker compose up -d db
```

Then run backend locally:

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Note:
- For local backend mode, `backend/.env` should use `localhost` DB host.

---

## Frontend

### Source
- Folder: `frontend/`

### App URL
- `http://localhost:5173`

### Features Implemented
- Login + Signup UI integrated with backend auth
- Role-based UI:
  - Admin: Dashboard, Users, Settings, API Reference
  - Analyst: Dashboard, Settings
- User Management (Admin):
  - View users from DB
  - Add users (admin/analyst role)
  - Remove users
- Dashboard uses:
  - Google Sheet single-sheet data source
  - Local `mock_cdr.csv` fallback if sheet fails
- Light/Dark mode toggle
- Updated pagination format and redesigned dashboard theme

### Local Frontend Run (without Docker frontend)
```bash
cd frontend
npm install
npm run dev
```

---

## Admin Credentials

Bootstrap script (in project):
- `backend/tests/unit/admin_user.py`

Default admin credentials used by that script:
- Email: `admin@example.com`
- Password: `Admin@12345`

To create/promote admin (run once):

```bash
cd backend
source .venv/bin/activate
python3 tests/unit/admin_user.py
```

Security note:
- Change admin password before production use.

---

## Authentication Flow Demo (cURL)

### 1) Signup Analyst
```bash
curl -sS -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Demo Analyst",
    "email":"demo.analyst@example.com",
    "password":"Password@123",
    "role":"analyst"
  }'
```

### 2) Login
```bash
curl -sS -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo.analyst@example.com",
    "password":"Password@123"
  }'
```

### 3) Access Protected Profile
Replace `<ACCESS_TOKEN>` with the login token.
```bash
curl -sS http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

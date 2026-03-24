# Telecom Intelligence Platform - Submission Checklist

## Mock CDR Data
- Google Sheet dataset:
  - https://docs.google.com/spreadsheets/d/1kqnCdclcGpnaVWUXO8BH1BFQtbwVJInqHDji-unrwRc/edit?usp=sharing
- Google Drive dataset:
  - https://drive.google.com/file/d/1vDzCqWsUSMSPB0OoWHo1M693fl9YWjHG/view?usp=sharing

## 1) Backend Code Repository
- Backend source folder: `backend/`
- Run backend + DB:
  ```bash
  docker compose up -d --build
  ```
- API docs:
  - http://localhost:5000/docs

## 2) Frontend Integrated Application
- Frontend source folder: `frontend/`
- Run frontend:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- Open app:
  - http://localhost:5173

## 3) API Endpoint
- Base URL:
  - `http://localhost:5000/api/v1`
- Main endpoints:
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `GET /api/v1/cdr/`
  - `GET /api/v1/analytics/summary`

## 4) Demonstration of Authentication Flow

### A) Signup
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

### B) Login
```bash
curl -sS -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo.analyst@example.com",
    "password":"Password@123"
  }'
```

### C) Access Protected Route (`/auth/me`)
Replace `<ACCESS_TOKEN>` with the token from login response.
```bash
curl -sS http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

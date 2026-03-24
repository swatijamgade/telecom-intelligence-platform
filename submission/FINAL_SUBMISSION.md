# Final Submission - Telecom Intelligence Platform

## Mock CDR Data
- https://drive.google.com/file/d/1vDzCqWsUSMSPB0OoWHo1M693fl9YWjHG/view?usp=drive_link

## 1. Backend Code Repository
- Repository: https://github.com/swatijamgade/telecom-intelligence-platform
- Backend folder: `backend/`
- Backend docs endpoint: http://localhost:5000/docs

## 2. Frontend Integrated Application
- Frontend folder: `frontend/`
- Integrated app URL (local): http://localhost:5173
- Frontend is integrated with backend APIs (`/api/v1`) via Vite proxy and JWT auth flow.

## 3. API Endpoint
- Base API URL: `http://localhost:5000/api/v1`
- Implemented endpoints:
  - `POST /api/v1/auth/signup`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `GET /api/v1/cdr/`
  - `GET /api/v1/analytics/summary`

## 4. Demonstration of Authentication Flow
- Authentication demonstration was executed and stored as evidence files:
  - [auth-signup-response.json](/home/swati/projects/telecom-intelligence-platform/submission/evidence/auth-signup-response.json)
  - [auth-login-response.json](/home/swati/projects/telecom-intelligence-platform/submission/evidence/auth-login-response.json)
  - [auth-me-response.json](/home/swati/projects/telecom-intelligence-platform/submission/evidence/auth-me-response.json)
  - [auth-demo-meta.txt](/home/swati/projects/telecom-intelligence-platform/submission/evidence/auth-demo-meta.txt)

### Auth Demo Summary
- Signup: success (201 style payload with user + token)
- Login: success (user + bearer token returned)
- Protected route `/auth/me`: success with JWT bearer token

## Additional Requested Features

### A) Searching + Pagination Actions
- Search filters are connected end-to-end (frontend -> API query params -> DB filtering):
  - frontend request builder: [telecomService.ts](/home/swati/projects/telecom-intelligence-platform/frontend/src/services/telecomService.ts)
  - backend filter logic (`ilike` on caller/receiver/city/location): [repository.py](/home/swati/projects/telecom-intelligence-platform/backend/app/modules/cdr/repository.py)
  - paginated endpoint: [cdr.py](/home/swati/projects/telecom-intelligence-platform/backend/app/api/v1/endpoints/cdr.py)
- Frontend pagination controls + actions are implemented in:
  - [DashboardPage.tsx](/home/swati/projects/telecom-intelligence-platform/frontend/src/pages/DashboardPage.tsx)
- Search/pagination API evidence:
  - [search-cdr-page1.json](/home/swati/projects/telecom-intelligence-platform/submission/evidence/search-cdr-page1.json)
  - [search-cdr-page2.json](/home/swati/projects/telecom-intelligence-platform/submission/evidence/search-cdr-page2.json)
  - [search-pagination-meta.txt](/home/swati/projects/telecom-intelligence-platform/submission/evidence/search-pagination-meta.txt)

### B) bcrypt Password Hashing
- Password hashing and verification use `bcrypt` in:
  - [security.py](/home/swati/projects/telecom-intelligence-platform/backend/app/core/security.py)
- User signup stores hashed password in DB through auth service:
  - [service.py](/home/swati/projects/telecom-intelligence-platform/backend/app/modules/auth/service.py)
- bcrypt proof file:
  - [bcrypt-proof.json](/home/swati/projects/telecom-intelligence-platform/submission/evidence/bcrypt-proof.json)

## Notes
- Services validated during submission preparation:
  - Backend health: `http://localhost:5000/health` -> `{"status":"ok","environment":"dev"}`
  - Frontend health: `http://localhost:5173` -> HTTP `200`

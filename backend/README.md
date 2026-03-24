# Telecom Intelligence Platform - Backend

## Run with Docker Compose

From project root:

```bash
docker compose up --build
```

API endpoints:

- Health: `http://localhost:5000/health`
- Root: `http://localhost:5000/`
- Docs: `http://localhost:5000/docs`
- OpenAPI JSON: `http://localhost:5000/openapi.json`

## API Prefix

All application APIs are under:

- `/api/v1/auth`
- `/api/v1/cdr`
- `/api/v1/analytics`

## Auth Flow

1. `POST /api/v1/auth/signup`
2. `POST /api/v1/auth/login`
3. Use `Authorization: Bearer <token>` for protected routes.

## Migrations

```bash
cd backend
cp .env.example .env
alembic upgrade head
```

## Seed Mock CDR Data

When dashboard metrics show zero, populate demo CDR rows:

```bash
docker compose exec backend python -m app.db.seed --records 1200
```

To reseed from scratch:

```bash
docker compose exec backend python -m app.db.seed --records 1200 --force
```

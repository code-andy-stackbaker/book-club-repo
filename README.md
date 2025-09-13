
Book Club — Full-Stack App

A small book club application with a NestJS + TypeScript API and a React (Vite) + TailwindCSS frontend. Postgres runs via Docker Compose. Built for clarity, maintainability, and a smooth developer experience.

⸻

Table of Contents
	•	Stack
	•	Repository Layout
	•	Quickstart (Local)
	•	Environment Variables
	•	Scripts (Cheat Sheet)
	•	API Summary
	•	UI Routes
	•	Testing
	•	Troubleshooting
	•	Submission Checklist
	•	Appendix: docker-compose

⸻

Stack
	•	Database: Postgres (Docker)
	•	Backend: NestJS (TypeScript, Prisma), validation & error handling, health endpoints, Swagger
	•	Frontend: React (Vite), TailwindCSS, Axios, React Router, lightweight toast notifications
	•	DX: environment-smart API base selection, Vite dev proxy, minimal Jest e2e for health checks

⸻

Repository Layout

.
├─ backend/                # NestJS API (TypeScript, Prisma, Jest)
├─ frontend/               # React app (Vite, TailwindCSS)
└─ docker-compose.yml      # Postgres (seeded db/user/password)


⸻

# Quickstart (Local)

Environment Variables

Do not commit .env files. The values below are examples for local/dev.

Backend 

Sample .env for local backend below :


(backend/.env) Sample


PORT=3000

NODE_ENV=development

CORS_ORIGIN=http://localhost:5173

DATABASE_URL="postgresql://bookclub:bookclub@localhost:5432/bookclub?schema=public"


Frontend (frontend/.env) below — optional

VITE_API_URL	https://api.example.com	Optional override. If unset, the app infers by hostname then falls back same-origin.


frontend/.env) Sample :

VITE_API_URL=http://localhost:3000



Prereqs: Node.js 18+, npm, Docker, Docker Compose.
Ports: 5432 (Postgres), 3000 (API), 5173 (Web).

1) Start Postgres (Docker)

   

docker compose up -d

# Postgres 16 on :5432 with db/user/password = bookclub / bookclub / bookclub

Data persists in the named volume db_data. The healthcheck waits for readiness.

2) Backend (NestJS API)

cd backend

npm i

npm run generate         # Prisma client

npm run migrate:dev      # create tables

npm run seed             # optional: sample authors & books

npm run start:dev        # http://localhost:3000

	•	Swagger: http://localhost:3000/docs
	•	Health: GET /api/healthz → { ok: true }, GET /api/readyz → { ready: true }

3) Frontend (React + Vite)


cd frontend

npm i

npm run dev              # http://localhost:5173

No local .env is required. In dev, the app calls same-origin /api and Vite proxies to http://localhost:3000.


⸻

Scripts (Cheat Sheet)

Backend

npm run dev            # Nest watch mode
npm run build          # Compile to dist
npm run start:prod     # Run compiled app
npm run generate       # Prisma generate
npm run migrate        # Prisma migrate deploy
npm run migrate:dev    # Prisma migrate dev (local)
npm run seed           # Seed data via prisma/seed.ts
npm test               # Jest tests
npm run test:watch
npm run test:cov

Frontend

npm run dev            # Vite dev on :5173
npm run build          # Production build
npm run preview        # Preview the build locally


⸻

API Summary

Authors

Method	Path	Body (JSON)	Notes
GET	/api/authors	—	List authors
GET	/api/authors/:id	—	Author detail
POST	/api/authors	{ "name": "…", "bio"?: "…" }	Create
PATCH	/api/authors/:id	{ "name"?: "…", "bio"?: "…" }	Update (partial)
DELETE	/api/authors/:id	—	Delete

Books

Method	Path	Body (JSON)	Notes
GET	/api/books	—	List (includes author)
GET	/api/books/:id	—	Detail (includes author)
POST	/api/books	{ "title": "…", "authorId": "uuid", "description"?: "…", "publishedYear"?: 2024 }	Create
PATCH	/api/books/:id	Same fields as POST (all optional)	Update (partial)
DELETE	/api/books/:id	—	Delete

Validation & errors
	•	400 Bad Request on invalid payloads (e.g., non-UUID authorId, missing required fields)
	•	404 Not Found when an entity is missing
	•	Prisma errors mapped to user-friendly messages

Data Model

authors: id (uuid), name (string), bio (string?),
         createdAt (timestamp), updatedAt (timestamp)

books:   id (uuid), title (string), authorId (uuid FK->authors.id),
         description (string?), publishedYear (int?),
         createdAt (timestamp), updatedAt (timestamp)

<details>
<summary><strong>cURL sanity checks</strong></summary>


# health
curl -s http://localhost:3000/api/healthz | jq .
curl -s http://localhost:3000/api/readyz | jq .

# authors (list)
curl -s http://localhost:3000/api/authors | jq .

# authors (create)
curl -s -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Octavia E. Butler","bio":"American science fiction author"}' | jq .

# books (create — set AUTHOR_ID to a real UUID from authors list)
AUTHOR_ID="<paste-author-uuid>"
curl -s -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Kindred\",\"authorId\":\"$AUTHOR_ID\",\"publishedYear\":1979}" | jq .

</details>



⸻

UI Routes
	•	Authors:
/authors, /authors/new, /authors/:id, /authors/:id/edit
	•	Books:
/books, /books/new, /books/:id, /books/:id/edit

UX: loading and empty states, inline form validation, error alerts, success/error toasts.

⸻

Testing
	•	Jest + ts-jest configured for TypeScript.
	•	Health e2e test (does not touch DB) to verify bootstrapping fast.

cd backend
npm test


⸻

Troubleshooting
	•	Ports busy: stop other Postgres/Node processes or adjust ports.
	•	Prisma migration errors: ensure DB is up; then:

cd backend
npm run migrate:dev

Fresh start:

docker compose down -v   # removes db_data volume
docker compose up -d
cd backend && npm run migrate:dev && npm run seed


	•	CORS in dev: the Vite proxy keeps calls same-origin; CORS_ORIGIN is set for safety.
	•	Frontend cannot reach API (staging/prod): set VITE_API_URL explicitly and rebuild.

⸻

Submission Checklist
	•	Docker Compose with Postgres and seeded defaults
	•	Backend (NestJS + TS) with Prisma, validation, and 400/404 handling
	•	Authors & Books CRUD endpoints
	•	Frontend (React + Vite + Tailwind) with full CRUD flows
	•	UX: loading, empty states, inline validation, toasts
	•	Migrations + type-safe query layer (Prisma)
	•	Liveness/Readiness endpoints
	•	README (this) with setup, env, and run instructions end-to-end

⸻

Appendix: docker-compose

version: "3.9"
services:
  db:
    image: postgres:16-alpine
    container_name: bookclub_db
    environment:
      POSTGRES_DB: bookclub
      POSTGRES_USER: bookclub
      POSTGRES_PASSWORD: bookclub
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bookclub -d bookclub"]
      interval: 5s
      timeout: 5s
      retries: 20

volumes:
  db_data:


⸻

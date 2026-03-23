# AI Document Workflow

A full-stack document workflow platform designed to organize business documents, streamline review processes, and enrich records with AI-assisted analysis.

## Project Purpose

This application was built to demonstrate practical full-stack engineering skills in a realistic business context.  
The core objective is to provide a structured environment where teams can:

- register and authenticate users,
- centralize document management,
- apply role-based governance for approvals,
- and accelerate document understanding with AI-generated support.

## What You Can Do With This Application

- Create, read, update, and delete business documents.
- Upload PDF files and auto-extract text content into the document form.
- Generate concise AI summaries from document text.
- Request AI-based category suggestions (`Invoice`, `Contract`, `Report`, `HR`).
- Manage personal profile data and password updates.
- Enforce role-based workflows:
  - `USER` can manage personal documents.
  - `CEO` can view all documents and control status transitions (`Draft`, `Review`, `Approved`, `Rejected`).

## Technology Stack

### Frontend

- Vue 3 (Composition API + TypeScript)
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- `pdfjs-dist` for in-browser PDF text extraction

### Backend

- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- Zod for input validation
- CORS + JSON REST APIs

### AI Integration

- Local LLM inference via Ollama
- Configurable model and endpoint through environment variables
- Dedicated endpoints for summarization and category suggestion

## System Architecture

- `client/`: single-page frontend application for authentication, dashboards, document operations, and profile management.
- `server/`: REST API handling authentication, authorization, document lifecycle, and AI services.
- `server/prisma/schema.prisma`: data model definitions for `User`, `Session`, and `Document`.

## Main Functional Areas

### Authentication and Authorization

- Account registration and login
- Token-based session handling
- Protected routes on frontend and backend
- Role-aware permissions for sensitive actions (status management)

### Document Workflow

- Structured metadata (`title`, `description`, `category`, `status`)
- Ownership control to ensure users only access allowed records
- Audit-friendly timestamps (`createdAt`, `updatedAt`)

### AI-Assisted Processing

- Document summary generation
- Category recommendation to standardize classification
- Input normalization and length limits before AI inference

## Local Development Setup

### 1) Clone and install dependencies

```bash
git clone <your-repository-url>
cd ai-document-workflow

cd server && npm install
cd ../client && npm install
```

### 2) Prepare database

From `server/`:

```bash
npx prisma generate
npx prisma db push
```

### 3) Start services

In separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

### 4) Open the application

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/profile`
- `POST /auth/verify-password`
- `PUT /auth/change-password`

### Documents (authenticated)

- `GET /documents`
- `GET /documents/:id`
- `POST /documents`
- `PUT /documents/:id`
- `DELETE /documents/:id`

### AI (authenticated)

- `POST /ai/summarize`
- `POST /ai/suggest-category`

## Engineering Notes

- The application uses a clear separation between UI, state management, API services, and persistence logic.
- Validation is handled explicitly on the backend using Zod schemas.
- The AI module is isolated to dedicated service endpoints to keep business logic clean and maintainable.

## Suggested Future Improvements

- Add password hashing and stronger security hardening.
- Add automated test coverage (unit, integration, and e2e).
- Introduce CI pipelines (lint, type-check, tests, build).
- Add observability (structured logs, metrics, health checks).

## Author

Nelson Ribeiro  
Full-stack developer project portfolio piece focused on applied business workflows and AI-assisted product features.

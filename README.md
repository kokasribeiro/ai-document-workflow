# AI Document Workflow

A full-stack document management platform with role-based approval workflows, real-time notifications, and AI-assisted document processing. Built with Vue 3, Node.js, and PostgreSQL.

---

## What Does This App Do?

In most companies, documents like invoices, contracts, reports, and HR files go through a manual review process — someone creates a document, sends it for approval, and waits for feedback. This application digitises that entire workflow.

**A regular user** can sign up, create business documents (or upload a PDF), and submit them for review. The app can automatically generate an AI summary and suggest the right category. Once submitted, the user receives a notification whenever the CEO takes action on their document, and can communicate directly via comments.

**The CEO** sees every document across the organisation in a centralised dashboard. They can approve, reject, or request changes by updating the document status — either from the dashboard with a single click or from the detail page. When a new document is submitted, the CEO gets an instant notification. They can also leave comments to explain decisions or ask for more information.

The result is a transparent, traceable workflow where every document has a clear owner, a defined status, a full comment history, and automatic notifications — eliminating back-and-forth emails and lost documents.

---

## Overview

### Key capabilities

- **Document lifecycle management** — create, edit, delete, and track documents through Draft, Review, Approved, and Rejected states
- **Role-based access control** — two distinct roles (CEO and User) with different permissions and views
- **Approval workflow** — CEO reviews and changes document status directly from the dashboard or detail view
- **Notification system** — automatic alerts when documents are submitted (CEO) or status changes (User)
- **Comment system** — threaded communication between CEO and document owner on each document
- **AI integration** — automatic document summarisation and category suggestion via local LLM
- **PDF upload** — in-browser text extraction from uploaded PDF files
- **Secure authentication** — bcrypt password hashing, token-based sessions, protected routes

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Vue 3 | UI framework (Composition API, `<script setup>`, TypeScript) |
| Pinia | State management (auth, documents, notifications) |
| Vue Router | Client-side routing with auth guards |
| Tailwind CSS 4 | Utility-first styling |
| Vite | Build tool and dev server |
| pdfjs-dist | In-browser PDF text extraction |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety across the stack |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Relational data storage |
| Zod | Request payload validation |
| bcrypt | Password hashing |

### AI

| Technology | Purpose |
|---|---|
| Ollama | Local LLM inference |
| Configurable endpoint | Summarisation and category suggestion |

---

## Architecture

```
ai-document-workflow/
├── client/                     # Vue 3 single-page application
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── ai/             # AI summary panel
│       │   ├── documents/      # StatusBadge, DocumentCard, filters, selects
│       │   └── layout/         # AppHeader, AppSidebar
│       ├── pages/              # Route-level views
│       ├── stores/             # Pinia stores (auth, documents, notifications)
│       ├── services/           # API service layer
│       ├── constants/          # Document categories and statuses
│       ├── types/              # TypeScript type definitions
│       └── utils/              # Helpers (PDF, age validation, text)
│
└── server/                     # Express REST API
    ├── prisma/                 # Schema and migrations
    └── src/
        ├── auth/               # User management and session logic
        ├── controllers/        # Route handlers
        ├── middlewares/        # Auth guard, validation
        ├── routes/             # Route definitions
        ├── utils/              # Notifications, document access, helpers
        └── lib/                # Prisma client instance
```

---

## Data Model

| Model | Description |
|---|---|
| **User** | Email, username, birth date, profile data, role (CEO / USER), hashed password |
| **Session** | Token-based authentication sessions linked to users |
| **Document** | Title, description, category, status, owner, AI-generated fields, timestamps |
| **Notification** | Per-user alerts with read/unread state, linked to documents |
| **Comment** | Threaded messages on documents with author reference |

---

## User Roles

### CEO
- Views all documents across the organisation
- Changes document status (Draft → Review → Approved / Rejected)
- Receives notifications when users submit new documents
- Communicates with document owners via comments

### User
- Creates and manages personal documents
- Uploads PDFs with automatic text extraction
- Requests AI summaries and category suggestions
- Receives notifications when document status changes
- Communicates with CEO via comments

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new user account |
| POST | `/auth/login` | Authenticate and receive session token |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/profile` | Update profile information |
| POST | `/auth/verify-password` | Verify current password |
| PUT | `/auth/change-password` | Change password |

### Documents

| Method | Endpoint | Description |
|---|---|---|
| GET | `/documents` | List documents (filtered by role) |
| GET | `/documents/:id` | Get document details |
| POST | `/documents` | Create a new document |
| PUT | `/documents/:id` | Update document (status changes CEO-only) |
| DELETE | `/documents/:id` | Delete a document |

### Comments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/documents/:id/comments` | List comments on a document |
| POST | `/documents/:id/comments` | Add a comment to a document |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | List user notifications |
| GET | `/notifications/unread-count` | Get unread notification count |
| PUT | `/notifications/:id/read` | Mark a notification as read |
| PUT | `/notifications/read-all` | Mark all notifications as read |

### AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/summarize` | Generate document summary |
| POST | `/ai/suggest-category` | Suggest document category |

---

## Local Development

### Prerequisites

- Node.js 20.19+ or 22.12+
- PostgreSQL running on localhost:5432
- Ollama running on localhost:11434 (optional, for AI features)

### Setup

```bash
git clone <repository-url>
cd ai-document-workflow

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### Environment Configuration

Create `server/.env`:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/document_workflow"
CEO_EMAIL="<ceo-email>"
CEO_PASSWORD="<ceo-password>"
OLLAMA_URL="http://localhost:11434"
```

Create `client/.env`:

```env
VITE_API_BASE_URL="http://localhost:3001"
```

### Database

```bash
cd server
npx prisma migrate dev
```

### Run

In two separate terminals:

```bash
# Terminal 1 — API server
cd server && npm run dev
```

```bash
# Terminal 2 — Frontend
cd client && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001 |

---

## Engineering Highlights

- **Type safety** — TypeScript across both client and server with strict type checking
- **Centralised API layer** — single `apiRequest` function handles auth headers, error parsing, session expiry, and network errors
- **Validation at the boundary** — Zod schemas validate every incoming request on the server
- **Domain-separated stores** — Pinia stores for auth, documents, and notifications with clean boundaries
- **Reusable components** — `PasswordInput`, `StatusBadge`, `CategorySelect`, `DocumentStatusSelect` used across multiple views
- **Secure by default** — bcrypt password hashing, role checks on both client and server, ownership-scoped data access
- **Automatic notifications** — triggered server-side when documents are created or status changes, with client-side polling

---

## Future Improvements

- WebSocket integration for real-time notifications
- Automated test coverage (unit, integration, e2e)
- CI/CD pipeline (lint, type-check, test, build)
- Document pagination and advanced search
- File attachment storage (S3 / local)
- Audit log for document state transitions

---

## Author

**Nelson Ribeiro**

Full-stack developer — Vue.js, TypeScript, Node.js, PostgreSQL.

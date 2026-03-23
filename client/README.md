# Frontend (`client/`)

Vue 3 + Vite + TypeScript SPA for the AI Document Workflow app.

See the repository root **[README.md](../README.md)** for purpose, features, stack, and how to run the full project.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server (Vite)        |
| `npm run build` | Production build        |
| `npm run type-check` | `vue-tsc`           |
| `npm run lint` | ESLint + Oxlint          |
| `npm run test:unit` | Vitest              |

## Configuration

- API base URL: `VITE_API_BASE_URL` (defaults to `http://localhost:3001` — see `src/services/api.ts`).

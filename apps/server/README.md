# FinQ Server

Node.js + TypeScript + Express API backing the FinQ client. Persists "saved" people in a local SQLite database using Node's built-in `node:sqlite` module (no native dependencies, no Docker).

## Prerequisites

- Node.js **>= 22.5** (this project uses the built-in `node:sqlite` module, which requires this version or later; it is still marked experimental by Node and will print an `ExperimentalWarning` on startup — that's expected). Developed and tested against Node v23.11.0.
- npm 10+ (the repo is an npm-workspaces monorepo; there is a root `.npmrc` with `legacy-peer-deps=true` to work around a known npm/arborist crash with this dependency graph — no action needed on your part).

## Install

From the **repository root** (not this folder) — this is an npm workspaces monorepo, so all installs happen once at the root:

```bash
npm install
```

## Run

```bash
npm run serve:server
# or: npx nx serve server
```

The API listens on `http://localhost:3333` by default. A SQLite file is created at `./finq.db` (relative to the repo root) on first run and reused on subsequent runs — data survives restarts.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3333` | Port the server listens on |
| `HOST` | `localhost` | Host the server binds to |
| `DB_PATH` | `finq.db` | Path to the SQLite database file |

## API

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/health` | — | `200 { status: 'ok' }` |
| GET | `/people` | — | `200 Person[]` |
| POST | `/people` | `CreatePersonDto` | `201 Person` / `400` on invalid body |
| PATCH | `/people/:id` | `Partial<CreatePersonDto>` | `200 Person` / `404` if not found / `400` on invalid body |
| DELETE | `/people/:id` | — | `204` / `404` if not found |

Request bodies are validated against the Zod schemas in `@finq/shared-types` (also used by the client), so a malformed request returns `400` with the validation issue details.

## Testing

```bash
npx nx test server                    # unit tests (service layer, mocked repository)
npx nx test @finq/server-data-access  # unit tests (repository, real in-memory SQLite)
npm run test:integration              # from repo root: Supertest against the real Express app
```

## Project structure

```
apps/server/src/
  main.ts            # process bootstrap
  app.ts             # composition root: wires db -> repository -> service -> controller -> routes
  controllers/        # HTTP request/response glue, Zod validation
  routes/
  services/           # business logic, orchestrates the repository
  middleware/          # centralized error -> HTTP status mapping
libs/server/data-access/   # db connection, migration, repository (SQLite persistence)
libs/shared/types/         # Zod schemas + inferred types shared with the client
```

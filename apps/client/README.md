# FinQ Client

React + TypeScript + Mantine UI app for browsing random people (via [randomuser.me](https://randomuser.me/)) and persisting a subset of them to the FinQ server.

## Prerequisites

- Node.js **>= 22.5** (developed and tested against Node v23.11.0).
- npm 10+.
- The [FinQ server](../server/README.md) running (defaults to `http://localhost:3333`).

## Install

From the **repository root** (not this folder) — this is an npm workspaces monorepo:

```bash
npm install
```

## Run

```bash
npm run serve:client
# or: npx nx serve client
```

Opens on `http://localhost:4200`. Requires the server to be running for the "History"/Saved Profiles screen and for Save/Update/Delete to work; the "Fetch"/Random List screen only needs network access to `randomuser.me`.

To run both client and server together:

```bash
npm run dev
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3333` | Base URL of the FinQ server API |

Set it in an `apps/client/.env.local` file if you need to point at a server running elsewhere:

```
VITE_API_BASE_URL=http://localhost:4000
```

## Testing

```bash
npx nx test client        # unit test runner is configured (Vitest) but no component unit tests are included — see DECISIONS.md
```

The e2e suite (Playwright, drives a real browser through all 4 screens) lives at the repo root, not inside this app — see the [root README](../../README.md#test) for how to run it, including a fallback for machines where Playwright's browser install doesn't work.

## Project structure

```
apps/client/src/
  main.tsx           # MantineProvider + QueryClientProvider + BrowserRouter
  app/app.tsx        # route definitions
  pages/             # the 4 screens (Home, RandomList, SavedProfiles, ProfileDetail)
  components/        # shared list/row/filter UI used by both list screens
  api/               # fetch wrappers: randomuser.me and the FinQ backend
  store/             # Zustand store for the in-session random list (see DECISIONS.md)
  hooks/             # usePersonSource: resolves a profile + its origin for Screen 3
```

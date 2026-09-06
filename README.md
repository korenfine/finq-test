# FinQ

Nx monorepo: a React client ([`apps/client`](apps/client/README.md)) and a Node/TypeScript server ([`apps/server`](apps/server/README.md)) for browsing random people and persisting a subset of them.

See `DECISIONS.md` for architectural tradeoffs and `AI_USAGE.md` for AI tooling disclosure.

## Prerequisites

- Node.js **>= 22.5** (uses the built-in `node:sqlite` module). Developed and tested against Node v23.11.0.
- npm 10+.

## Install

```bash
npm install
```

## Run

```bash
npm run dev              # client (http://localhost:4200) + server (http://localhost:3333) together
npm run serve:client     # client only
npm run serve:server     # server only
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test             # unit tests: server, server-data-access, client
npm run test:integration # Supertest against the real Express app
npm run test:e2e         # Playwright, drives a real browser through all 4 screens
```

The e2e suite needs a one-time browser install: `npx playwright install chromium`.

If that install fails outright (e.g. an older Linux distro where Playwright's bundled Chromium build isn't supported at all) and you already have Google Chrome installed on the machine, point Playwright at it instead — no download needed:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

This is a plain environment variable read by `playwright.config.ts`; leaving it unset uses Playwright's normal bundled-Chromium behavior, so it's safe to ignore on any machine where the standard install works.

## Other checks

```bash
npm run typecheck
npm run lint
```

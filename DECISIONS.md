# Decisions

## 1. SQLite over Postgres, and `node:sqlite` over `better-sqlite3`

An in-memory server array would lose every saved profile on restart, defeating the point of a persisted History screen, so some real persistence was non-negotiable. Postgres (or Docker+Postgres) is real infrastructure — a separate process, connection config — for a table with a handful of rows and no concurrent-writer story; I judged that disproportionate for this scope. SQLite gives an actual relational DB (schema, SQL, no data-shape guessing like a JSON file) with zero extra infrastructure. **Tradeoff:** it doesn't scale past one writer/one instance; in production, past a single small dataset, I'd move to Postgres. For the driver, I started with `better-sqlite3` (a native addon), but its prebuilt binary failed to load on my dev machine (`GLIBC_2.33' not found` — an old Ubuntu 20.04 box). Rather than fight native compilation, I switched to Node's own built-in `node:sqlite` (stable-ish since Node 22.5): zero external dependency, nothing to break on a grader's machine, at the cost of it still being "experimental" and less battle-tested.

## 2. TanStack Query for server state, Zustand only for the in-session random list

Server data (the randomuser.me batch, saved profiles) goes through TanStack Query for free caching/loading/error handling and mutation-driven invalidation. Zustand holds exactly one thing: the mutable copy of Screen 1's people, because editing an unsaved profile must survive navigating to Screen 3 and back, and a query cache isn't meant to be hand-mutated. Filter text lives in neither — it's per-screen, ephemeral, so plain `useState` is right. **Tradeoff:** three state mechanisms is more moving parts than one global store, but each owns exactly what needs its lifetime — a single store would make the "server data vs. client edit buffer" split implicit instead of structural.

## 3. Filtering: debounced name search + a country `Select`

Screens 1 and 2 debounce the name filter 300ms (`useDebouncedValue`) and filter country via a `Select` of the countries actually present, not free text. **Tradeoff:** at 10–20 rows, debouncing has no real performance justification — the app originally filtered instantly with no debounce. I switched after a visual redesign turned the table into a card list (more DOM per row), where debounce reduces render churn while typing and matches common production search UX. The `Select` is a clearer win regardless: it guarantees every option matches something and removes typo-driven dead ends, at the cost of deriving/passing down the option list and not scaling past a few dozen distinct values without type-ahead.

## RTL/LTR (BiDi) approach — Screen 3

The whole screen is wrapped in one `dir="rtl"` container with Hebrew labels ("שם", "מגדר", "כתובת", "פרטי קשר"). The four fields that must stay LTR — editable name, email, phone, street number — get `dir="ltr"` plus `textAlign: left`, since those are exactly the fields with punctuation/digits that break under naive RTL embedding. Everything else is plain single-word Latin text the browser's bidi algorithm already handles correctly inside an RTL run. Buttons stay in logical JSX order; the RTL container mirrors them visually. Two gotchas: the delete-confirmation `Modal` portals to `document.body`, outside the RTL div's DOM subtree, so it needs its own `dir="rtl"` wrapper; and — caught only by actually running e2e, not by eyeballing the screen — Mantine's `TextInput` doesn't forward a top-level `dir` prop to the real `<input>` at all (only to its wrapper `<div>`), fixed via `attributes={{ input: { dir: 'ltr' } }}`, Mantine's escape hatch for targeting inner elements directly.

## Corners cut deliberately

- **No dedup on Save** — nothing stops saving the same randomuser.me person twice (no unique constraint on any external id). In production I'd add one and reject-or-upsert on conflict.
- **No auth, or optimistic UI on Save/Update/Delete** — out of scope for a 4-endpoint backend with no auth requirement. History does paginate client-side (10/page) once the list got long, but deliberately not server-side — it's just chunking a list already fetched in full; a production-scale list would need real server-side pagination.
- **No component-level client unit tests** — covered by Playwright e2e (closer to what matters: the 4-screen flow) plus full typechecking.
- **Playwright's bundled Chromium can't install on this dev box** (old Ubuntu 20.04) — worked around it with `PLAYWRIGHT_CHANNEL=chrome` (drives the system-installed Chrome instead; see root README) rather than skipping e2e entirely. Worth it: running the suite for real, not just syntax-checking it, is what caught the `TextInput` bug above.

## Extension

**Loading, empty, and error states across every screen**, not just the happy path: skeleton placeholders while fetching, a dedicated empty state with a concrete next action ("Clear filters" / "Find people") when there's genuinely nothing to show, and a plain-language error `Alert` with a "Try again" retry — instead of a bare spinner or blank screen on failure. I picked this over optimistic updates or an accessibility pass because every real screen here needs it, not just one interaction. With another hour: keyboard navigation through the list and a focus trap in the delete-confirmation modal.

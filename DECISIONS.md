# Decisions

## 1. `node:sqlite` instead of `better-sqlite3`

I started with `better-sqlite3` (a native addon). Its prebuilt binary failed to load on my dev machine (`GLIBC_2.33' not found` — an old Ubuntu 20.04 box). Rather than fight native compilation, I switched to Node's own built-in `node:sqlite` (stable-ish since Node 22.5): same relational/SQL story, zero external dependency, nothing to break on a grader's machine. **Tradeoff:** it's still "experimental," so its API could shift, and it's less battle-tested than `better-sqlite3`. I judged portability across unknown machines worth more than API stability here. In production I'd pin a Node LTS and revisit, or move to Postgres once a single file stopped being enough.

## 2. TanStack Query for server state, Zustand only for the in-session random list

Server data (the randomuser.me batch, saved profiles) goes through TanStack Query for free caching/loading/error handling and mutation-driven invalidation. Zustand holds exactly one thing: the mutable copy of Screen 1's people, because editing an unsaved profile must survive navigating to Screen 3 and back, and a query cache isn't meant to be hand-mutated. Filter text lives in neither — it's per-screen, ephemeral, so plain `useState` is right. **Tradeoff:** three state mechanisms is more moving parts than one global store, but each owns exactly what needs its lifetime — a single store would make the "server data vs. client edit buffer" split implicit instead of structural.

## 3. Filtering: debounced name search + a country `Select`

Screens 1 and 2 debounce the name filter 300ms (`useDebouncedValue`) and filter country via a `Select` of the countries actually present, not free text. **Tradeoff:** at 10–20 rows, debouncing has no real performance justification — the app originally filtered instantly with no debounce. I switched after a visual redesign turned the table into a card list (more DOM per row), where debounce reduces render churn while typing and matches common production search UX. The `Select` is a clearer win regardless: it guarantees every option matches something and removes typo-driven dead ends, at the cost of deriving/passing down the option list and not scaling past a few dozen distinct values without type-ahead.

## RTL/LTR (BiDi) approach — Screen 3

The whole screen is wrapped in one `dir="rtl"` container with Hebrew labels ("שם", "מגדר", "כתובת", "פרטי קשר"). The four fields that must stay LTR — editable name, email, phone, street number — each get `dir="ltr"` plus `textAlign: left`, since those are exactly the fields with punctuation/digits that break under naive RTL embedding (the name field needs it as an `<input>` attribute, not just CSS, since it's an editable cursor). Everything else is plain single-word Latin text the browser's own bidi algorithm already handles inside an RTL run. Buttons stay in logical JSX order; the RTL flex container mirrors them visually. One gotcha: Mantine's delete-confirmation `Modal` portals to `document.body`, outside the RTL div's subtree — `dir` doesn't travel through React context, so the modal (and its title, rendered in a separate slot) needed its own `dir="rtl"` wrapper or its Hebrew text would render LTR despite the rest of the screen looking correct.

## Corners cut deliberately

- **No dedup on Save** — nothing stops saving the same randomuser.me person twice (no unique constraint on any external id). In production I'd add one and reject-or-upsert on conflict.
- **No auth, or optimistic UI on Save/Update/Delete.** Out of scope for a 4-endpoint backend with no auth requirement. History does paginate (client-side, 10/page) once the saved list actually got long enough to feel cluttered — deliberately not server-side pagination, since it's just chunking a list already fetched in full; a production-scale saved list would need real server-side pagination instead.
- **No component-level client unit tests** — covered by Playwright e2e (closer to what matters: the 4-screen flow) plus full typechecking.
- **Playwright's bundled Chromium can't install on this dev box** (old Ubuntu 20.04). Worked around it by pointing Playwright at the system-installed Chrome instead (`PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` — see client README) rather than skipping e2e entirely. Actually running the suite this way caught a real bug: Mantine's `TextInput` only forwards a top-level `dir` prop to its wrapper `<div>`, not the real `<input>` — the name field still *rendered* LTR (inherited CSS `direction`), but never carried the `dir="ltr"` attribute my own RTL write-up claimed it did. Fixed with Mantine's `attributes={{ input: { dir: 'ltr' } }}` escape hatch, which targets the actual input element.

## Extension

**Loading, empty, and error states across every screen**, not just the happy path: skeleton placeholders while fetching, a dedicated empty state with a concrete next action ("Clear filters" / "Find people") when there's genuinely nothing to show, and a plain-language error `Alert` with a "Try again" retry — instead of a bare spinner or blank screen on failure. I picked this over optimistic updates or an accessibility pass because every real screen here needs it, not just one interaction. With another hour: keyboard navigation through the list and a focus trap in the delete-confirmation modal.

# KisanSetu Progress

Read this file and `.github/copilot-instructions.md` before starting work.

Only one numbered step is worked on at a time. Stop after the current step and wait for `next`.

## Current position

- **Current step:** Phase 0, step 0.1
- **Status:** Complete
- **Next step:** Phase 0, step 0.2, only after the user says `next`

## Phase 0: Setup

- [x] 0.1 Create the folder structure, gitignore, environment examples, root README, progress tracker, and known-gaps document.
- [ ] 0.2 Explain PostgreSQL installation or local connection on Windows, ask before choosing a tool, create the `kisansetu` database, and explain connection strings.

## Phase 1: Backend for labour

- [ ] B1 Set up Express, scripts, backend folders, and migration runner.
- [ ] B2 Add migration 001 and seed data for farmers, workers, and requests.
- [ ] B3 Add `GET /api/v1/health` with a database connectivity check.
- [ ] B4 Add farmers and workers endpoints.
- [ ] B5 Add labour request endpoints and response counts.
- [ ] B6 Add the swappable console notifier and Hindi/English message templates.
- [ ] B7 Add the public worker reply endpoint.
- [ ] B8 Add validation and consistent error handling.
- [ ] B9 Add labour-request and reply rate limits.
- [ ] B10 Add temporary admin endpoints protected by `X-Admin-Key`.
- [ ] B11 Add backend tests.
- [ ] B12 Write complete API and frontend integration documentation.

## Phase 2: Frontend for labour

- [ ] F1 Set up Vite, React, Tailwind, routing, app shell, and tab bar.
- [ ] F2 Add Hindi-default internationalisation, English toggle, and glossary.
- [ ] F3 Add central API access, mock mode, error handling, and `useFarmer`.
- [ ] F4 Add shared components and pure money/date helpers.
- [ ] F5 Build the farmer start and consent flow.
- [ ] F6 Build home and the guided labour-request flow.
- [ ] F7 Build the labour-request status page.
- [ ] F8 Build the worker list, add, edit, paste, and delete flows.
- [ ] F9 Build the public worker reply page.
- [ ] F10 Connect the frontend to the real backend and document mismatches.

## Phase 3: Stop and test with real people

- [ ] Do not continue until the user says `Phase 3 done`.
- [ ] Write the five-farmer pilot checklist and one-page observation summary.
- [ ] Ask which messaging channel workers actually use; do not choose one.

## Phase 4: Crops and costs

- [ ] C1 Add migration 002 for crop cycles, expenses, and sales.
- [ ] C2 Write and test the pure `calculateSummary` function first.
- [ ] C3 Add crop-cycle, expense, sale, and summary backend APIs.
- [ ] C4 Build the crop-cycle creation and crop list screens.
- [ ] C5 Build the crop dashboard and estimate/actual profit display.
- [ ] C6 Build the guided expense-entry screen and offline entry option.
- [ ] C7 Build the actual sale screen.

## Phase 5: Provisional data features

- [ ] P1 Build the mock-data price board with provenance and freshness labels.
- [ ] P2 Build the provisional MSP screen with its no-guarantee statement.
- [ ] P3 Build the source-labelled crop calendar after source verification.

## Phase 6: Polish

- [ ] Q1 Build the temporary read-only admin page.
- [ ] Q2 Add privacy notice and matching data-view/delete endpoints.
- [ ] Q3 Build the help page with estimates, source, and no-guarantee explanations.
- [ ] Q4 Review accessibility, states, reduced motion, PWA shell caching, and design/honesty rules.
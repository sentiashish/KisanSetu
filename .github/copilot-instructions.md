# KisanSetu project instructions

## Product and delivery order

KisanSetu is a simple mobile-first web app for village farmers in Bihar. The first feature is labour availability: a farmer saves known local workers with a name and phone number, sends one availability request to them, and sees who replies. The second feature is simple crop cost tracking with clearly labelled estimated profit.

Build the labour feature end to end before crop costs. Prices, support price, and crop calendar features come last and remain provisional. Stop Phase 3 until the user explicitly says `Phase 3 done`.

## How to work

- Do one numbered step at a time, then stop and wait for `next`.
- After each step explain what was built and why, give exact Windows PowerShell run/test commands, list uncertainties, update `docs/PROGRESS.md`, and suggest a commit message.
- Ask one short question when a decision is unclear. Do not guess.
- Do not add unrequested features, libraries, or files. Ask before adding a dependency and explain its purpose and alternative.
- Prefer simple, boring code that a student can understand. Comment only the WHY when it is not obvious.
- Never invent data, sources, statistics, or Hindi terms. Say when something is uncertain.
- Read this file and `docs/PROGRESS.md` before starting work in a new chat.

## Technical rules

- Frontend: Vite + React JavaScript, Tailwind CSS, `react-router-dom`, and `lucide-react` only for UI libraries. Use system fonts with a Devanagari fallback.
- Backend: Node.js + Express ES modules, MySQL with `mysql2` and plain SQL, `dotenv`, `cors`, Vitest, and Supertest.
- API base path is `/api/v1`. Return JSON only. Errors use `{ "error": { "code": "SOME_CODE", "message": "..." } }`.
- Money is integer rupees, never floats. Dates are `YYYY-MM-DD`.
- Migrations are numbered SQL files in `database/migrations` and run in order by a small script.
- Backend flow is routes (HTTP only) -> services (logic) -> db (SQL).
- Frontend API calls belong in `src/api.js`, user-visible text in `src/i18n.js` with Hindi `hi` as default and English `en`, pure helpers in `src/lib`, and farmer identity in one `useFarmer` hook.
- When `VITE_USE_MOCK=true`, mock data must cover empty, loading, error, offline, and closed states.
- All `localStorage` access must be inside `try/catch`.

## UX and language rules

- Design for Bihar farmers, low literacy, cheap Android phones, bright sunlight, weak networks, and shared phones.
- Every task should finish in under 30 seconds and four taps or fewer. Design for 360px width first.
- Body text is at least 18px. Buttons are at least 56px tall, well-spaced, and primary actions are full width.
- Every action has an icon plus a word. Never use colour alone to communicate status.
- Prefer large choice buttons, number pads, steppers, and `inputMode="numeric"` over typing.
- Use one question per screen where possible and provide a clear back button.
- Hindi is simple spoken Hindi and remains draft text for native-speaker review. Keep a glossary in `i18n.js`.
- Every screen needs loading, empty, error, and offline states. Keep the language toggle reachable and respect `prefers-reduced-motion`.
- Show money with Indian grouping such as `₹1,25,000`, without decimals. Confirm destructive actions.

## Honesty and safety rules

- Never guarantee profit, prices, wages, sales, or worker availability.
- Label every calculated number as `अनुमान` and provide a `कैसे निकाला` view. Label actual values `वास्तविक`.
- Market/reference prices need a source, as-of date/time, freshness tier with icon and word, and type: Official, Entered by you, or Sample data.
- Missing data says `जानकारी उपलब्ध नहीं`. Sample/mock data visibly says `नमूना डेटा`.
- Do not provide crop-disease diagnosis, pesticide advice, or fertilizer doses.
- Do not use verified, ratings, or reliable-worker labels. Show only actual replies.
- Do not build a marketplace, buyer listings, equipment booking, payments, chatbot, WhatsApp UI, or coming-soon cards.
- Do not convert between bigha, katha, acre, or other area units. Store the value and the unit chosen by the farmer.

## Privacy and known gaps

- Phone numbers are personal data. Mask them in logs and collect only what screens need.
- Farmers add worker phone numbers themselves. Workers can reply `STOP` to opt out.
- Treat the main DPDP obligations as applicable while designing privacy flows.
- Do not fix these known gaps unless explicitly asked: real login, worker consent beyond a boolean, reply-channel choice, temporary `X-Admin-Key`, labour-need validation, or unverified price/support-price/crop-calendar sources.

## Scope guardrails

Do not continue to the next numbered step without the user's `next`. Do not start MySQL setup until Phase 0.2. Do not start crops until the labour feature is complete and the user has finished Phase 3 testing.
# KisanSetu

KisanSetu is a small mobile-first project for farmers in Bihar. The first part of the project is about finding out whether a known worker is available for a job.

The farmer can save a worker, create a labour request, and see the reply. The worker reply page is also included. WhatsApp or SMS sending is not connected yet, so the reply link has to be shared manually during testing.

## What is in the project

- `backend/` - Express API and MySQL code
- `frontend/` - Vite, React, Tailwind, and the farmer screens
- `database/` - numbered SQL migrations
- `docs/` - API notes, frontend notes, progress, and known gaps

## Run it locally

These commands are for Windows PowerShell. Start MySQL first.

```powershell
npm install
Copy-Item .env.example .env
npm run migrate
npm run seed
```

Open two terminals after setup.

Backend:

```powershell
npm run dev
```

Frontend:

```powershell
npm run dev --prefix frontend
```

Open `http://127.0.0.1:5173` in the browser. The Vite server forwards `/api` requests to the backend on port `3000`.

To use sample data without the backend, run the frontend in mock mode:

```powershell
$env:VITE_USE_MOCK='true'
npm run dev --prefix frontend -- --port 5174
```

## Useful checks

```powershell
npm run lint --prefix frontend
npm run build --prefix frontend
npx vitest run
```

## Current limits

- Worker messages are not sent by SMS or WhatsApp yet.
- The worker reply link must be opened manually.
- Farmer identity is a local browser record, not a real login.
- Worker edit and delete changes are local because matching backend endpoints do not exist yet.
- Crop costs, prices, support prices, and crop calendar work have not started.

More details are in [`docs/PROGRESS.md`](docs/PROGRESS.md) and [`docs/KNOWN_GAPS.md`](docs/KNOWN_GAPS.md).

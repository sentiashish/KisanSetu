# KisanSetu

KisanSetu is a mobile-first app for farmers in Bihar. The first feature helps a farmer ask known local workers whether they are free for a job. Crop cost tracking will come after the labour feature is tested with real people.

## Project structure

- `backend/`: Node.js and Express API code
- `database/`: SQL migrations and seed data
- `docs/`: API notes, frontend notes, progress, and known gaps
- `frontend/`: reserved for the Vite and React app in Phase 2

## Local run commands

From the repository root in Windows PowerShell:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The API runs on `http://localhost:3000` when the backend is implemented. Database setup and connection details are covered in Phase 0, step 0.2 before database commands are used.

## Progress

See [`docs/PROGRESS.md`](docs/PROGRESS.md) before starting work in a new chat.

## Important scope

The app does not provide a marketplace, payments, ratings, guaranteed prices or wages, crop-disease diagnosis, pesticide advice, fertilizer doses, or an AI chatbot. Prices and crop calendar features remain provisional until their sources are verified.
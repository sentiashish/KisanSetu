# KisanSetu frontend

This folder contains the React frontend for KisanSetu. It is a simple farmer-facing app with Hindi as the default language.

## Run

From the repository root:

```powershell
npm run dev --prefix frontend
```

The app opens at `http://127.0.0.1:5173`. In local development, API calls are sent through the Vite proxy to the backend at `http://127.0.0.1:3000`.

For sample data, use:

```powershell
$env:VITE_USE_MOCK='true'
npm run dev --prefix frontend -- --port 5174
```

## Checks

```powershell
npm run lint --prefix frontend
npm run build --prefix frontend
```

The main user flow is: save farmer details, add a known worker, send a labour request, and view the reply. There is no connected SMS or WhatsApp service yet, so workers use the reply page manually during testing.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

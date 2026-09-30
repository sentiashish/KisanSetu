# Frontend integration notes

These notes describe the current labour API contract for Phase 2. The frontend should keep all HTTP calls in `src/api.js` and all visible Hindi/English text in `src/i18n.js`.

## Recommended flow

1. Save the farmer identity in the single `useFarmer` hook.
2. Load `GET /farmers/:farmerId/workers` for the worker list.
3. Add a worker with `POST /farmers/:farmerId/workers`.
4. Send one request with `POST /farmers/:farmerId/requests`.
5. Poll or reload `GET /farmers/:farmerId/requests` for response status and `response_count`.
6. A worker reply page submits `POST /workers/reply` with `request_id`, `worker_id`, and `reply`.

## API client rules

- Prefix calls with `/api/v1`.
- During local Vite development, `/api` is proxied to `http://127.0.0.1:3000` by `frontend/vite.config.js`.
- Send `Content-Type: application/json` for POST requests.
- Parse the standard `{ error: { code, message } }` shape for non-2xx responses.
- Treat `429 RATE_LIMITED` as a temporary error and show a retry-later message.
- Treat network failures as offline state; do not assume the request was sent.
- Do not expose `ADMIN_KEY` in browser code. The admin endpoint is for a future protected admin surface only.

## Screen states

Every labour screen needs loading, empty, error, and offline states. Use the API data rather than colour alone to show status:

- `pending`: the worker has not replied.
- `accepted`: the worker replied `yes`.
- `declined`: the worker replied `no`.
- `stopped`: the worker replied `stop`.

The API currently returns phone numbers for farmer and worker records. Display only what the screen needs and avoid placing phone numbers in logs.

## Current limitations

- Farmer identity is an ID, not real login.
- Worker consent is not a complete consent flow.
- The reply channel is not selected; the backend notifier currently logs to the console.
- Request and reply rate limits are in-memory and reset when the server restarts; they are not shared across multiple server instances.
- The temporary admin key is not production authentication.
- Hindi copy is draft text and needs native-speaker review.
- The backend currently exposes worker create/list only. Worker edit and delete are therefore device-local overrides in the frontend; they are not persisted to MySQL and should be replaced with backend endpoints before production use.
- The browser farmer identity is a local device identity, not authentication. The consent checkbox records the user's acknowledgement before the existing farmer-create endpoint is called.

## Implemented Phase 2 surfaces

- Hindi is the default language; the header switches to English and stores the choice locally.
- `VITE_USE_MOCK=true` supplies sample workers and requests for the dashboard, worker list, guided request flow, and reply page. Network failures expose offline states and API errors expose retry states.
- The frontend routes are `/`, `/workers`, `/requests`, `/requests/new`, `/reply`, and `/help`.
- Worker phone numbers are masked in the list. The public reply route expects `request_id` and `worker_id` query parameters and sends `yes`, `no`, or `stop` to the existing public endpoint.

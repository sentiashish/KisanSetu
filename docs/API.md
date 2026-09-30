# KisanSetu API

The backend returns JSON and uses the `/api/v1` base path. Start the local server with:

```powershell
npm run dev
```

The default base URL is `http://localhost:3000/api/v1`.

## Common errors

Errors use this shape:

```json
{
	"error": {
		"code": "ERROR_CODE",
		"message": "Human-readable message."
	}
}
```

Validation errors return `400`. Missing records return `404`. Duplicate records return `409`. Database failures return `500` or `503`. Rate-limited requests return `429`.

## Health

### `GET /health`

Returns `200` when MySQL is reachable:

```json
{
	"status": "ok",
	"database": "connected"
}
```

## Farmers

### `GET /farmers`

Lists farmers, ordered by ID. Each item contains `id`, `name`, `phone_number`, and `created_at`.

### `POST /farmers`

Creates a farmer. Required JSON fields:

```json
{
	"name": "Example Farmer",
	"phone_number": "9000000000"
}
```

Returns `201` with the created farmer. Phone numbers must be unique.

## Workers

### `GET /farmers/:farmerId/workers`

Lists workers saved by a farmer. `farmerId` must be a positive integer.

### `POST /farmers/:farmerId/workers`

Adds a worker to a farmer:

```json
{
	"name": "Example Worker",
	"phone_number": "9111111111"
}
```

Returns `201` with the created worker. Worker phone numbers must be unique. A missing farmer returns `404`.

## Labour requests

### `GET /farmers/:farmerId/requests`

Lists requests for a farmer. Each item includes `id`, `farmer_id`, `worker_id`, `worker_name`, `message`, `status`, `created_at`, and `response_count`.

### `POST /farmers/:farmerId/requests`

Creates one request for a worker belonging to that farmer:

```json
{
	"worker_id": 2,
	"message": "Kal subah 7 baje kaam hai. Kya available ho?"
}
```

Returns `201` with the request and `response_count: 0`. A farmer may create at most 5 requests per hour in the current process.

## Public worker reply

### `POST /workers/reply`

Workers reply without farmer authentication:

```json
{
	"request_id": 1,
	"worker_id": 2,
	"reply": "yes"
}
```

Accepted replies are `yes`, `no`, and `stop`; surrounding whitespace and letter case are normalized. A worker may submit at most 10 replies per hour in the current process. Duplicate replies return `409`.

Successful response:

```json
{
	"request_id": 1,
	"worker_id": 2,
	"reply": "yes"
}
```

## Temporary admin endpoint

### `GET /admin/requests`

Requires the `X-Admin-Key` header configured by `ADMIN_KEY` in `.env`:

```http
X-Admin-Key: replace-this-for-local-development
```

Returns read-only labour request data with farmer and worker names. Missing keys return `401`; invalid keys return `403`; missing server configuration returns `503`.

This is temporary access for local development and must not be treated as real authentication.

## Local setup

Copy `.env.example` to `.env`, set `DATABASE_URL`, and set a private local `ADMIN_KEY`. Run migrations and seed data before using the routes:

```powershell
npm run migrate
npm run seed
```

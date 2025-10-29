# Country Currency & Exchange API

Node.js + Express + MySQL API that fetches countries and USD exchange rates, caches them, exposes CRUD-like endpoints, and generates a summary image.


## Prerequisites
- Node 18+
- MySQL 8+ (Workbench optional)


## Setup

1. Install deps
   npm install

2. Create database (via MySQL Workbench or CLI)
   CREATE DATABASE IF NOT EXISTS currency_api;
   USE currency_api;

3. Apply schema (from DB/schema.sql)
   -- Run the file contents in Workbench.

4. Environment
   Create `.env` in project root:
   PORT=3050
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=currency_api
   DB_POOL_LIMIT=10


   ## Run
npm start
# Server starts on http://localhost:3050 (or your PORT)


## Endpoints

### POST /countries/refresh
Fetches countries + rates, upserts DB, updates last_refreshed_at, and generates `cache/summary.png`.

- 200:
  { "ok": true }
- 503 (upstream failure):
  { "error": "External data source unavailable", "details": "Could not fetch data from REST Countries or Exchange Rates" }
- 500:
  { "error": "Internal server error" }

### GET /countries
Filters and sorting.
- Query:
  - region=... (exact)
  - currency=... (exact)
  - sort=gdp_desc|gdp_asc|name_asc|name_desc (default name_asc)
- 200:
  [ { id, name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at }, ... ]


### GET /countries/:name
Case-insensitive.
- 200: { ...country }
- 404: { "error": "Country not found" }

### DELETE /countries/:name
Case-insensitive.
- 200: { "deleted": true }
- 404: { "error": "Country not found" }

### GET /status
- 200:
  { "total_countries": 250, "last_refreshed_at": "2025-10-22T18:00:00.000Z" }

### GET /countries/image
- Serves `cache/summary.png`
- 404:
  { "error": "Summary image not found" }


  ## Image Generation
- Triggered after a successful refresh.
- Renders an SVG summary and saves PNG via `sharp` at `cache/summary.png`.
- Contains:
  - Total countries
  - Top 5 by estimated_gdp
  - Last refresh timestamp


  ## Quick Test

# Refresh data
curl -X POST http://localhost:3050/countries/refresh

# List (Africa, sorted by GDP desc)
curl "http://localhost:3050/countries?region=Africa&sort=gdp_desc"

# Single country
curl http://localhost:3050/countries/Nigeria

# Delete country
curl -X DELETE http://localhost:3050/countries/Nigeria

# Status
curl http://localhost:3050/status

# Image (view in browser)
open http://localhost:3050/countries/image
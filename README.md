# New Year Prize Draw

Next.js (App Router) + MongoDB application built from the five mockups in `Design/`:

- **Employee** – register for the draw, check the prize result with an employee ID.
- **HR / Draw & winners** – run the random draw, publish winners, view the winner list.
- **HR / Participants** – searchable, filterable, paginated registration list.
- **HR / Prize collection** – look up a winner, record collection with the handing HR staff member, and add prizes for the next draw.
- **HR / Management report** – collection stats, status by prize, CSV and PDF export.

## Setup

```bash
cp .env.example .env.local
npm install
```

Start MongoDB (local install or Atlas), then point `MONGODB_URI` at it. Defaults are `mongodb://127.0.0.1:27017` and database `new_year_prize_draw`.

Optional environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017` | MongoDB connection string |
| `MONGODB_DB` | `new_year_prize_draw` | Database name |
| `HR_STAFF_NAME` | `HR Staff` | Name recorded on prize collection and reports |

Seed demo data (80 participants, 100 prizes, 80 winners and a published draw):

```bash
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data model

Collections are created on demand:

- `events` – event config: prizes and counts, registration close date, draw/publish timestamps.
- `participants` – employee ID (primary key), name, department, registration time, status.
- `winners` – employee ID (primary key), prize, status, collection time and handing staff member.

The database layer lives in `src/lib/data.ts`; form mutations are Server Actions in `src/app/actions.ts`. `GET /api/report/csv` streams the management report as CSV.

## Notes

The HR screens have no authentication, matching the supplied mockups. Add authentication and authorization before exposing them outside a trusted network.

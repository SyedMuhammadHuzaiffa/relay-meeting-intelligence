# Relay — meeting intelligence workspace

Relay is an original meeting-intelligence interface built for this assignment. Google Stitch supplied visual and information-architecture ideas; the implemented product uses its own responsive layouts and only the capabilities backed by this repository. The Stitch exploration files are in `stitch_relay_meeting_intelligence_workspace/`.

The Next.js App Router frontend reads meetings through server-side repository code. Next.js Route Handlers handle requests and mutations; the server connects to Supabase PostgreSQL. Seeded demo records live in PostgreSQL, not in a browser mock or runtime fallback. The original `src/data/meetings.ts` remains solely as historical seed-generation input.

## Local setup

1. Run `npm install`.
2. In a Supabase project, apply `supabase/migrations/20260925000000_meeting_foundation.sql` in the SQL Editor, then apply `supabase/seed.sql`. The seed inserts missing demo records and preserves later action or summary changes. `npm run seed:generate` regenerates the seed from the historical dataset if needed; do not rerun the migration or seed on a populated database without reviewing the SQL first.
3. Apply `supabase/migrations/20260925010000_import_meetings.sql` to enable atomic imports of meeting records, participants, and transcript turns.
4. Copy `.env.example` to `.env.local`. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` locally. The secret key stays server-side; never prefix it with `NEXT_PUBLIC_` or commit `.env.local`.
5. Run `npm run dev` and open `http://localhost:3000`.

The migration enables row level security without browser policies. Server routes use the configured server key. This demo has no production authentication or per-user authorization, so it must not hold private customer meetings as-is.

## Product areas

- **Home:** database-derived meeting metrics, recent conversations, open actions, and highlight signals.
- **Meetings:** searchable archive and detailed workspace with an indexed, simulated playback timeline, stored transcript, structured brief, actions, highlights, and speaker distribution.
- **Intelligence:** meeting length and completion charts computed from stored records.
- **Library:** stored clips and highlights with public share views.
- **Ask Relay:** a rule-based demo endpoint that uses the meeting's stored notes, actions, and transcript. It is not an external AI service.

Action completion, generated summary formats, and clips are persisted in PostgreSQL. Clip links use stored IDs. Earlier timestamp-based clip links and highlight links still resolve. Playback is a timeline simulation; audio/video files are not supplied.

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/meetings` | All hydrated meetings |
| `POST /api/meetings` | Validate and persist a meeting, participants, and transcript atomically |
| `GET /api/meetings/[id]` | Full meeting record |
| `GET /api/meetings/[id]/transcript` | Ordered transcript |
| `GET /api/meetings/[id]/summary?template=enhanced` | Stored summary |
| `GET /api/meetings/[id]/analytics` | Speaker time from transcript intervals |
| `PATCH /api/action-items/[id]` | Persist action completion |
| `POST /api/clips` | Persist a transcript range |
| `GET /api/clips/[id]` | Load a saved clip |
| `POST /api/meetings/[id]/ask` | Deterministic answer using meeting data |
| `POST /api/meetings/[id]/summaries/regenerate` | Persist a structured or demo brief |

Use **Import meeting** from Home or Meetings to add a transcript. Each non-empty line uses `MM:SS Speaker: words` (or `HH:MM:SS`); square-bracket timestamps and a dash before speaker names are also accepted. Date and duration can be supplied, otherwise Relay uses the current date and derives duration from the last timestamp.

## Validation

Run `npm run lint` and `npm run build`. Local runtime verification requires the environment variables and migrated/seeded database. Without them, the UI shows a load error and the API returns a database error; it does not switch to in-memory data.

## Capture history

The `.codex` capture hooks and historical `.agent-logs/` remain in place. `CAPTURE-TEST.md` documents their original verification.

# Meeting intelligence assignment — backend foundation

This slice connects the existing meeting review interface to Supabase PostgreSQL. The visual design remains unchanged pending the separate Google Stitch design work. Recording and playback are still simulated; meetings, transcripts, summaries, actions, highlights, and clips now come from the database.

## Supabase setup

1. Create a Supabase project. In its SQL Editor, run `supabase/migrations/20260925000000_meeting_foundation.sql`, then `supabase/seed.sql`. The seed is generated from the original realistic dataset and can be reproduced with `npm run seed:generate` after `npm install`.
2. Copy `.env.example` to `.env.local`. Set `SUPABASE_URL` to the project URL and `SUPABASE_SECRET_KEY` to the project's `sb_secret_...` server key. Both are server only. Do not use a `NEXT_PUBLIC_` prefix or commit `.env.local`.
3. Run `npm install`, `npm run dev`, then visit `http://localhost:3000`.
4. For Vercel, add the same two environment variables in project settings and deploy after applying the SQL. The previous live deployment is not evidence that this new backend slice is configured.

The migration enables row level security on every table with no browser policies. All reads and writes run through server code. There is no user authentication in this assignment slice; the existing public meeting and share routes, and mutation APIs, should gain per-user authorization before using real private customer data.

## Data and API

The seed preserves six meetings, including a 2:14 test call and a 58:47 eight-participant Q4 call. It preserves the original meeting slugs, transcript order, summaries, actions, highlights, and two existing clips. The seed inserts missing rows and does not overwrite later action completion or summary changes.

Server components query the same repository used by the API. The client calls API routes for writes and Ask. Routes:

| Route | Purpose |
| --- | --- |
| `GET /api/meetings` | Meeting library |
| `GET /api/meetings/[id]` | Full meeting |
| `GET /api/meetings/[id]/transcript` | Ordered transcript |
| `GET /api/meetings/[id]/summary?template=enhanced` | Stored summary |
| `GET /api/meetings/[id]/analytics` | Talk time from stored transcript intervals |
| `PATCH /api/action-items/[id]` | Persist `{ "completed": true/false }` |
| `POST /api/clips` | Persist `{ "meetingId", "startSeconds", "endSeconds", "title"? }` |
| `GET /api/clips/[id]` | Load a stored clip |
| `POST /api/meetings/[id]/ask` | Answer `{ "question" }` from stored meeting data |
| `POST /api/meetings/[id]/summaries/regenerate` | Persist `{ "template": "enhanced"/"demo" }` |

Ask and regeneration use deterministic formatting for now. They load their source records from PostgreSQL. New clip share links use the persisted clip ID; existing timestamp-based links continue to resolve.

## Validation

```bash
npm run seed:generate
npm run lint
npm run build
```

Database integration needs the two environment variables and an applied migration/seed. Until then, the UI shows a load error and the API returns a 500 database error; it never falls back to an in-memory meeting store.

## Agent capture

The existing `.codex` hooks continue to capture Codex prompts and final responses in `.agent-logs/`. Historical logs and the capture mechanism are unchanged. `CAPTURE-TEST.md` documents their original verification.

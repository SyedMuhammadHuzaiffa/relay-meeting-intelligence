# Relay

**Relay** is a meeting-intelligence workspace for reviewing conversations after they happen. It stores meetings and transcripts in PostgreSQL, brings actions and highlights together across meetings, and lets users ask transcript-grounded questions with citations that navigate directly to the source conversation.

Relay was built with **Next.js, TypeScript, Supabase PostgreSQL, and Gemini**.

**[Live Demo](https://relay-meeting-intelligence.vercel.app)** · **[GitHub Repository](https://github.com/SyedMuhammadHuzaiffa/relay-meeting-intelligence)**

---

## Why Relay

The assignment used [Fathom](https://fathom.video/) as the product reference, but not as a UI blueprint.

Instead of reproducing Fathom pixel-for-pixel, I used the underlying meeting-intelligence problem as the starting point and designed Relay around three areas:

- a searchable meeting archive,
- a focused post-meeting workspace,
- and cross-meeting intelligence.

I deliberately prioritized the **post-meeting experience and a real backend** over building capture infrastructure.

The recording bot and transcription layer are therefore stubbed, while the parts after capture — transcripts, actions, highlights, sharing, AI Q&A, intelligence, and persistence — are implemented as working product flows.

---

## Features

### Meeting workspace

- Persistent meetings backed by PostgreSQL
- Participants and speaker-aware transcript turns
- Meeting summaries and stored briefs
- Action items with completion state
- Highlights
- Saved transcript clips
- Meeting-level analytics
- Transcript-indexed playback simulation
- Copyable transcript quotes
- Public read-only meeting sharing

### Ask Relay

Ask Relay provides meeting-specific Q&A using the stored transcript.

When Gemini is available:

1. Relay loads the meeting transcript from PostgreSQL.
2. The transcript is sent to Gemini as untrusted meeting data.
3. Gemini returns a structured answer and supporting transcript segment IDs.
4. Relay validates those IDs against the actual stored meeting.
5. Citations are rendered using trusted timestamps, speakers, and transcript data from PostgreSQL.

Clicking an evidence citation:

- opens the Transcript view,
- scrolls to the cited turn,
- focuses and highlights it,
- and moves the existing transcript timeline to that timestamp.

If Gemini is unavailable, times out, returns unusable output, or is not configured, Relay falls back to a deterministic transcript-grounded answer path.

### Meeting import

Relay can create a real persisted meeting from a timestamped transcript.

Import supports transcript lines such as:

```text
00:08 Alex: Let's get started.
00:15 Maya: The production deployment passed.
01:04 Daniel: I'll own the regression test.
```

Imported meetings persist:

- meeting metadata,
- participants,
- participant relationships,
- transcript segments.

Relay does **not** fabricate summaries, actions, or highlights for imported meetings. Those sections display honest empty states until relevant intelligence exists.

### Cross-meeting Intelligence

The Intelligence workspace derives signals from stored PostgreSQL data across multiple meetings.

It includes:

- total meetings,
- cumulative meeting time,
- open action items,
- action-item completion rate,
- unresolved actions across meetings,
- meetings needing attention,
- recurring participants,
- recent highlights.

Attention signals are deterministic and explainable — for example, a meeting may show **“3 open actions”** instead of receiving an opaque AI-generated risk score.

### Search, sharing, and organization

- Meeting search
- Speaker and participant context
- Saved transcript clips
- Public read-only share pages
- Meeting-linked actions and highlights
- Cross-meeting navigation

### Interface

- Original Relay information architecture
- Responsive desktop, tablet, and mobile layouts
- Light theme
- Dark theme
- System theme
- Persisted theme preference
- Keyboard-accessible evidence navigation
- Reduced-motion support
- Accessible focus states

---

## Architecture

### Application architecture

```text
Browser
   ↓
Next.js UI
   ↓
Next.js Route Handlers / Server Code
   ↓
Supabase PostgreSQL
```

The frontend does not use hardcoded meeting fixtures as its runtime data source.

Meetings and related records are retrieved from PostgreSQL through the server-side data layer.

### Ask Relay architecture

```text
User question
      ↓
Meeting + transcript loaded from PostgreSQL
      ↓
Gemini API
      ↓
Structured answer + transcript segment IDs
      ↓
Relay validates IDs against stored transcript
      ↓
Trusted evidence objects created server-side
      ↓
Answer + clickable transcript citations
```

Gemini never supplies trusted timestamps, speaker names, or transcript text to the UI.

Those values are resolved by Relay from the stored transcript after validating the returned segment IDs.

### Reliability

The Gemini integration includes:

- structured JSON output,
- server-side evidence validation,
- bounded request timeout,
- retries for transient provider failures,
- short exponential backoff with jitter,
- deterministic fallback behavior.

Transient statuses such as `429`, `500`, `502`, `503`, and `504` can be retried before Relay falls back.

Clear client/configuration failures are not repeatedly retried.

---

## Data Model

Relay's PostgreSQL schema includes:

### `meetings`

Stores the primary meeting record and metadata.

### `participants`

Stores participant identities.

### `meeting_participants`

Connects participants to meetings.

### `transcript_segments`

Stores ordered transcript turns, including speaker and timestamp information.

### `summaries`

Stores meeting briefs and summary content.

### `action_items`

Stores meeting-linked tasks and their completion state.

### `highlights`

Stores important transcript moments.

### `clips`

Stores saved transcript time ranges.

See the foundation migration for the exact schema:

[`supabase/migrations/20260925000000_meeting_foundation.sql`](supabase/migrations/20260925000000_meeting_foundation.sql)

The transcript-import database function is introduced in:

[`supabase/migrations/20260925010000_import_meetings.sql`](supabase/migrations/20260925010000_import_meetings.sql)

---

## Product Decisions and Tradeoffs

### Capture layer

A production meeting bot, recording service, and transcription pipeline were intentionally left outside the scope of this take-home.

The assignment explicitly allowed the capture layer to be stubbed, so I concentrated the available time on the experience after a meeting ends.

Relay's playback timeline is therefore a **transcript-indexed simulation** rather than audio/video playback.

### Real persistence

I prioritized PostgreSQL-backed runtime behavior over a frontend powered by local mock objects.

This makes behaviors such as:

- imported meetings,
- action state,
- transcript records,
- clips,
- participants,
- and cross-meeting intelligence

persist across refreshes and deployments.

### Transcript import

Without a live recording bot, I still wanted a reviewer to be able to create a genuine meeting record.

Transcript import makes the backend directly demonstrable: a timestamped conversation becomes a persisted meeting with participants and transcript segments.

### Grounded AI

Ask Relay is designed around **evidence first**.

Gemini returns transcript segment IDs, but those IDs are not trusted until Relay verifies that they belong to the current meeting.

The UI receives evidence generated from stored PostgreSQL records rather than model-generated timestamps or participant names.

### Honest empty states

Relay does not invent intelligence where none exists.

For example, a newly imported transcript may have:

- no stored brief,
- no action items,
- no highlights.

The product displays those states explicitly rather than generating placeholder content and presenting it as real analysis.

### AI fallback

Not every Ask Relay response is guaranteed to come from Gemini.

If the model is unavailable, misconfigured, times out, receives an oversized transcript, or returns unusable output, Relay can use its deterministic fallback.

This keeps the meeting workspace usable even when the external AI provider is unavailable.

---

## Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Framework   | Next.js                                       |
| Language    | TypeScript                                    |
| UI          | React                                         |
| Backend/API | Next.js Route Handlers                        |
| Database    | Supabase PostgreSQL                           |
| AI          | Google Gemini                                 |
| Deployment  | Vercel                                        |
| Testing     | Node test runner + project validation scripts |

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Prepare Supabase

Create a Supabase project and apply:

```text
supabase/migrations/20260925000000_meeting_foundation.sql
supabase/migrations/20260925010000_import_meetings.sql
```

For the sample dataset, apply:

```text
supabase/seed.sql
```

Review SQL before applying it to an existing populated database.

### 3. Configure environment variables

Copy:

```text
.env.example
```

to:

```text
.env.local
```

Configure:

```dotenv
SUPABASE_URL=
SUPABASE_SECRET_KEY=
GEMINI_API_KEY=
```

`SUPABASE_SECRET_KEY` and `GEMINI_API_KEY` are server-side credentials and must never be exposed through `NEXT_PUBLIC_*` variables.

`GEMINI_API_KEY` is optional. Without it, Ask Relay uses its deterministic fallback.

`.env.local` should remain outside Git.

### 4. Start Relay

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Importing a Meeting

Open **Meetings → Import meeting**.

Transcript lines can use formats such as:

```text
00:08 Alex: Let's get started.
00:27 - Maya: Production looks healthy.
[01:02] Daniel: I'll handle the regression test.
```

Both `MM:SS` and `HH:MM:SS` timestamps are supported.

The import workflow validates and persists the meeting, participants, and transcript rather than keeping them only in browser state.

---

## Testing

Current project scripts include:

```bash
npm run lint
npm run build
npm run test:transcript
npm run test:intelligence
npm run test:ask
```

### Transcript tests

```bash
npm run test:transcript
```

Covers transcript parsing behavior.

### Intelligence tests

```bash
npm run test:intelligence
```

Covers cross-meeting aggregation and empty-state behavior.

### Ask Relay tests

```bash
npm run test:ask
```

Covers Ask Relay and Gemini integration behavior, including:

- structured answer validation,
- evidence ID validation,
- duplicate evidence handling,
- malformed output,
- deterministic fallback,
- transient provider retries,
- non-retryable failures,
- timeout/network behavior.

### Production build

```bash
npm run build
```

Validates the production Next.js build.

---

## AI-Assisted Development

AI coding agents, primarily Codex, assisted during implementation.

The agent was used for tasks such as:

- implementation,
- codebase inspection,
- refactoring,
- test execution,
- regression checks.

Architecture, product scope, tradeoffs, feature prioritization, acceptance criteria, production verification, and final decisions remained human-directed.

The repository includes:

```text
.agent-logs/
```

These logs were captured and committed throughout development rather than added as one final dump, providing a record of the AI-assisted engineering workflow.

---

## Current Limitations

Relay is a take-home product implementation, not a production-ready multi-tenant meeting platform.

Current limitations include:

- no user authentication,
- no organization/workspace isolation,
- no row-level authorization layer for private customer meetings,
- no live meeting bot,
- no real recording pipeline,
- no transcription service,
- no stored audio/video playback,
- Ask Relay is stateless,
- no persisted AI conversation history,
- no embeddings/vector retrieval layer,
- AI responses depend on an external provider when the Gemini path is used.

Because authentication and tenant isolation are not implemented, the deployed demo should not be used for sensitive or private customer conversations.

---

## What I Would Build Next

Given more time, I would prioritize:

1. **Authentication and workspaces**  
   User accounts, organization membership, permissions, and meeting-level authorization.

2. **Real meeting ingestion**  
   Calendar integration, meeting capture, recording ingestion, and transcription.

3. **Production AI retrieval**  
   Scalable transcript retrieval for significantly larger meeting histories.

4. **Long-term organizational intelligence**  
   Decisions, recurring themes, unresolved actions, and trends across teams and time periods.

5. **Observability and security**  
   Auditability, monitoring, rate limits, background job visibility, and stronger production safeguards.

---

## Repository

**GitHub:**  
https://github.com/SyedMuhammadHuzaiffa/relay-meeting-intelligence

**Live application:**  
https://relay-meeting-intelligence.vercel.app
